/*
 * @Author: [[ .AuthorName ]] [[ .AuthorEmail ]]
 * @Date: [[ nowFmt "2006-01-02 15:04:05" ]]
 * @LastEditors: [[ .AuthorName ]] [[ .AuthorEmail ]]
 * @LastEditTime: [[ nowFmt "2006-01-02 15:04:05" ]]
 * @FilePath: \[[ .ProjectName ]]\openapi.config.mjs
 * @Description: 远程 OpenAPI 文档拉取配置 | Remote OpenAPI fetch configuration
 *
 * Copyright (c) [[ .Year ]] by [[ .AuthorName ]], All Rights Reserved.
 */

/**
 * SDK 的唯一输入是远程 Swagger/OpenAPI 文档 | Remote documents are the only input
 *
 * 这里是 pnpm generate 的全部输入来源，由 scripts/generate-api.mjs 读取后
 * 转成 openapi-generator-ts-cli 的命令行参数之所以单独成文件而不是写死在
 * package.json 的 script 里：多服务网关往往有若干个文档地址，而鉴权头、
 * 环境区分这些东西写在 JSON 字符串里既难读也难改
 *
 * This file is the complete input for `pnpm generate`; scripts/generate-api.mjs
 * turns it into command-line arguments for openapi-generator-ts-cli. It is a
 * separate module rather than an inline package.json script because a gateway
 * usually exposes several documents, and auth headers plus per-environment URLs
 * are painful to maintain inside a JSON string.
 */
export default {
  /**
   * 生成目录 | Output directory
   *
   * 每次生成都会被整体覆盖（clean: true），不要在里面手写代码
   * Wiped and rewritten on every run (clean: true); never hand-edit it.
   */
  output: 'src/generated',

  /**
   * 生成前清空输出目录 | Clean the output directory first
   *
   * 关掉会留下已删除接口的残留文件，SDK 就会导出服务端早已下线的方法
   * Disabling it leaves stale files behind, so the SDK would export endpoints
   * the server has already removed.
   */
  clean: true,

  /** 是否同时生成 Markdown 接口文档 | Also emit Markdown API docs */
  docs: false,

  /**
   * 远程文档列表 | Remote documents
   *
   * name 只用于日志输出，url 是真正拉取的地址。多服务网关在这里继续追加，
   * 所有文档会在一次生成中合并，同名 schema 以第一个出现的为准。
   *
   * 默认指向 Swagger 官方 Petstore 示例文档（公网可访问），所以 kopy new 之后
   * 直接 pnpm generate 就能跑通整条链路，确认没问题再换成你自己的地址。
   * 生成器同时吃 OpenAPI 3 与 Swagger 2，两种文档可以混在同一个 sources 里。
   *
   * `name` is only used in log output; `url` is what gets fetched. Append more
   * entries for a multi-service gateway: all documents are merged in a single
   * run, and duplicate schema names resolve to the first occurrence.
   * The default points at the public Swagger Petstore spec so `pnpm generate` works
   * right after scaffolding; swap it for your own once the pipeline has run. Both
   * OpenAPI 3 and Swagger 2 documents are accepted and can be mixed here.
   */
  sources: [
    {
      name: '[[ .PkgName ]]',
      url: process.env.OPENAPI_URL ?? '[[ .SwaggerUrl ]]',
    },
  ],

  /**
   * 拉取文档时附带的请求头 | Extra headers used while fetching
   *
   * 例如内网网关要求的租户头：{ 'X-Tenant-Id': 'default' }
   * For example a gateway that requires a tenant header.
   */
  headers: {},

  /**
   * 读取 Bearer Token 的环境变量名 | Env var holding the Bearer token
   *
   * 文档接口需要鉴权时，在本地 shell 或 CI secrets 里导出该变量即可，
   * 不要把 token 写进这个文件
   *
   * Export this variable locally or via CI secrets when the document endpoint
   * requires authentication; never commit the token itself.
   */
  bearerTokenEnv: '[[ .TokenEnvName ]]',
};
