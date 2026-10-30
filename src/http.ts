/*
 * @Author: kamalyes example@qq.com
 * @Date: 2026-10-30 17:29:16
 * @LastEditors: kamalyes example@qq.com
 * @LastEditTime: 2026-10-30 17:29:16
 * @FilePath: \my-api-sdk\src\http.ts
 * @Description: 基于 fetch 的 HTTP 适配层 | fetch-based HTTP adapter layer
 *
 * Copyright (c) 2026 by kamalyes, All Rights Reserved.
 */

// 为什么需要这一层 | Why this layer exists
//
// openapi-generator-ts-cli 生成的 API 类接受任意「Axios 风格」实例：只要对象上有
// request(config) 且返回 { data }，就能注入进去生成代码自带的默认实现只做了
// 「拼 query + 发请求 + 取 body」，缺少 SDK 真正要对外承诺的东西：超时、重试、
// 统一的错误语义、请求前后的钩子把这些放在手写层而不是改生成器，是因为
// 生成目录每次 generate 都会被整体覆盖，手写层才是能长期维护的位置
//
// The generated API classes accept any "Axios-like" instance: an object exposing
// request(config) that resolves to { data }. The default implementation shipped with
// the generated code only builds the query string and reads the body; it has no
// timeout, retry, typed error or hooks. Those belong here, in hand-written code,
// because the generated directory is wiped and rewritten on every `pnpm generate`.

// ============================================================================
// 请求与响应类型 | Request & response types
// ============================================================================

/**
 * 单次请求配置 | Per-request configuration
 *
 * 字段与生成代码里的 RequestArgs 保持结构兼容，因此本客户端可以直接注入
 * 任何生成出来的 API 类
 *
 * Structurally compatible with the generated RequestArgs, so this client can be
 * injected into any generated API class.
 */
export interface HttpRequestConfig {
  /** HTTP 方法，默认 GET | HTTP method, defaults to GET */
  method?: string;
  /** 请求路径，会与 Configuration.basePath 拼接 | Path, appended to Configuration.basePath */
  url?: string;
  /** query 参数，数组会展开成重复 key | Query params; arrays expand into repeated keys */
  params?: Record<string, unknown>;
  /** 单次请求头，覆盖客户端级别的同名头 | Per-request headers, override client-level ones */
  headers?: Record<string, string>;
  /** 请求体，非字符串且非二进制时按 JSON 序列化 | Body; serialized as JSON unless string/binary */
  data?: unknown;
  /** 调用方传入的取消信号 | Caller-supplied cancellation signal */
  signal?: AbortSignal;
  /** 覆盖客户端级别的超时时间 | Overrides the client-level timeout */
  timeoutMs?: number;
}

/**
 * 响应结构 | Response shape
 *
 * 生成代码只读取 data 字段，status 与 headers 是额外给调用方的信息，
 * 多出来的字段不影响结构兼容性
 *
 * The generated code only reads `data`; `status` and `headers` are extras for
 * callers. Extra properties do not break structural compatibility.
 */
export interface HttpResponse<T> {
  /** 解析后的响应体 | Parsed response body */
  data: T;
  /** HTTP 状态码 | HTTP status code */
  status: number;
  /** 响应头，key 统一转小写 | Response headers, keys lower-cased */
  headers: Record<string, string>;
}

/**
 * 注入用的最小 fetch 结构 | Minimal fetch shape for injection
 *
 * 这里刻意不用 DOM 的 RequestInit / Response 类型：浏览器、Node、undici、
 * 测试替身对这些类型的定义互不相同，把它们写进公共 API 会让使用方被迫对齐
 * lib 配置只声明真正用到的成员，任何实现都能塞进来
 *
 * We deliberately avoid DOM's RequestInit / Response: browsers, Node, undici and
 * test doubles all type them differently, and leaking that into the public API
 * would force consumers to match our `lib` setup. Only the members we actually
 * use are declared, so any implementation fits.
 */
export type FetchLike = (url: string, init: FetchInit) => Promise<FetchResponse>;

/** fetch 的入参 | The init argument passed to fetch */
export interface FetchInit {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

/** fetch 的返回值 | The response returned by fetch */
export interface FetchResponse {
  ok: boolean;
  status: number;
  statusText: string;
  headers: {
    get(name: string): string | null;
    forEach(callback: (value: string, name: string) => void): void;
  };
  text(): Promise<string>;
}

// ============================================================================
// 客户端配置与错误 | Client options & errors
// ============================================================================

/** 客户端级别配置 | Client-level options */
export interface HttpClientOptions {
  /** 所有请求共用的 header，可被单次请求覆盖 | Shared headers, overridable per request */
  headers?: Record<string, string>;
  /** 超时毫秒数，传 0 表示不设超时，默认 10000 | Timeout in ms, 0 disables it, default 10000 */
  timeoutMs?: number;
  /** 重试次数，只对网络错误和可重试状态码生效 | Retry count, only for network errors and retryable codes */
  retries?: number;
  /** 重试基础间隔，第 n 次重试等待 retryDelayMs * 2 ** n 毫秒 | Base backoff; attempt n waits retryDelayMs * 2 ** n */
  retryDelayMs?: number;
  /** 自定义 fetch 实现，默认取全局 fetch | Custom fetch implementation, defaults to global fetch */
  fetch?: FetchLike;
  /** 请求发出前的钩子，可注入签名、链路 ID | Hook before the request, e.g. signing or trace IDs */
  onRequest?: (config: HttpRequestConfig) => void | Promise<void>;
  /** 收到响应后的钩子，非 2xx 抛错前同样会触发 | Hook after the response, also runs before non-2xx throws */
  onResponse?: (response: HttpResponse<unknown>) => void | Promise<void>;
}

/** 可注入生成 API 类的客户端接口 | Client interface injectable into generated API classes */
export interface HttpClient {
  request<T = unknown>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
}

/**
 * 非 2xx 响应抛出的错误 | Error thrown for non-2xx responses
 *
 * body 是已经解析过的响应体，便于调用方直接读业务错误码，不用再处理一遍反序列化
 * `body` carries the already-parsed payload so callers can read business error
 * codes without deserializing again.
 */
export class HttpError extends Error {
  /** HTTP 状态码 | HTTP status code */
  readonly status: number;
  /** 实际请求的完整 URL（含 query）| The full requested URL, query included */
  readonly url: string;
  /** 解析后的响应体 | Parsed response body */
  readonly body: unknown;

  constructor(message: string, init: { status: number; url: string; body?: unknown }) {
    super(message);
    this.name = 'HttpError';
    this.status = init.status;
    this.url = init.url;
    this.body = init.body;
  }
}

// ============================================================================
// 常量 | Constants
// ============================================================================

/**
 * 默认会重试的状态码 | Status codes retried by default
 *
 * 只收「重试一次就可能成功」的：请求超时、Too Early、限流和网关类错误
 * 4xx 里的参数错误重试多少次都是同样的结果，不在列
 *
 * Only codes where a retry can plausibly succeed: request timeout, too early,
 * rate limiting and gateway failures. Client-side 4xx would fail identically.
 */
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

/**
 * 不做 JSON 序列化的请求体类型 | Body types passed through untouched
 *
 * 按构造函数名判断而不用 instanceof：这些类型在 Node、浏览器和测试环境里
 * 来自不同的全局对象，instanceof 会在跨环境时判错
 *
 * Matched by constructor name rather than instanceof, because these types come
 * from different globals across Node, browsers and test environments.
 */
const BINARY_BODY_TYPES = new Set([
  'FormData',
  'URLSearchParams',
  'Blob',
  'File',
  'ArrayBuffer',
  'Uint8Array',
  'ReadableStream',
]);

// ============================================================================
// 客户端实现 | Client implementation
// ============================================================================

/**
 * 创建 HTTP 客户端 | Create an HTTP client
 *
 * @example
 * ```ts
 * import { Configuration, PetApi, createHttpClient } from '@kamalyes/my-api-sdk';
 *
 * const http = createHttpClient({
 *   headers: { Authorization: 'Bearer token' },
 *   timeoutMs: 5000,
 *   retries: 2,
 * });
 * const api = new PetApi(new Configuration({ basePath: 'https://api.example.com' }), http);
 * ```
 */
export function createHttpClient(options: HttpClientOptions = {}): HttpClient {
  const {
    headers: baseHeaders = {},
    timeoutMs = 10_000,
    retries = 0,
    retryDelayMs = 200,
    fetch: injectedFetch,
    onRequest,
    onResponse,
  } = options;

  async function request<T = unknown>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    // 全局 fetch 在 Node 18+ 和现代浏览器都有；缺失时给出可操作的报错而不是 undefined is not a function
    // Global fetch exists on Node 18+ and modern browsers; fail with an actionable message otherwise
    const fetchFn = injectedFetch ?? (globalThis as { fetch?: FetchLike }).fetch;
    if (typeof fetchFn !== 'function') {
      throw new Error('当前环境没有全局 fetch，请通过 createHttpClient({ fetch }) 注入实现');
    }

    await onRequest?.(config);

    const url = appendQuery(config.url ?? '', config.params);
    const method = (config.method ?? 'GET').toUpperCase();
    const headers: Record<string, string> = { ...baseHeaders, ...(config.headers ?? {}) };
    const body = serializeBody(config.data, headers);
    const timeout = config.timeoutMs ?? timeoutMs;
    const attempts = Math.max(0, retries) + 1;

    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      // 每次尝试都要新的 AbortController：被 abort 过的 signal 不能复用
      // A fresh AbortController per attempt: an aborted signal cannot be reused
      const controller = new AbortController();
      const abortUpstream = () => controller.abort();
      let timer: ReturnType<typeof setTimeout> | undefined;

      if (timeout > 0) {
        timer = setTimeout(abortUpstream, timeout);
      }
      // 调用方的取消信号要透传到本次尝试，否则 abort 之后请求还在跑
      // Forward the caller's signal into this attempt, otherwise abort leaks a live request
      config.signal?.addEventListener('abort', abortUpstream);

      try {
        const response = await fetchFn(url, {
          method,
          headers,
          body,
          signal: controller.signal,
        });
        const result: HttpResponse<T> = {
          data: (await parseBody(response)) as T,
          status: response.status,
          headers: collectHeaders(response),
        };

        // 钩子在抛错之前触发，便于把失败响应也记进日志或埋点
        // The hook runs before throwing so failed responses can still be logged
        await onResponse?.(result);

        if (!response.ok) {
          const reason = `${response.status} ${response.statusText}`;
          throw new HttpError(`HTTP ${reason} on ${method} ${url}`, {
            status: response.status,
            url,
            body: result.data,
          });
        }

        return result;
      } catch (error) {
        lastError = error;
        if (!isRetryable(error) || attempt === attempts - 1) {
          throw error;
        }
        await delay(retryDelayMs * 2 ** attempt);
      } finally {
        // 定时器和监听器必须在每次尝试结束时清理，否则重试会越堆越多
        // Timer and listener are cleaned per attempt, otherwise retries pile them up
        if (timer !== undefined) {
          clearTimeout(timer);
        }
        config.signal?.removeEventListener('abort', abortUpstream);
      }
    }

    throw lastError;
  }

  return { request };
}

// ============================================================================
// 内部工具 | Internal helpers
// ============================================================================

/** 判断错误是否值得重试 | Decide whether an error is worth retrying */
function isRetryable(error: unknown): boolean {
  if (error instanceof HttpError) {
    return RETRYABLE_STATUS.has(error.status);
  }
  // 主动取消和超时不重试：调用方已经表达了「别再等」的意图
  // Cancellation and timeout are never retried: the caller already said "stop waiting"
  if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
    return false;
  }
  // 其余（DNS、连接重置、TLS 等）按网络抖动处理
  // Everything else (DNS, connection reset, TLS) is treated as a transient network fault
  return true;
}

/**
 * 拼接 query string | Append the query string
 *
 * 规则：null / undefined 整个跳过（而不是写成 "key="）；数组展开成重复 key，
 * 与 Swagger 的 collectionFormat=multi 一致；Date 转 ISO 字符串
 *
 * Rules: null / undefined are skipped entirely (not emitted as "key="); arrays
 * expand into repeated keys, matching Swagger's collectionFormat=multi; Date
 * values become ISO strings.
 */
function appendQuery(url: string, params: Record<string, unknown> | undefined): string {
  const pairs: string[] = [];

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null) continue;
    const items = Array.isArray(value) ? value : [value];
    for (const item of items) {
      if (item === undefined || item === null) continue;
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(stringifyParam(item))}`);
    }
  }

  if (pairs.length === 0) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${pairs.join('&')}`;
}

/** 单个 query 值转字符串 | Stringify a single query value */
function stringifyParam(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/**
 * 序列化请求体 | Serialize the request body
 *
 * 只有在调用方没有显式指定 Content-Type 时才补 application/json，
 * 避免覆盖 multipart 或自定义协议的头
 *
 * Content-Type is only defaulted to application/json when the caller did not set
 * one, so multipart or custom protocol headers are never overwritten.
 */
function serializeBody(data: unknown, headers: Record<string, string>): unknown {
  if (data === undefined || data === null) return undefined;
  if (typeof data === 'string') return data;
  if (isBinaryBody(data)) return data;

  if (!hasHeader(headers, 'content-type')) {
    headers['Content-Type'] = 'application/json';
  }
  return JSON.stringify(data);
}

/** 判断是否为无需 JSON 序列化的体 | Whether the body bypasses JSON serialization */
function isBinaryBody(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false;
  return BINARY_BODY_TYPES.has(data.constructor?.name ?? '');
}

/** 大小写无关地判断 header 是否已存在 | Case-insensitive header presence check */
function hasHeader(headers: Record<string, string>, name: string): boolean {
  return Object.keys(headers).some((key) => key.toLowerCase() === name);
}

/**
 * 解析响应体 | Parse the response body
 *
 * 统一走 text() 再按需 JSON.parse：这样 FetchResponse 只需要声明一个方法，
 * 并且 Content-Type 撒谎（声明 json 实际返回 HTML 错误页）时不会抛解析异常，
 * 而是把原文交给调用方排查
 *
 * Always read text() and JSON.parse on demand: FetchResponse then needs a single
 * method, and a lying Content-Type (declaring json while returning an HTML error
 * page) yields the raw text for debugging instead of a parse crash.
 */
async function parseBody(response: FetchResponse): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  if (!(response.headers.get('content-type') ?? '').includes('json')) return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** 收集响应头到普通对象 | Collect response headers into a plain object */
function collectHeaders(response: FetchResponse): Record<string, string> {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, name) => {
    headers[name.toLowerCase()] = value;
  });
  return headers;
}

/** 退避等待 | Backoff sleep */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
