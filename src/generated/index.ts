/*
 * 占位文件 | Placeholder file
 *
 * 执行 pnpm generate 后，本目录会被 openapi-generator-ts-cli 整体覆盖：
 * 生成 apis/、models/、enums/、configuration.ts、base.ts 和新的 index.ts
 * 保留这个占位文件是为了让刚生成出来、还没跑过 generate 的项目也能通过
 * typecheck 与 build —— 否则 src/index.ts 的 re-export 会指向一个不存在的模块
 *
 * Running `pnpm generate` replaces this whole directory with the generator output
 * (apis/, models/, enums/, configuration.ts, base.ts and a fresh index.ts).
 * The placeholder keeps a freshly scaffolded project type-checking and building
 * before the first generate run; without it the re-export in src/index.ts would
 * point at a module that does not exist.
 */
export {};
