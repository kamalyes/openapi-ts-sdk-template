# openapi-ts-sdk-template - 可发布 npm 的 API SDK 工程模板

> `openapi-ts-sdk-template` 是一个 [kopy](https://github.com/kamalyes/kopy) 模板：`kopy new` 一条命令生成一个**工程化完备、可直接 `npm publish`** 的 TypeScript API SDK 仓库SDK 的源码由 [openapi-generator-ts-cli](https://github.com/kamalyes/openapi-generator-ts-cli) 从**远程 Swagger/OpenAPI 文档**生成，模板负责它周边的一切：构建、类型、lint、测试、版本、CI 与发布
>
> `openapi-ts-sdk-template` is a [kopy](https://github.com/kamalyes/kopy) template that scaffolds a fully engineered, publish-ready TypeScript API SDK repository in one command. The SDK sources are generated from a **remote** Swagger/OpenAPI document by openapi-generator-ts-cli; the template owns everything around it: build, types, lint, tests, versioning, CI and release.

[![kopy](https://img.shields.io/badge/kopy-template-7c3aed.svg)](https://github.com/kamalyes/kopy)
[![node](https://img.shields.io/badge/Node.js-%3E%3D20-339933.svg?logo=node.js)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10-f69220.svg?logo=pnpm)](https://pnpm.io/)
[![typescript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/badge/license-Apache--2.0-green.svg)](./LICENSE)

## 📚 文档导航 | Navigation

- [🧩 kopy 脚手架](https://github.com/kamalyes/kopy)
- [⚙️ openapi-generator-ts-cli 生成器](https://github.com/kamalyes/openapi-generator-ts-cli)
- [📦 生成项目的中文说明](./readme.tpl)（渲染后成为生成项目的 `README.md`）
- [🌍 生成项目的英文说明](./readme-en.tpl)（渲染后成为生成项目的 `README.en.md`）

## 🚀 为什么需要这个模板 | Why

生成器只负责把 OpenAPI 文档翻译成 `.ts` 文件但一个能发给别人用的 npm 包，缺的是
生成器不该管的那一半：双格式产物、类型声明、lint 规则、测试、版本号、CHANGELOG、
CI、发布凭据、provenance每个团队手搓一遍这些，就是每个团队都踩一遍同样的坑
这个模板把那一半固化下来，`kopy new` 之后只剩三步：装依赖、生成、提交

The generator only turns an OpenAPI document into `.ts` files. What a publishable npm
package still needs is the other half, which is none of the generator's business: dual
output, declarations, lint rules, tests, versioning, changelog, CI, publish credentials
and provenance. This template freezes that half, leaving three steps after `kopy new`:
install, generate, commit.

### ⚡ 模板提供什么 | What you get

- **📦 可发布的包结构**: `exports` 映射 + ESM/CJS/`.d.ts` 三件套，`files` 白名单只发 `dist`
  A publishable package shape: `exports` map, ESM/CJS/`.d.ts`, and a `files` allowlist
- **🌐 远程文档驱动的生成链路**: `openapi.config.mjs` 配置多个文档地址与鉴权，`pnpm generate` 一键同步
  Remote-document pipeline: configure URLs and auth in `openapi.config.mjs`, sync with one command
- **🧱 手写层与生成层分离**: 生成目录可随时整体覆盖，超时/重试/错误语义留在手写层
  Clean split: the generated directory is disposable, behaviour lives in hand-written code
- **🧪 开箱即绿的质量门禁**: ESLint 9 flat + Prettier + TypeScript strict + Vitest，生成出来就能全绿
  Quality gates that pass out of the box
- **🚢 两段式发布**: changesets 开版本 PR，合并即发 npm（含 provenance 溯源）
  Two-phase release via changesets, publishing with npm provenance
- **🤖 协作配套**: `.vscode` 推荐配置、dependabot 分组更新、Claude Code 项目技能
  Collaboration extras: editor settings, grouped dependabot updates, a Claude Code skill
- **🈶 中英双语注释**: 每个文件都有 banner 与逐段注释，解释的是「为什么这么做」
  Bilingual comments throughout, explaining the *why* rather than restating the code

## 📦 快速开始 | Quick start

### 环境要求 | Requirements

| 工具 \| Tool | 版本 \| Version | 用途 \| Purpose |
| --- | --- | --- |
| kopy | latest | 渲染模板 \| render the template |
| Node.js | >= 20 | 运行生成项目 \| run the generated project |
| pnpm | >= 10 | 生成项目的包管理器 \| package manager |

```bash
go install github.com/kamalyes/kopy@latest
npm install -g pnpm
```

### 生成项目 | Generate

```bash
# 交互式：逐项确认变量 | interactive
kopy new https://github.com/kamalyes/openapi-ts-sdk-template -o ./kronos-api-sdk

# 非交互：用 --var 跳过全部提问 | non-interactive
kopy new https://github.com/kamalyes/openapi-ts-sdk-template -o ./kronos-api-sdk \
  --var OrgName=kamalyes \
  --var ProjectName=kronos-api-sdk \
  --var PkgScope=kamalyes \
  --var PkgName=kronos-api-sdk \
  --var PkgFullName=@kamalyes/kronos-api-sdk \
  --var Description="Kronos 网关 API SDK" \
  --var AuthorName=kamalyes \
  --var AuthorEmail=501893067@qq.com \
  --var SwaggerUrl=https://petstore3.swagger.io/api/v3/openapi.json \
  --var TokenEnvName=OPENAPI_TOKEN \
  --var ApiBasePath=https://api.example.com \
  --var ProtoRepo=kamalyes/demo-share-proto \
  --var NodeVersion=22 \
  --var BaseBranch=master \
  --var NpmRegistry=https://registry.npmjs.org \
  --var GeneratorDep=git+https://github.com/kamalyes/openapi-generator-ts-cli.git#dist

# 预览不写盘 | preview without writing
kopy new ./openapi-ts-sdk-template -o /tmp/preview --dry-run

# 查看全部变量与默认值 | list variables and defaults
kopy list ./openapi-ts-sdk-template
```

> ⚠️ 必须用完整的 Git 地址。kopy README 里写的 `@owner/repo` 简写在当前版本**并未实现**：
> `source.isGitURL` 只认 `https://` / `http://` / `git@` / `git://` 或 `.git` 结尾，
> 传 `@kamalyes/xxx` 会被当成本地路径，报「访问模板源路径失败」。
> 带分支就用 `https://github.com/owner/repo#branch`。
>
> [EN] Use the full Git URL. The `@owner/repo` shorthand documented in kopy's README is not
> implemented in the current release: `source.isGitURL` only accepts `https://`, `http://`,
> `git@`, `git://` or a `.git` suffix, so `@kamalyes/xxx` is treated as a local path and fails
> with "访问模板源路径失败". Append `#branch` to the URL to pick a branch.


### 初始化生成出来的项目 | Bootstrap the output

```bash
cd kronos-api-sdk
pnpm install
export OPENAPI_TOKEN=<token>     # 文档需要鉴权时 | when the document requires auth
pnpm generate                    # 拉远程文档 -> src/generated
pnpm typecheck && pnpm test && pnpm build
git init && git add -A && git commit -m "chore: bootstrap sdk"
```

> ⚠️ 当前版本的 kopy 还**不会执行** `kopy.yaml` 里的 `hooks`（`bootstrap/new.go` 未调用），
> 所以上面这几步需要手动跑模板已经把 hooks 写好，等 kopy 支持后即自动生效
>
> The current kopy release does **not** execute the `hooks` block yet, so run these steps
> manually. The hooks are already declared and will activate once kopy supports them.

## 🔧 模板变量 | Template variables

| 变量 \| Variable | 类型 \| Type | 默认值 \| Default | 说明 \| Description |
| --- | --- | --- | --- |
| `OrgName` | string | `kamalyes` | GitHub 组织或用户名，用于仓库地址与生成器依赖源 |
| `ProjectName` | string | `my-api-sdk` | 仓库名 / 目录名，也写进文件头 `@FilePath` |
| `PkgScope` | string | `kamalyes` | npm scope，不带 `@`；留空则生成无 scope 包名 |
| `PkgName` | string | `[[ .ProjectName ]]` | npm 包名主体 |
| `PkgFullName` | string | `@scope/name` | 完整包名，由前两项推导，发布时真正使用 |
| `Description` | string | — | 包描述，写入 `package.json` 与 README |
| `AuthorName` | string | `kamalyes` | 作者名，写入 `package.json`、LICENSE 与文件头 |
| `AuthorEmail` | string | `example@qq.com` | 作者邮箱 |
| `SwaggerUrl` | string | `https://api.example.com/openapi.json` | **远程** OpenAPI 文档地址 |
| `TokenEnvName` | string | `OPENAPI_TOKEN` | 拉取文档时读取 Bearer Token 的环境变量名 |
| `ApiBasePath` | string | 空 \| empty | 导出的 `DEFAULT_BASE_PATH`，留空则由调用方传 |
| `ProtoRepo` | string | 空 \| empty | 协议中心仓库 `owner/repo`（由 kronos-share-proto-template 生成）；填了才接上「协议发版 → SDK 自动重新生成」这条链路，可被仓库变量 `PROTO_REPO` 覆盖 |
| `NodeVersion` | select | `22` | 写入 `engines`、`.nvmrc`、`@types/node`、CI |
| `BaseBranch` | select | `master` | CI 触发分支与 changesets 基线 |
| `NpmRegistry` | string | `https://registry.npmjs.org` | `.npmrc` 与 `publishConfig.registry` |
| `GeneratorDep` | string | `git+...#dist` | `openapi-generator-ts-cli` 的安装源 |

内置变量 `Year`（当前年份）由 kopy 注入，用于 LICENSE 与文件头版权行
The built-in `Year` variable is injected by kopy for the LICENSE and file banners.

> ⚠️ `BaseBranch` 必须与仓库真实的默认分支一致：CI 的触发分支和 changesets 的
> `baseBranch` 都取自它，填错会导致 CI 不触发、`changeset status` 直接报错
>
> `BaseBranch` must match the repository's real default branch: both the CI trigger and
> the changesets `baseBranch` come from it, and a mismatch means CI never fires and
> `changeset status` fails outright.

> ⚠️ 对已有项目重跑 `kopy new --overwrite` 会把 `src/generated/index.ts` 恢复成占位文件
> （模板和生成器写的是同一个路径），重跑后补一次 `pnpm generate` 即可
>
> Re-running `kopy new --overwrite` over an existing project restores the placeholder at
> `src/generated/index.ts` (template and generator share that path); just run
> `pnpm generate` again afterwards.

## 🏗️ 模板结构 | Template layout

```text
openapi-ts-sdk-template/
├── kopy.yaml                   # 模板定义：变量、忽略、重命名 | template definition
├── README.md                   # 模板自身说明（不进入生成项目）| template docs, never copied
├── readme.tpl                  # 渲染成生成项目的中文 README.md | becomes the output's README.md
├── readme-en.tpl               # 渲染成生成项目的英文 README.en.md | becomes README.en.md
├── LICENSE                     # Apache-2.0，版权行按变量渲染 | templated copyright line
├── package.json                # 包元信息、脚本、依赖 | package metadata and scripts
├── openapi.config.mjs          # 远程文档地址与鉴权 | remote documents and auth
├── tsconfig.json               # Bundler 解析，适配生成代码的无扩展名导入
├── tsup.config.ts              # ESM + CJS + .d.ts 构建 | dual-format build
├── vitest.config.ts            # 测试与覆盖率 | tests and coverage
├── eslint.config.mjs           # ESLint 9 扁平配置 | flat config
├── scripts/
│   ├── generate-api.mjs        # 生成链路入口 | generation entry point
│   └── check-generated.mjs     # 接口漂移检查 | drift check
├── src/
│   ├── http.ts                 # 手写 fetch 适配层（超时/重试/错误/钩子）
│   ├── index.ts                # 包入口 | package entry
│   └── generated/index.ts      # 占位文件，generate 后被覆盖 | placeholder
├── tests/                      # 手写层单测 | tests for the hand-written layer
├── .changeset/config.json      # changesets 配置 | changesets config
├── .github/                    # 全部带 .tpl，渲染时去掉（原因见「模板渲染机制」）
│   ├── workflows/ci.yml.tpl    # lint / typecheck / test / build
│   ├── workflows/release.yml.tpl  # changesets 发布 | release pipeline
│   ├── workflows/sync-contract.yml.tpl  # 协议中心发版后自动重新生成并写 changeset
│   └── dependabot.yml.tpl      # 依赖更新 | dependency updates
├── __ai_home__/                # AI 规范唯一正文，渲染时改名成 .trae / .claude / .cursor / .vscode
│   └── skills/openapi-sdk/     # 生成项目的维护指南 skill | project skill
└── .vscode/                    # 编辑器推荐配置 | editor settings
```

## 🧠 模板渲染机制 | How rendering works

写这个模板时踩到的 kopy 行为，改模板前务必先读：
Behaviours discovered while writing this template — read before editing it:

| 机制 \| Mechanism | 行为 \| Behaviour | 影响 \| Consequence |
| --- | --- | --- |
| 定界符 | `[[ ]]`，文件**内容和路径**都会渲染 | 任何字面量 `[[` 都会被当成模板语法 |
| 变量类型 | 全部是字符串，`bool` 得到 `"true"` / `"false"` | 条件必须写 `eq .X "true"`，裸 `if .X` 永远为真 |
| 执行顺序 | **先 rename 再 ignore** | 想忽略某文件，要忽略它 rename **之后**的路径 |
| ignore 匹配 | 精确 / 前缀 `dir/` / 后缀 `*.ext` / 路径段 | `*.md` 会连子目录里的 md 一起忽略 |
| hooks | 当前版本**不执行** | 初始化步骤只能写进文档让人手动跑 |
| 内置变量 | 只有 `Year` | 其余信息都要显式定义成 question |

### 为什么工作流带 .tpl 后缀 | Why the workflows carry a .tpl suffix

GitHub Actions 会解析仓库里所有 `.github/workflows/*.yml`，**包括模板仓库自己的那份**。
模板里的占位符还没渲染，`branches: - [[ .BaseBranch ]]` 会被 YAML 读成嵌套序列，
GitHub 直接报 `A sequence was not expected`，模板仓库就一直挂着无效工作流的红叉。

加 `.tpl` 后 GitHub 不再把它们当工作流（既不解析也不触发），kopy 的 rename 规则
`.yml.tpl` → `.yml` 会在生成项目里还原。`dependabot.yml` 同样处理：否则 Dependabot
会去更新模板里那份带占位符的 `package.json`，并对模板仓库自己提 PR。

[EN] GitHub Actions parses every `.github/workflows/*.yml` in a repository, the template's
own included. With placeholders unrendered, `branches: - [[ .BaseBranch ]]` parses as a nested
sequence and GitHub reports `A sequence was not expected`, leaving the template repo with a
permanently failing check. The `.tpl` suffix makes GitHub ignore them entirely, while the
`.yml.tpl` → `.yml` rename rule restores them in the generated project. `dependabot.yml` gets
the same treatment, or Dependabot would try to update the placeholder `package.json` and open
pull requests against the template itself.

### 三份 README 的分工 | Three READMEs, three audiences

模板里有三份 README，服务三类读者：
This template carries three READMEs for three audiences:

| 文件 \| File | 读者 \| Audience | 是否进入生成项目 \| Copied to output |
| --- | --- | --- |
| `README.md` | 模板维护者 | ❌ 改名后被忽略 |
| `readme.tpl` | SDK 使用方（中文） | ✅ 渲染为 `README.md` |
| `readme-en.tpl` | SDK 使用方（英文） | ✅ 渲染为 `README.en.md` |

难点在于：生成项目的中文 README 必须叫 `README.md`，而模板自己的 README 也叫
`README.md`由于 ignore 作用在 rename **之后**的路径，两者在匹配时是同一个字符串，
无法只忽略其中一个解决办法是三条有序的 rename 规则：

The catch: the generated Chinese README must be named `README.md`, and so is the
template's own README. Since ignore rules apply to post-rename paths, the two are
indistinguishable at match time. Three ordered rename rules solve it:

```yaml
rename:
  # 1. 先把模板自身的 README.md 改名成忽略标记
  - pattern: "README.md"
    value: "__kopy_template_doc__"
  # 2. 再把 readme.tpl 落位成生成项目的中文 README.md
  - pattern: "readme.tpl"
    value: "README.md"
  # 3. readme-en.tpl 落位成英文 README.en.md
  - pattern: "readme-en.tpl"
    value: "README.en.md"
ignore:
  - "__kopy_template_doc__"
```

顺序不能颠倒：规则按顺序对同一个路径字符串做 `ReplaceAll`，颠倒后第二步产出的
`README.md` 会被第一步重新改名并忽略，生成项目就没有 README 了
另外 `readme-en.tpl` 不含子串 `readme.tpl`，所以第 2 条规则不会误伤它 —— 如果把英文
模板命名成 `readme.tpl.en` 之类含有该子串的名字，就会被第 2 条改坏

The order matters: rules run as sequential `ReplaceAll` calls on the same path string.
Swapped, the `README.md` produced by step 2 would be renamed and ignored by step 1,
leaving the generated project without a README. Also note that `readme-en.tpl` does not
contain the substring `readme.tpl`, so rule 2 leaves it alone — naming it something like
`readme.tpl.en` would get it mangled by rule 2.

> 两份 README 顶部互相链接（`**简体中文** | [English](./README.en.md)`），改文案时记得
> 两边同步发布白名单 `files` 已经同时包含两份
>
> The two READMEs cross-link at the top, so keep them in sync when editing copy. The
> `files` allowlist already ships both.

## 🛠️ 二次定制 | Customizing

| 想改什么 \| Goal | 改哪里 \| Where |
| --- | --- |
| 加一个交互变量 | `kopy.yaml` 的 `questions`，然后在需要的文件里用 `[[ .NewVar ]]` |
| 换包管理器 | `package.json` 的 `engines`、两个 workflow 的 `pnpm/action-setup` |
| 换构建工具 | `tsup.config.ts` 与 `package.json` 的 `build` 脚本 |
| 换发布方式 | `.github/workflows/release.yml` 与 `.changeset/config.json` |
| 换 License | `LICENSE` 全文 + `package.json` 的 `license` 字段 |
| 加公共业务封装 | 新建 `src/*.ts` 并在 `src/index.ts` 导出，注意避开生成代码已有的导出名 |

> 新增 `src/*.ts` 时注意：生成代码已经导出了 `Configuration`、`RequestArgs`、
> `AxiosLikeInstance` 等名字，`export *` 撞名会触发 TypeScript 的 TS2308
>
> Watch out for name clashes: the generated code already exports `Configuration`,
> `RequestArgs` and `AxiosLikeInstance`; colliding `export *` names trigger TS2308.

## 🔗 三个仓库怎么串起来 | How the three repositories connect

这个模板不是孤立的，它是一条链路的末端。填上 `ProtoRepo` 之后整条链路自动跑通：

[EN] This template is the tail of a chain rather than a standalone thing. Fill in `ProtoRepo` and
the whole chain runs by itself:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ kronos-share-proto-template → 生成「协议中心」仓库                             │
│   proto 是唯一真相源，产出：                                                   │
│     pb/**                      Go 结构体与 gRPC stub（入库）                   │
│     proto/**/*.swagger.yaml    按模块拆分的 OpenAPI 文档（入库）                │
│     docs/openapi.swagger.yaml  全部模块合并的聚合文档（入库）                   │
│   release.yml 发版：校验 → 打 tag → Release 附带聚合文档 → 通知下游             │
└────────────────┬────────────────────────────────────┬────────────────────────┘
                 │ go get <module>@vX.Y.Z             │ repository_dispatch
                 ▼                                    ▼
┌────────────────────────────────┐   ┌──────────────────────────────────────────┐
│ Go 业务服务仓库                  │   │ openapi-ts-sdk-template → 生成 SDK 仓库    │
│  用 pb 里的 stub 实现 gRPC      │   │  sync-contract.yml 收到通知后：            │
│  proto-sync.yml 自动升级依赖     │   │   拉聚合文档 → pnpm generate → 验证        │
│  （模板在协议中心的 docs/ 下）    │   │   → 写 changeset → 发 npm                 │
└────────────────────────────────┘   └──────────────────────────────────────────┘
                                                      │
                                                      ▼
                                          ┌────────────────────────┐
                                          │ 前端 / Node 服务        │
                                          │  npm i @scope/xxx-sdk  │
                                          └────────────────────────┘
```

`openapi-generator-ts-cli` 在这条链路里是被本模板调用的生成器，它既能吃协议中心的聚合文档，
也能吃任何一个跑着的服务暴露的 `/openapi.json`，两种用法共用同一套 `openapi.config.mjs`。

[EN] `openapi-generator-ts-cli` is the generator this template drives. It accepts both the hub's
aggregated document and any running service's `/openapi.json`, through the same
`openapi.config.mjs`.

### 接线清单 | Wiring checklist

| 步骤 \| Step | 在哪做 \| Where |
| --- | --- |
| 1. 生成协议中心 | `kopy new .../kronos-share-proto-template`，填 `SdkRepo` 为本 SDK 仓库 |
| 2. 生成 SDK 仓库 | `kopy new .../openapi-ts-sdk-template`，填 `ProtoRepo` 为协议中心仓库 |
| 3. 配 GitHub App | 两边都配 `OPS_CLI_APP_ID` / `OPS_CLI_APP_PRIVATE_KEY`（跨仓库通知必需）|
| 4. 配 npm token | SDK 仓库配 `NPM_TOKEN` |
| 5. 验证 | 协议中心跑一次 Release Contract，看 SDK 仓库是否自动起了 Sync Contract |

## 🧩 与生成器的分工 | Division of labour

| 职责 \| Responsibility | 归属 \| Owner |
| --- | --- |
| 解析 OpenAPI 文档、推导类型、生成 API 类 | openapi-generator-ts-cli |
| 远程文档地址、鉴权、生成参数编排 | 本模板的 `openapi.config.mjs` + `scripts/` |
| 超时、重试、错误语义、钩子 | 本模板的 `src/http.ts` |
| 构建、测试、lint、版本、发布 | 本模板的工程化配置 |
| 协议版本、聚合文档、发版通知 | 协议中心（kronos-share-proto-template 生成的仓库）|

生成代码的问题请修生成器或远程文档，不要改 `src/generated/`
Fix generator or document issues upstream; never patch `src/generated/`.

## 许可证 | License

Copyright (c) 2026 by kamalyes, All Rights Reserved.

本项目基于 [Apache-2.0](./LICENSE) 协议开源
Licensed under the [Apache-2.0](./LICENSE) license.
