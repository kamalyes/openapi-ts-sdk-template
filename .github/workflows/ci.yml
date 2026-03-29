# ============================================================================
# 持续集成 | Continuous integration
#
# 这里刻意不跑 pnpm generate：SDK 的输入是远程 OpenAPI 文档，公网流水线通常
# 访问不到内网文档地址，跑了只会得到与代码质量无关的假红生成代码是提交进
# 仓库的，所以 typecheck 与 build 已经覆盖了「生成结果能否编译」
# 接口漂移检查请在能访问文档地址的环境里执行 pnpm generate:check
#
# `pnpm generate` is deliberately absent: the SDK's input is a remote OpenAPI
# document that a public runner usually cannot reach, so running it would only
# produce failures unrelated to code quality. The generated sources are committed,
# so typecheck and build already prove they compile. Run `pnpm generate:check`
# from an environment that can reach the document endpoint instead.
# ============================================================================

name: CI

on:
  push:
    branches:
      - [[ .BaseBranch ]]
  pull_request:
    branches:
      - [[ .BaseBranch ]]

jobs:
  quality:
    name: lint / typecheck / test / build
    runs-on: ubuntu-latest
    steps:
      - name: 拉取代码 | Checkout
        uses: actions/checkout@v4

      - name: 安装 pnpm | Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: 安装 Node | Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '[[ .NodeVersion ]]'
          cache: pnpm

      # --frozen-lockfile 要求 pnpm-lock.yaml 已提交，这是依赖可复现的前提
      # --frozen-lockfile requires a committed pnpm-lock.yaml, the basis of reproducible installs
      - name: 安装依赖 | Install dependencies
        run: pnpm install --frozen-lockfile

      - name: 代码检查 | Lint
        run: pnpm lint

      - name: 格式检查 | Format check
        run: pnpm format:check

      - name: 类型检查 | Typecheck
        run: pnpm typecheck

      - name: 单元测试 | Test
        run: pnpm test

      - name: 构建产物 | Build
        run: pnpm build
