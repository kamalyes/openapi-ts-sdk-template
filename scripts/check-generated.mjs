#!/usr/bin/env node
/*
 * @Author: kamalyes example@qq.com
 * @Date: 2026-10-30 17:29:16
 * @LastEditors: kamalyes example@qq.com
 * @LastEditTime: 2026-10-30 17:29:16
 * @FilePath: \my-api-sdk\scripts\check-generated.mjs
 * @Description: 校验生成代码是否与远程文档一致 | Verify generated sources match the remote documents
 *
 * Copyright (c) 2026 by kamalyes, All Rights Reserved.
 */

// 用途 | Purpose
//
// 重新拉一次远程文档并生成，然后看 git 工作区有没有变化：有变化说明服务端接口
// 改了而 SDK 没跟上适合在发版前手动跑，或在能访问到文档地址的流水线里跑
// 默认 CI 不跑这一步 —— 远程文档对公网流水线通常不可达，跑了只会得到假红
//
// Regenerate from the remote documents and check whether the working tree moved:
// if it did, the server contract changed and the SDK has not caught up. Run it
// before releasing, or in a pipeline that can reach the document endpoint. CI
// skips it by default because the endpoint is usually unreachable from there,
// where it would only produce false failures.

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const target = 'src/generated';

try {
  run('git', ['rev-parse', '--is-inside-work-tree']);
} catch {
  console.error('[generate:check] 需要在 git 仓库内执行 | must run inside a git repository');
  process.exit(1);
}

run(process.execPath, [resolve(projectRoot, 'scripts/generate-api.mjs')], 'inherit');

const changes = run('git', ['status', '--porcelain', '--', target]).trim();
if (changes) {
  console.error(
    '[generate:check] 生成代码与远程文档不一致，请执行 pnpm generate 后提交 | generated sources are stale, run pnpm generate and commit',
  );
  console.error(changes);
  process.exit(1);
}

console.log('[generate:check] 生成代码与远程文档一致 | generated sources are up to date');

function run(command, args, stdio = 'pipe') {
  return execFileSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: stdio === 'inherit' ? 'inherit' : ['ignore', 'pipe', 'inherit'],
  });
}
