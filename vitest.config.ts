/*
 * @Author: kamalyes example@qq.com
 * @Date: 2026-10-30 17:29:16
 * @LastEditors: kamalyes example@qq.com
 * @LastEditTime: 2026-10-30 17:29:16
 * @FilePath: \my-api-sdk\vitest.config.ts
 * @Description: 测试配置 | Test configuration
 *
 * Copyright (c) 2026 by kamalyes, All Rights Reserved.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      // 生成代码不参与覆盖率：它由 OpenAPI 文档决定，覆盖率只会被稀释成噪音
      // Generated sources are excluded: they mirror the OpenAPI documents and
      // would only dilute the coverage signal.
      exclude: ['src/generated/**'],
    },
  },
});
