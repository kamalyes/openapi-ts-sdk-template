/*
 * @Author: [[ .AuthorName ]] [[ .AuthorEmail ]]
 * @Date: [[ nowFmt "2006-01-02 15:04:05" ]]
 * @LastEditors: [[ .AuthorName ]] [[ .AuthorEmail ]]
 * @LastEditTime: [[ nowFmt "2006-01-02 15:04:05" ]]
 * @FilePath: \[[ .ProjectName ]]\tsup.config.ts
 * @Description: 构建配置 | Build configuration
 *
 * Copyright (c) [[ .Year ]] by [[ .AuthorName ]], All Rights Reserved.
 */

import { defineConfig } from 'tsup';

// 为什么用打包而不是 tsc 直出 | Why bundle instead of emitting with tsc
//
// 生成代码里的相对导入都没有扩展名（import { Configuration } from './configuration'），
// 这在 Node 的 ESM 运行时是非法的 —— tsc 原样保留路径，产物一跑就报
// ERR_MODULE_NOT_FOUND打包把所有相对导入内联掉，产物不再依赖路径解析，
// 顺带一次产出 ESM + CJS + .d.ts 三份，老项目也能 require 进来
//
// The generated code imports without file extensions (./configuration), which is
// invalid at ESM runtime: tsc keeps paths verbatim and the output dies with
// ERR_MODULE_NOT_FOUND. Bundling inlines every relative import so the artifact no
// longer depends on path resolution, and emits ESM + CJS + .d.ts in one pass so
// legacy consumers can still require() the package.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'es2022',
  /** 生成类型声明，否则 TypeScript 使用方拿不到类型 | Emit declarations, otherwise consumers lose types */
  dts: true,
  sourcemap: true,
  /** 构建前清空 dist，避免上一次的残留文件被发布出去 | Clear dist so stale files are never published */
  clean: true,
  treeshake: true,
  /** 库不压缩：使用方自己的打包器会处理，保留可读性便于排查 | Libraries ship unminified; consumers bundle anyway */
  minify: false,
});
