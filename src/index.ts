/*
 * @Author: [[ .AuthorName ]] [[ .AuthorEmail ]]
 * @Date: [[ nowFmt "2006-01-02 15:04:05" ]]
 * @LastEditors: [[ .AuthorName ]] [[ .AuthorEmail ]]
 * @LastEditTime: [[ nowFmt "2006-01-02 15:04:05" ]]
 * @FilePath: \[[ .ProjectName ]]\src\index.ts
 * @Description: 包入口 | Package entry point
 *
 * Copyright (c) [[ .Year ]] by [[ .AuthorName ]], All Rights Reserved.
 */

// 入口只做一件事：把「生成的」和「手写的」两部分合成一个对外的包
// The entry point does one thing: merge the generated and hand-written halves
// into a single public surface.
//
// ./generated —— 由 pnpm generate 从 OpenAPI 文档产出，整体可覆盖，不要手改
// ./http      —— 手写的 fetch 适配层，承载超时、重试与错误语义
//
// ./generated is produced by `pnpm generate` from the OpenAPI documents; it is
// overwritten wholesale, so never edit it by hand.
// ./http is the hand-written fetch adapter carrying timeout, retry and errors.

export * from './generated';
export * from './http';

/**
 * 默认 API 根地址 | Default API base path
 *
 * 由模板变量 ApiBasePath 写入，留空表示由调用方在 Configuration 中显式给出
 * Written from the ApiBasePath template variable; empty means the caller must
 * pass basePath through Configuration.
 */
export const DEFAULT_BASE_PATH = '[[ .ApiBasePath ]]';
