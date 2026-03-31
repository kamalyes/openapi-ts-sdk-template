# [[ .PkgFullName ]] - 类型安全的 API SDK

**简体中文** | [English](./README.en.md)

> `[[ .PkgFullName ]]` 是由 [openapi-generator-ts-cli](https://github.com/[[ .OrgName ]]/openapi-generator-ts-cli) 从**远程 OpenAPI/Swagger 文档**生成的 TypeScript API 客户端接口定义是唯一真相源：服务端文档一变，重新生成即可同步类型、方法与注释；手写层只负责超时、重试、鉴权与错误语义产物同时提供 ESM / CJS / `.d.ts`，可直接 `npm publish` 给其他团队使用

[![npm](https://img.shields.io/npm/v/[[ .PkgFullName ]])](https://www.npmjs.com/package/[[ .PkgFullName ]])
[![downloads](https://img.shields.io/npm/dm/[[ .PkgFullName ]])](https://www.npmjs.com/package/[[ .PkgFullName ]])
[![node](https://img.shields.io/node/v/[[ .PkgFullName ]])](https://nodejs.org/)
[![types](https://img.shields.io/npm/types/[[ .PkgFullName ]])](https://www.typescriptlang.org/)
[![license](https://img.shields.io/github/license/[[ .OrgName ]]/[[ .ProjectName ]])](./LICENSE)
[![CI](https://github.com/[[ .OrgName ]]/[[ .ProjectName ]]/actions/workflows/ci.yml/badge.svg)](https://github.com/[[ .OrgName ]]/[[ .ProjectName ]]/actions/workflows/ci.yml)
[![release](https://img.shields.io/github/v/release/[[ .OrgName ]]/[[ .ProjectName ]])](https://github.com/[[ .OrgName ]]/[[ .ProjectName ]]/releases)
[![commit](https://img.shields.io/github/last-commit/[[ .OrgName ]]/[[ .ProjectName ]])](https://github.com/[[ .OrgName ]]/[[ .ProjectName ]]/commits)
[![issues](https://img.shields.io/github/issues/[[ .OrgName ]]/[[ .ProjectName ]])](https://github.com/[[ .OrgName ]]/[[ .ProjectName ]]/issues)

## 📚 文档导航

- [🏠 仓库主页](https://github.com/[[ .OrgName ]]/[[ .ProjectName ]])
- [📦 npm 包页面](https://www.npmjs.com/package/[[ .PkgFullName ]])
- [🐛 问题反馈](https://github.com/[[ .OrgName ]]/[[ .ProjectName ]]/issues)
- [🧩 生成器仓库](https://github.com/[[ .OrgName ]]/openapi-generator-ts-cli)
- [🌍 English README](./README.en.md)

## 🚀 为什么是「生成 + 手写」两层

### ⚡ 核心特性

- **📐 类型来自契约**: 模型、枚举、方法签名、JSDoc 全部由 OpenAPI 文档推导，不手写不漂移
- **🌐 远程文档驱动**: 直接拉取服务端暴露的文档地址，不需要把 swagger 文件复制进仓库
- **🔐 鉴权友好**: 拉取文档支持 Bearer Token 与自定义请求头，token 只从环境变量读
- **⏱️ 超时与重试**: 手写适配层提供超时取消、指数退避重试，只重试值得重试的状态码
- **🧯 统一错误语义**: 非 2xx 一律抛 `HttpError`，带 `status` / `url` / 已解析的 `body`
- **🪝 可插拔钩子**: `onRequest` / `onResponse` 注入签名、链路 ID、埋点
- **📦 双格式产物**: 一次构建产出 ESM + CJS + 类型声明，新老项目都能用
- **🚢 发布即流程**: changesets 管版本与 CHANGELOG，合 PR 即发 npm，带 provenance 溯源
- **🧪 真有测试**: 手写层用假 fetch 做完整单测，不碰网络

### 为什么生成代码要提交进仓库

远程文档地址通常在内网，公网 CI runner 访问不到如果生成产物不入库，CI 就既不能
typecheck 也不能 build，等于没有质量门禁把它提交进来还有两个额外好处：接口变更会以
可 review 的 diff 出现在 PR 里；使用方 clone 下来不需要任何凭据就能构建

## ⚠️ 重要约定

| 约定 | 说明 |
| --- | --- |
| `src/generated/` 禁止手改 | 每次 `pnpm generate` 会整体覆盖，改动必然丢失 |
| 版本号不手改 | 由 changesets 在发版 PR 中生成 |
| token 不入库 | 只通过环境变量 `[[ .TokenEnvName ]]` 注入 |
| 破坏性变更要发 major | 服务端删字段 / 改类型会让使用方编译失败 |
| lockfile 要提交 | CI 用 `--frozen-lockfile`，缺它会直接失败 |

## 🏗️ 项目结构

```text
[[ .ProjectName ]]/
├── openapi.config.mjs          # 远程文档地址、鉴权、输出目录
├── scripts/
│   ├── generate-api.mjs        # 读配置 -> 调生成器 -> 兜底修正
│   └── check-generated.mjs     # 接口漂移检查
├── src/
│   ├── generated/              # 生成代码，禁止手改
│   │   ├── apis/               # 按 tag 聚合的 API 类
│   │   ├── models/             # 接口模型
│   │   ├── enums/              # 公共枚举
│   │   ├── configuration.ts    # basePath / headers 容器
│   │   └── base.ts             # 生成代码的请求基类
│   ├── http.ts                 # 手写 fetch 适配层
│   └── index.ts                # 包入口
├── tests/                      # 手写层单测
├── .changeset/                 # 版本与变更说明
├── .github/workflows/          # CI / 发布 / 协议同步
│   ├── ci.yml                  # lint / typecheck / test / build
│   ├── release.yml             # changesets 两段式发布到 npm
│   └── sync-contract.yml       # 协议中心发版后自动重新生成
├── README.md                   # 中文说明（本文件）
└── README.en.md                # 英文说明
```

## 📦 快速开始

### 环境要求

- Node.js >= [[ .NodeVersion ]]
- pnpm >= 10

### 作为使用方安装

```bash
npm install [[ .PkgFullName ]]
# 或
pnpm add [[ .PkgFullName ]]
```

### 首次初始化本仓库

```bash
pnpm install                         # 安装依赖并生成 lockfile
export [[ .TokenEnvName ]]=<token>   # 文档需要鉴权时
pnpm generate                        # 拉远程文档并生成 src/generated
pnpm typecheck && pnpm test && pnpm build
git add -A && git commit -m "chore: bootstrap sdk"
```

## 🚀 使用示例

> 下面示例里的 `PetApi` 是按 Swagger tag 生成的类名，请替换成你文档里实际的类名

### 基础用法

```ts
import { Configuration, PetApi, createHttpClient } from '[[ .PkgFullName ]]';

const api = new PetApi(
  new Configuration({ basePath: 'https://api.example.com' }),
  createHttpClient(),
);

const pets = await api.listPets({ page: 1 });
```

### 鉴权、超时与重试

```ts
const http = createHttpClient({
  headers: { Authorization: `Bearer ${token}` },
  timeoutMs: 5000,   // 单请求超时
  retries: 2,        // 仅重试 408/425/429/5xx 与网络错误
  retryDelayMs: 200, // 退避基数：200ms -> 400ms
});
```

### 错误处理

```ts
import { HttpError } from '[[ .PkgFullName ]]';

try {
  await api.getPet({ petId: '404' });
} catch (error) {
  if (error instanceof HttpError) {
    console.error(error.status, error.url, error.body); // body 已解析
  } else {
    throw error;
  }
}
```

### 钩子与自定义 fetch

```ts
const http = createHttpClient({
  onRequest: (config) => {
    config.headers = { ...config.headers, 'X-Trace-Id': crypto.randomUUID() };
  },
  onResponse: (response) => {
    metrics.observe(response.status);
  },
  // 需要代理、mTLS 或在测试中替换时注入自己的实现
  fetch: myFetch,
});
```

## 🔄 重新生成 SDK

### 配置远程文档

编辑 `openapi.config.mjs`，多服务网关在 `sources` 里继续追加：

```js
sources: [
  // 公开示例文档，拿来验证链路；OpenAPI 3 与 Swagger 2 都支持，可以混用
  { name: 'petstore-v3', url: 'https://petstore3.swagger.io/api/v3/openapi.json' },
  { name: 'petstore-v2', url: 'https://petstore.swagger.io/v2/swagger.json' },
  // 换成你自己的服务
  { name: 'user', url: 'https://api.your-domain.com/user/openapi.json' },
  { name: 'order', url: 'https://api.your-domain.com/order/openapi.json' },
],
```

所有文档在一次生成中合并，同名 schema 以第一个出现的为准

### 鉴权

```bash
export [[ .TokenEnvName ]]=<token>       # Bearer Token
pnpm generate
```

需要额外请求头时写进 `openapi.config.mjs` 的 `headers`，例如租户头

### 临时覆盖文档地址

```bash
OPENAPI_URL=http://127.0.0.1:8080/openapi.json pnpm generate
```

### 从协议中心的 release 生成

输入是协议中心某个发布版本的聚合文档，而不是某个跑着的服务：

```bash
# 取某个版本的聚合文档资产地址（gh 需要能读协议中心仓库）
ASSET=$(gh api repos/[[ .ProtoRepo ]]/releases/tags/v1.2.0 \
  --jq '.assets[] | select(.name == "openapi.swagger.yaml") | .url')

OPENAPI_URL="$ASSET" \
OPENAPI_ACCEPT=application/octet-stream \
[[ .TokenEnvName ]]="$(gh auth token)" \
  pnpm generate
```

`OPENAPI_ACCEPT` 是必须的：GitHub 的资产 API 地址默认返回的是资产的 JSON 元信息，
带上 `application/octet-stream` 才会返回文档本身

CI 里这件事是自动的，见下一节

### 接口漂移检查

```bash
pnpm generate:check
```

重新拉取文档并生成，若工作区出现变化则判定 SDK 落后于服务端，退出码非零

## 📤 发布到 npm

### 首次准备

1. 在 npm 创建 **Automation Token**，写入仓库 Secret `NPM_TOKEN`
2. scope 包首次发布需要该 scope 的发布权限（`publishConfig.access` 已设为 `public`）
3. 确认 `pnpm-lock.yaml` 已提交

### 日常发版

```bash
pnpm changeset     # 选择 patch/minor/major 并描述变更
git commit -am "feat: add order api" && git push
```

推到 `[[ .BaseBranch ]]` 后，GitHub Actions 会开一个 "version packages" PR；合并它就会
发布到 npm 并打上 provenance 溯源信息

### 发布到私服

`.npmrc` 与 `package.json` 的 `publishConfig.registry` 都指向 `[[ .NpmRegistry ]]`
注意：npm provenance 只在 npmjs.org 可用，发私服时请把 `publishConfig.provenance`
改为 `false`，否则 publish 会失败

## 🔗 与协议中心联动

填了模板变量 `ProtoRepo`（或仓库变量 `PROTO_REPO`）之后，这个 SDK 就不只是「对着一个 URL
生成代码」，而是挂在协议中心的发布流水线上：

```text
  协议中心（share-proto）跑 Release Contract 发版
            │
            │  repository_dispatch(proto-released)
            │  payload 带上版本号、模块路径和这次是 major/minor/patch
            ▼
  本仓库 sync-contract.yml
            ├─ 1. 解析该 release 的 openapi.swagger.yaml 资产地址
            ├─ 2. pnpm generate 重新生成 src/generated
            ├─ 3. lint / typecheck / test / build 自证可用
            ├─ 4. 无变化就到此为止；有变化则写一个 changeset 并提交到主干
            └─ 5. 唤起 release.yml
                      ▼
            changesets 开「version packages」PR → 合并后发 npm
```

### 为什么要写 changeset 而不是直接 publish

changesets 的两段式发布是这个仓库唯一的发版口径，版本号与 CHANGELOG 都由它生成。
绕过去直接 publish 会让 CHANGELOG 缺一条记录，而「这个 SDK 版本对应哪个协议版本」
恰恰是出问题时最先要查的东西。走 changeset 之后，npm 上每个版本都能回溯到具体的协议 tag：

```markdown
## 1.0.0

### Major Changes

- 同步协议 `[[ .ProtoRepo ]]@v2.0.0`，重新生成 `src/generated`
```

版本级别也不用猜：协议中心在 dispatch 里带了 `bump`，协议的破坏性变更会直接变成 SDK 的
major，不会出现「协议都改不兼容了，SDK 还在发 minor」。

### 需要的配置

| 配置项 | 类型 | 说明 |
| --- | --- | --- |
| `PROTO_REPO` | 仓库变量 | 协议中心仓库 `owner/repo`；覆盖模板变量 `ProtoRepo` |
| `OPS_CLI_APP_ID` | 仓库 Secret | 协议中心是私有仓库时必须配，用于读它的 release |
| `OPS_CLI_APP_PRIVATE_KEY` | 仓库 Secret | 同上的私钥 |
| `NPM_TOKEN` | 仓库 Secret | 发 npm 用（发布流程本来就需要）|

协议中心那一侧要把本仓库填进它的 `SDK_REPO` 变量，否则它不知道该通知谁

### 手动补一次同步

Actions → Sync Contract → 填版本号（或 `latest`）即可，用于协议中心通知失败后补跑，
或者第一次接线时验证链路

## 🧰 脚本速览

| 命令 | 作用 |
| --- | --- |
| `pnpm generate` | 拉取远程文档并生成 `src/generated` |
| `pnpm generate:docs` | 同上，额外生成 Markdown 接口文档 |
| `pnpm generate:check` | 接口漂移检查，CI 外手动执行 |
| `pnpm build` | tsup 打包 ESM + CJS + `.d.ts` |
| `pnpm dev` | 监听模式构建 |
| `pnpm typecheck` | `tsc --noEmit` 类型检查 |
| `pnpm lint` / `pnpm lint:fix` | ESLint 检查 / 自动修复 |
| `pnpm format` / `pnpm format:check` | Prettier 格式化 / 校验 |
| `pnpm test` / `pnpm test:watch` | 单测 / 监听模式 |
| `pnpm test:coverage` | 覆盖率报告（排除生成代码） |
| `pnpm changeset` | 记录一次变更 |
| `pnpm release` | 构建并发布（由 CI 调用） |

## 🧪 质量保障

| 环节 | 工具 | 覆盖范围 |
| --- | --- | --- |
| 静态检查 | ESLint 9 flat config + typescript-eslint | 手写代码，生成目录豁免 |
| 格式 | Prettier 3 | 代码与配置，Markdown 豁免 |
| 类型 | TypeScript strict | 手写代码 + 生成代码 |
| 测试 | Vitest + v8 coverage | 手写适配层 |
| 构建 | tsup | ESM / CJS / `.d.ts` |
| 发布 | changesets + provenance | 版本、CHANGELOG、npm |

## ❓ 常见问题

**生成后 typecheck 报 `TS2306: File is not a module`？**
远程文档里没有 `enums*` / `common*` 命名空间的 schema 时，生成器会写出空的
`enums/index.ts`，而空文件在 TypeScript 里不是模块`scripts/generate-api.mjs` 已做兜底
修正；若你绕过脚本直接调用生成器，请自行补一行 `export {};`

**`pnpm install` 报 esbuild 未构建？**
`package.json` 的 `pnpm.onlyBuiltDependencies` 已显式放行 esbuild（pnpm 10 默认阻止依赖
执行安装脚本）若仍失败，执行 `pnpm approve-builds`

**CI 为什么不跑 `pnpm generate`？**
文档地址通常在内网，公网 runner 拉不到；强行跑只会得到与代码无关的假红

**使用方必须用 pnpm 吗？**
不需要pnpm 只是本仓库的开发工具，发布出去的是普通 npm 包，`npm` / `yarn` / `bun` 都能装

## 许可证

Copyright (c) [[ .Year ]] by [[ .AuthorName ]], All Rights Reserved.

本项目基于 [Apache-2.0](./LICENSE) 协议开源
