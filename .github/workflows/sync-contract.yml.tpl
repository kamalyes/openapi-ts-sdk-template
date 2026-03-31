# ============================================================================
# 协议同步 | Contract sync
#
# 这条流水线把「协议中心发了新版本」变成「npm 上多了一个 SDK 版本」，全程不需要人动手
# 改代码：
#   协议中心 release.yml 发版
#     → repository_dispatch(proto-released) 打到这里
#     → 拉该 release 的聚合文档 openapi.swagger.yaml
#     → pnpm generate 重新生成 src/generated
#     → lint / typecheck / test / build 自证能用
#     → 写一个 changeset 并提交到主干
#     → release.yml（changesets）开版本 PR，合并后发 npm
#
# 为什么不直接在这里 npm publish：changesets 的两段式发布是这个仓库唯一的发版口径，
# 版本号与 CHANGELOG 都由它生成。绕过去直接 publish 会让 CHANGELOG 缺一条记录，
# 而「这个 SDK 版本对应哪个协议版本」恰恰是出问题时最先要查的东西。
# 所以这里只负责「把变更和一条 changeset 推上主干」，发布仍然走原来的路。
#
# 为什么写 changeset 而不是直接改 package.json 的 version：changeset 会把这条记录
# 写进 CHANGELOG，于是 npm 上每个版本都能回溯到具体的协议 tag。
#
# [EN] This pipeline turns "the contract hub released a new version" into "a new SDK version on
# npm" without anybody editing code:
#   hub release.yml publishes
#     -> repository_dispatch(proto-released) lands here
#     -> fetch that release's aggregated openapi.swagger.yaml
#     -> pnpm generate rewrites src/generated
#     -> lint / typecheck / test / build prove it works
#     -> write a changeset and commit to the trunk
#     -> release.yml (changesets) opens the version PR, merging it publishes to npm
#
# Why not npm publish straight from here: the two-phase changesets flow is this repository's only
# release path, and it owns both the version number and the CHANGELOG. Bypassing it would leave a
# gap in the CHANGELOG, and "which contract version is this SDK built from" is the very first
# thing anyone looks up when something breaks. So this workflow only pushes the regenerated code
# plus one changeset; publishing stays where it was.
#
# A changeset rather than a direct package.json version bump, because the changeset lands in the
# CHANGELOG, making every npm version traceable back to a concrete contract tag.
#
# 需要的配置 | Required configuration:
#   vars.PROTO_REPO                 协议中心仓库（覆盖模板默认值）| contract hub repo, overrides the template default
#   secrets.OPS_CLI_APP_ID          协议中心是私有仓库时必须配 | required when the hub is private
#   secrets.OPS_CLI_APP_PRIVATE_KEY 同上 | same
# ============================================================================

name: Sync Contract

run-name: 📦 [sync-contract] ${{ github.event.client_payload.version || inputs.version }}

permissions:
  contents: write
  # 推主干用的是 GITHUB_TOKEN，而用它推送的提交不会触发任何工作流（GitHub 防递归的
  # 硬性限制），所以推完要显式唤起 release.yml，这需要 actions: write。
  # [EN] The trunk push uses GITHUB_TOKEN, and commits pushed with it never trigger a workflow
  # (GitHub's anti-recursion rule), so release.yml must be invoked explicitly, which needs this
  actions: write

on:
  repository_dispatch:
    types:
      - proto-released
  workflow_dispatch:
    inputs:
      version:
        description: '协议版本（release tag，填 latest 取最新）| Contract version (release tag), or latest'
        required: true
        type: string
        default: latest
      bump:
        description: 'SDK 版本递增级别 | SDK changeset level'
        required: false
        type: choice
        options:
          - patch
          - minor
          - major
        default: minor

concurrency:
  group: sync-contract
  cancel-in-progress: false

jobs:
  sync:
    name: Regenerate From Contract
    runs-on: ubuntu-latest
    timeout-minutes: 20

    env:
      OPS_CLI_APP_ID: ${{ secrets.OPS_CLI_APP_ID }}

    steps:
      - name: ⬇️ 拉取代码 | Checkout
        uses: actions/checkout@v4
        with:
          ref: [[ .BaseBranch ]]
          fetch-depth: 0

      - name: 🔑 申请协议仓库读取凭证 | Mint contract read token
        id: proto-token
        # 协议中心是私有仓库时必须有这个 token：GITHUB_TOKEN 只能读本仓库。
        # 公开仓库不配 App 也能跑，下一步会退回用 GITHUB_TOKEN。
        # [EN] Required when the hub is private, since GITHUB_TOKEN only reads this repository.
        # For a public hub the App is optional; the next step falls back to GITHUB_TOKEN
        if: ${{ env.OPS_CLI_APP_ID != '' }}
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ secrets.OPS_CLI_APP_ID }}
          private-key: ${{ secrets.OPS_CLI_APP_PRIVATE_KEY }}
          owner: ${{ github.repository_owner }}

      - name: 🧮 解析协议版本与资产地址 | Resolve release asset
        id: contract
        env:
          GH_TOKEN: ${{ steps.proto-token.outputs.token || secrets.GITHUB_TOKEN }}
          PAYLOAD_REPO: ${{ github.event.client_payload.repository }}
          PAYLOAD_VERSION: ${{ github.event.client_payload.version }}
          PAYLOAD_BUMP: ${{ github.event.client_payload.bump }}
          INPUT_VERSION: ${{ inputs.version }}
          INPUT_BUMP: ${{ inputs.bump }}
          DEFAULT_REPO: ${{ vars.PROTO_REPO || '[[ .ProtoRepo ]]' }}
        run: |
          set -euo pipefail

          REPO="${PAYLOAD_REPO:-$DEFAULT_REPO}"
          if [ -z "$REPO" ]; then
            echo "❌ 未配置协议中心仓库：填仓库变量 PROTO_REPO，或重新渲染模板时填 ProtoRepo"
            exit 1
          fi

          VERSION="${PAYLOAD_VERSION:-${INPUT_VERSION:-latest}}"
          BUMP="${PAYLOAD_BUMP:-${INPUT_BUMP:-minor}}"

          # 走 API 地址而不是 browser_download_url：前者对私有仓库同样有效，
          # 代价是必须带 Accept: application/octet-stream（见 openapi.config.mjs 的说明）。
          # [EN] The API url rather than browser_download_url: it also works for a private
          # repository, at the cost of requiring Accept: application/octet-stream (see the
          # explanation in openapi.config.mjs)
          if [ "$VERSION" = "latest" ]; then
            RELEASE_JSON="$(gh api "repos/${REPO}/releases/latest")"
            VERSION="$(echo "$RELEASE_JSON" | jq -r '.tag_name')"
          else
            RELEASE_JSON="$(gh api "repos/${REPO}/releases/tags/${VERSION}")"
          fi

          ASSET_URL="$(echo "$RELEASE_JSON" | jq -r '.assets[] | select(.name == "openapi.swagger.yaml") | .url')"
          if [ -z "$ASSET_URL" ] || [ "$ASSET_URL" = "null" ]; then
            echo "❌ ${REPO}@${VERSION} 的 release 里没有 openapi.swagger.yaml 资产"
            echo "   协议中心需要跑过 release.yml（它会生成并上传聚合文档）"
            exit 1
          fi

          {
            echo "repo=${REPO}"
            echo "version=${VERSION}"
            echo "bump=${BUMP}"
            echo "asset-url=${ASSET_URL}"
          } >> "$GITHUB_OUTPUT"

          echo "📦 协议 ${REPO}@${VERSION}（级别 ${BUMP}）"

      - name: 📦 安装 pnpm | Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: 🟢 安装 Node | Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '[[ .NodeVersion ]]'
          cache: pnpm

      - name: 📥 安装依赖 | Install dependencies
        run: pnpm install --frozen-lockfile

      - name: 🔧 按协议重新生成 | Regenerate from the contract
        env:
          # 这三个环境变量就是 openapi.config.mjs 的全部外部输入
          # [EN] These three are the whole external input of openapi.config.mjs
          OPENAPI_URL: ${{ steps.contract.outputs.asset-url }}
          OPENAPI_ACCEPT: application/octet-stream
          [[ .TokenEnvName ]]: ${{ steps.proto-token.outputs.token || secrets.GITHUB_TOKEN }}
        run: pnpm generate

      - name: ✅ 自证可用 | Prove it works
        # 顺序有讲究：typecheck 先跑，因为生成代码出问题时它的报错最直接；
        # build 放最后，它才是真正要发到 npm 的产物
        # [EN] Order matters: typecheck first because its errors point straight at generated code,
        # build last because that is what actually ships to npm
        run: |
          pnpm lint
          pnpm typecheck
          pnpm test
          pnpm build

      - name: 🔍 看有没有变化 | Detect drift
        id: drift
        run: |
          set -euo pipefail
          CHANGES="$(git status --porcelain -- src/generated)"
          if [ -z "$CHANGES" ]; then
            echo "changed=false" >> "$GITHUB_OUTPUT"
            echo "✅ 生成结果与当前主干一致，无需提交" | tee -a "$GITHUB_STEP_SUMMARY"
            exit 0
          fi
          echo "changed=true" >> "$GITHUB_OUTPUT"
          {
            echo "diff<<SYNC_DIFF_EOF"
            git --no-pager diff --stat -- src/generated
            echo "SYNC_DIFF_EOF"
          } >> "$GITHUB_OUTPUT"
          {
            echo "## 📦 协议同步变更"
            echo ""
            echo '```'
            git --no-pager diff --stat -- src/generated
            echo '```'
          } >> "$GITHUB_STEP_SUMMARY"
          git --no-pager diff --stat -- src/generated

      - name: 📝 写 changeset 并提交 | Add changeset and commit
        if: steps.drift.outputs.changed == 'true'
        env:
          REPO: ${{ steps.contract.outputs.repo }}
          VERSION: ${{ steps.contract.outputs.version }}
          BUMP: ${{ steps.contract.outputs.bump }}
        run: |
          set -euo pipefail
          PKG="$(node -p "require('./package.json').name")"
          SLUG="$(echo "${VERSION}" | tr -cd '[:alnum:].-')"
          FILE=".changeset/proto-${SLUG}.md"

          # changeset 的包名必须加引号：带 scope 的名字（@org/pkg）在 YAML 里
          # 以 @ 开头，不加引号解析会失败
          # [EN] The package name must be quoted: a scoped name (@org/pkg) starts with @, which
          # is not valid unquoted YAML
          cat > "$FILE" <<CHANGESET
          ---
          '${PKG}': ${BUMP}
          ---

          同步协议 \`${REPO}@${VERSION}\`，重新生成 \`src/generated\`。

          Synced contract \`${REPO}@${VERSION}\` and regenerated \`src/generated\`.
          CHANGESET

          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git commit \
            -m "📦 deps: 同步协议 ${VERSION} 并重新生成 SDK" \
            -m "- 🔄 来源 ${REPO}@${VERSION}（${BUMP}）"$'\n'"- ✅ 生成物经 lint/typecheck/test/build 验证"
          git pull --rebase origin "[[ .BaseBranch ]]"
          git push origin "HEAD:[[ .BaseBranch ]]"
          echo "🚀 已推送到 [[ .BaseBranch ]]"

      - name: 🚀 唤起发布流程 | Kick the release pipeline
        if: steps.drift.outputs.changed == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        # 上一步用 GITHUB_TOKEN 推的提交不会触发 release.yml，所以这里显式跑一次。
        # release.yml 看到 .changeset/ 里有待发布记录，就会开「version packages」PR。
        # [EN] The previous step's commit was pushed with GITHUB_TOKEN, which never triggers
        # release.yml, so it is invoked explicitly. Seeing a pending record under .changeset/,
        # release.yml opens the "version packages" PR
        run: |
          gh workflow run release.yml --ref "[[ .BaseBranch ]]" \
            && echo "🚀 已唤起 release.yml（changesets 会开版本 PR）" \
            || echo "⚠️ 唤起失败，到 Actions 页手动运行 Release 即可"
