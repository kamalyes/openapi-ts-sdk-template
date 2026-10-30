#!/usr/bin/env node
/*
 * @Author: kamalyes example@qq.com
 * @Date: 2026-10-30 17:29:16
 * @LastEditors: kamalyes example@qq.com
 * @LastEditTime: 2026-10-30 17:29:16
 * @FilePath: \my-api-sdk\scripts\generate-api.mjs
 * @Description: 从远程 OpenAPI 文档生成 SDK 源码 | Generate SDK sources from remote OpenAPI documents
 *
 * Copyright (c) 2026 by kamalyes, All Rights Reserved.
 */

// 这个脚本做三件事 | This script does three things
//   1. 读 openapi.config.mjs，拼出 openapi-generator-ts-cli 的参数（含鉴权）
//   2. 直接用 node 执行 CLI 的入口文件，而不是走 .bin 里的 shim
//   3. 生成后兜底修正空的 index.ts
//
//   1. Read openapi.config.mjs and assemble the generator's arguments (auth included)
//   2. Invoke the CLI entry file with node instead of relying on the .bin shim
//   3. Patch empty index.ts files afterwards
//
// 为什么不走 shim | Why not the shim: pnpm 在 Windows 上生成的是 .CMD 包装器，
// execFileSync 不开 shell 时无法执行，开了 shell 又要处理带空格的 header 引号问题
// 直接拿 node 执行 dist/cli.js 在三个平台上行为一致
// pnpm creates .CMD wrappers on Windows which execFileSync cannot run without a
// shell, and a shell would reintroduce quoting problems for headers containing
// spaces. Running dist/cli.js with node behaves identically on all platforms.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const configPath = resolve(projectRoot, 'openapi.config.mjs');
const cliEntry = resolve(projectRoot, 'node_modules/openapi-generator-ts-cli/dist/cli.js');

main().catch((error) => {
  console.error(`[generate] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});

async function main() {
  if (!existsSync(cliEntry)) {
    throw new Error(
      '找不到 openapi-generator-ts-cli，请先执行 pnpm install | generator not installed, run pnpm install first',
    );
  }

  const { default: config } = await import(pathToFileURL(configPath).href);
  const args = buildArgs(config);

  for (const source of config.sources ?? []) {
    console.log(`[generate] ${source.name ?? 'openapi'} <- ${source.url}`);
  }

  // stdio: inherit 让生成器自己的进度与警告直接透出，失败时非零退出码会抛异常
  // inherit lets the generator print its own progress; a non-zero exit throws
  execFileSync(process.execPath, [cliEntry, ...args], { stdio: 'inherit', cwd: projectRoot });

  const patched = normalizeEmptyIndexFiles(resolve(projectRoot, config.output));
  if (patched.length > 0) {
    console.log(`[generate] 已修正空的索引文件 | patched empty index files: ${patched.join(', ')}`);
  }
}

/**
 * 把配置转成 CLI 参数 | Turn the config into CLI arguments
 *
 * --input 是变长参数，必须一次性给出全部地址，commander 遇到下一个选项才停止收集
 * --input is variadic: pass every URL in one go, commander stops at the next flag.
 */
function buildArgs(config) {
  const urls = (config.sources ?? []).map((source) => source?.url).filter(Boolean);
  if (urls.length === 0) {
    throw new Error('openapi.config.mjs 的 sources 为空 | no sources configured');
  }

  const args = ['generate', '--input', ...urls, '--output', config.output ?? 'src/generated'];

  if (config.clean !== false) args.push('--clean');
  if (config.docs === true || process.argv.slice(2).includes('--docs')) args.push('--docs');

  for (const [name, value] of Object.entries(config.headers ?? {})) {
    args.push('--header', `${name}: ${value}`);
  }

  const token = config.bearerTokenEnv ? process.env[config.bearerTokenEnv] : undefined;
  if (token) {
    args.push('--bearer-token', token);
  } else if (config.bearerTokenEnv) {
    console.log(
      `[generate] 未设置 ${config.bearerTokenEnv}，按匿名方式拉取 | ${config.bearerTokenEnv} not set, fetching anonymously`,
    );
  }

  return args;
}

/**
 * 修正空的索引文件 | Patch empty index files
 *
 * 生成器总会写出 enums/index.ts 与 models/index.ts，但当远程文档里没有
 * enums* / common* 命名空间的 schema 时，这些文件内容为空空文件在
 * TypeScript 里不是模块，而生成的根 index.ts 会 `export * from './enums'`，
 * 于是 typecheck 报 TS2306「File is not a module」补一行 export {} 即可
 *
 * The generator always writes enums/index.ts and models/index.ts, but they come
 * out empty when the remote documents expose no enums* / common* namespaced
 * schemas. An empty file is not a module in TypeScript while the generated root
 * index re-exports it, so typecheck fails with TS2306. One `export {}` fixes it.
 */
function normalizeEmptyIndexFiles(outputDir) {
  if (!existsSync(outputDir)) return [];
  const patched = [];

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const current = join(dir, entry);
      if (statSync(current).isDirectory()) {
        walk(current);
        continue;
      }
      if (entry !== 'index.ts') continue;
      if (readFileSync(current, 'utf8').trim() !== '') continue;
      writeFileSync(current, 'export {};\n', 'utf8');
      patched.push(current.replace(`${projectRoot}/`, ''));
    }
  };

  walk(outputDir);
  return patched;
}
