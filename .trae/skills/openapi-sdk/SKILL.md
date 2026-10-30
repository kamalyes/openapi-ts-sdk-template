---
name: openapi-sdk
description: 维护本仓库这个由远程 OpenAPI 文档生成的 TypeScript SDK —— 重新生成代码、改手写适配层、发版到 npm 时使用Use when regenerating sources from the remote OpenAPI document, editing the hand-written HTTP layer, or releasing this SDK to npm.
---

# @kamalyes/my-api-sdk 维护指南 | Maintenance guide

本仓库是一个 **生成 + 手写** 双层结构的 npm 包动手前先确认改的是哪一层
This repository is an npm package with a **generated** half and a **hand-written**
half. Before editing, determine which half you are in.

## 两层结构 | The two layers

| 目录 \| Directory | 归属 \| Ownership | 规则 \| Rule |
| --- | --- | --- |
| `src/generated/` | openapi-generator-ts-cli 产出 | 禁止手改，每次 `pnpm generate` 整体覆盖 |
| `src/http.ts`、`src/index.ts` | 人工维护 | 所有超时、重试、鉴权、错误语义都写在这里 |

发现生成代码有问题时，改生成器（`openapi-generator-ts-cli`）或改远程文档，
不要改 `src/generated/` —— 那里的任何修改都会在下一次生成时消失
When the generated code is wrong, fix the generator or the remote document; never
patch `src/generated/`, because the next generate run discards it.

## 常用流程 | Common workflows

### 重新生成 | Regenerate

```bash
export OPENAPI_TOKEN=<token>   # 文档接口需要鉴权时 | when the endpoint requires auth
pnpm generate
pnpm typecheck && pnpm test
```

远程文档地址配置在 `openapi.config.mjs` 的 `sources` 里，多服务就继续追加条目
The document URLs live in the `sources` array of `openapi.config.mjs`.

### 改手写层 | Change the hand-written layer

改 `src/http.ts` 后必须补 `tests/http.test.ts` 的用例：这一层是 SDK 对外的行为承诺，
用假 fetch 就能完整覆盖，没有理由不测
Any change to `src/http.ts` needs a case in `tests/http.test.ts`: this layer is the
SDK's behavioural contract and a fake fetch covers it fully.

### 发版 | Release

```bash
pnpm changeset          # 选 patch/minor/major 并写变更说明 | pick a bump and describe it
git commit -am "feat: ..." && git push
```

推到主干后 GitHub Actions 会开 "version packages" PR，合并即发布
不要手动改 `package.json` 的 version，那是 changesets 的职责
Pushing to the trunk opens a "version packages" PR; merging it publishes. Never bump
`version` in `package.json` by hand — that belongs to changesets.

## 注意事项 | Gotchas

- **破坏性变更**：远程接口删字段 / 改类型会让使用方编译失败，必须按 major 发版
  Breaking server changes (removed fields, changed types) break consumers at compile
  time and must go out as a major bump
- **提交生成代码**：`src/generated/` 要跟着提交，CI 才能在拿不到远程文档时编译
  Commit `src/generated/`: CI cannot reach the document endpoint and relies on it
- **不要在 CI 里跑 generate**：公网 runner 通常访问不到内网文档地址
  Do not run generate in CI: a public runner usually cannot reach the endpoint
