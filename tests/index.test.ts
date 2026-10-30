/*
 * @Author: kamalyes example@qq.com
 * @Date: 2026-10-30 17:29:16
 * @LastEditors: kamalyes example@qq.com
 * @LastEditTime: 2026-10-30 17:29:16
 * @FilePath: \my-api-sdk\tests\index.test.ts
 * @Description: 包入口冒烟测试 | Smoke test for the package entry
 *
 * Copyright (c) 2026 by kamalyes, All Rights Reserved.
 */

// 这个用例保证「还没执行 generate 的新项目」也能跑通测试：
// 它只校验入口把手写层导了出来，不依赖任何生成出来的符号
// This case keeps a freshly scaffolded project green before the first generate:
// it only asserts the entry re-exports the hand-written layer.

import { describe, expect, it } from 'vitest';
import * as sdk from '../src/index';

describe('包入口 | package entry', () => {
  it('导出 HTTP 客户端 | exports the http client', () => {
    expect(typeof sdk.createHttpClient).toBe('function');
    expect(typeof sdk.HttpError).toBe('function');
  });

  it('导出默认根地址 | exports the default base path', () => {
    expect(typeof sdk.DEFAULT_BASE_PATH).toBe('string');
  });
});
