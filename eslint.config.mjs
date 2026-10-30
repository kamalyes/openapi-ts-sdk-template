/*
 * @Author: kamalyes example@qq.com
 * @Date: 2026-10-30 17:29:16
 * @LastEditors: kamalyes example@qq.com
 * @LastEditTime: 2026-10-30 17:29:16
 * @FilePath: \my-api-sdk\eslint.config.mjs
 * @Description: ESLint 扁平配置 | ESLint flat configuration
 *
 * Copyright (c) 2026 by kamalyes, All Rights Reserved.
 */

import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // 生成目录不参与 lint：它由生成器产出并自带 /* eslint-disable */，
    // 对它提风格意见毫无意义，改了下次生成也会被覆盖
    // The generated directory is not linted: it is machine-written, already carries
    // /* eslint-disable */, and any fix would be wiped by the next generate run.
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'src/generated/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // prettier 配置必须放在最后，用于关闭与格式化器冲突的规则
  // The prettier config goes last: it switches off rules that fight the formatter
  prettier,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // 测试替身需要构造畸形入参，这里放开 any | Test doubles need malformed inputs
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
