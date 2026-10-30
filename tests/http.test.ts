/*
 * @Author: kamalyes example@qq.com
 * @Date: 2026-10-30 17:29:16
 * @LastEditors: kamalyes example@qq.com
 * @LastEditTime: 2026-10-30 17:29:16
 * @FilePath: \my-api-sdk\tests\http.test.ts
 * @Description: HTTP 适配层单测 | Unit tests for the HTTP adapter layer
 *
 * Copyright (c) 2026 by kamalyes, All Rights Reserved.
 */

// 这些用例全部用注入的假 fetch，不发真实请求 | Every case injects a fake fetch, no real traffic.
// 手写层是唯一需要测的部分：生成目录每次都会被覆盖，测它没有意义
// The hand-written layer is the only thing worth testing: the generated directory
// is overwritten on every run.

import { describe, expect, it, vi } from 'vitest';
import {
  createHttpClient,
  HttpError,
  type FetchInit,
  type FetchLike,
  type FetchResponse,
} from '../src/http';

// ============================================================================
// 测试替身 | Test doubles
// ============================================================================

interface RecordedCall {
  url: string;
  init: FetchInit;
}

/** 按队列返回预设响应的假 fetch | Fake fetch replaying a queue of stubbed results */
function createStubFetch(queue: Array<FetchResponse | Error>): {
  fetch: FetchLike;
  calls: RecordedCall[];
} {
  const calls: RecordedCall[] = [];

  const fetch: FetchLike = async (url, init) => {
    calls.push({ url, init });
    const next = queue.shift();
    if (!next) throw new Error('stub fetch: 预设响应已用尽 | no stubbed response left');
    if (next instanceof Error) throw next;
    return next;
  };

  return { fetch, calls };
}

/** 构造一个假响应 | Build a fake response */
function response(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): FetchResponse {
  const merged: Record<string, string> = { 'content-type': 'application/json', ...headers };

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'ERROR',
    headers: {
      get: (name) => merged[name.toLowerCase()] ?? null,
      forEach: (callback) => {
        for (const [name, value] of Object.entries(merged)) callback(value, name);
      },
    },
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  };
}

// ============================================================================
// 请求构造 | Request construction
// ============================================================================

describe('请求构造 | request construction', () => {
  it('拼接 query、合并 header 并解析 JSON | builds query, merges headers, parses JSON', async () => {
    const { fetch, calls } = createStubFetch([response(200, { id: 1 })]);
    const client = createHttpClient({ fetch, headers: { 'X-Base': 'base', 'X-Both': 'base' } });

    const result = await client.request<{ id: number }>({
      method: 'get',
      url: 'https://api.example.com/v1/pets',
      params: { page: 1, keyword: 'dog cat' },
      headers: { 'X-Both': 'request' },
    });

    expect(result.data).toEqual({ id: 1 });
    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toBe('application/json');
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('https://api.example.com/v1/pets?page=1&keyword=dog%20cat');
    expect(calls[0].init.method).toBe('GET');
    // 单次请求的同名 header 覆盖客户端级别的值 | per-request headers win
    expect(calls[0].init.headers).toMatchObject({ 'X-Base': 'base', 'X-Both': 'request' });
  });

  it('跳过空值、展开数组、Date 转 ISO | skips nullish, expands arrays, ISO-formats dates', async () => {
    const { fetch, calls } = createStubFetch([response(200, {})]);
    const client = createHttpClient({ fetch });

    await client.request({
      url: '/v1/pets',
      params: {
        status: ['available', 'sold'],
        empty: null,
        missing: undefined,
        since: new Date('2026-01-02T03:04:05.000Z'),
      },
    });

    expect(calls[0].url).toBe(
      '/v1/pets?status=available&status=sold&since=2026-01-02T03%3A04%3A05.000Z',
    );
  });

  it('已有 query 时用 & 续接 | appends with & when a query already exists', async () => {
    const { fetch, calls } = createStubFetch([response(200, {})]);
    const client = createHttpClient({ fetch });

    await client.request({ url: '/v1/pets?sort=id', params: { page: 2 } });

    expect(calls[0].url).toBe('/v1/pets?sort=id&page=2');
  });
});

// ============================================================================
// 请求体 | Request body
// ============================================================================

describe('请求体 | request body', () => {
  it('对象按 JSON 序列化并补 Content-Type | serializes objects and defaults Content-Type', async () => {
    const { fetch, calls } = createStubFetch([response(200, {})]);
    const client = createHttpClient({ fetch });

    await client.request({ method: 'post', url: '/v1/pets', data: { name: 'kitty' } });

    expect(calls[0].init.body).toBe('{"name":"kitty"}');
    expect(calls[0].init.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('字符串原样透传且不覆盖已有 Content-Type | passes strings through, keeps explicit Content-Type', async () => {
    const { fetch, calls } = createStubFetch([response(200, {})]);
    const client = createHttpClient({ fetch });

    await client.request({
      method: 'post',
      url: '/v1/raw',
      data: 'name=kitty',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    expect(calls[0].init.body).toBe('name=kitty');
    expect(calls[0].init.headers).toEqual({
      'content-type': 'application/x-www-form-urlencoded',
    });
  });
});

// ============================================================================
// 错误语义 | Error semantics
// ============================================================================

describe('错误语义 | error semantics', () => {
  it('非 2xx 抛 HttpError 并带上解析后的响应体 | throws HttpError carrying the parsed body', async () => {
    const { fetch } = createStubFetch([response(404, { code: 'PET_NOT_FOUND' })]);
    const client = createHttpClient({ fetch });

    const error = await client.request({ url: '/v1/pets/404' }).catch((err: unknown) => err);

    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(404);
    expect((error as HttpError).url).toBe('/v1/pets/404');
    expect((error as HttpError).body).toEqual({ code: 'PET_NOT_FOUND' });
  });

  it('Content-Type 不是 JSON 时返回原文 | returns raw text for non-JSON responses', async () => {
    const { fetch } = createStubFetch([
      response(200, '<html>maintenance</html>', { 'content-type': 'text/html' }),
    ]);
    const client = createHttpClient({ fetch });

    const result = await client.request<string>({ url: '/v1/pets' });

    expect(result.data).toBe('<html>maintenance</html>');
  });
});

// ============================================================================
// 重试与超时 | Retry & timeout
// ============================================================================

describe('重试与超时 | retry and timeout', () => {
  it('5xx 会重试并最终成功 | retries 5xx and eventually succeeds', async () => {
    const { fetch, calls } = createStubFetch([response(503, {}), response(200, { ok: true })]);
    const client = createHttpClient({ fetch, retries: 2, retryDelayMs: 0 });

    const result = await client.request<{ ok: boolean }>({ url: '/v1/pets' });

    expect(result.data).toEqual({ ok: true });
    expect(calls).toHaveLength(2);
  });

  it('网络错误会重试 | retries network failures', async () => {
    const { fetch, calls } = createStubFetch([
      new Error('ECONNRESET'),
      response(200, { ok: true }),
    ]);
    const client = createHttpClient({ fetch, retries: 1, retryDelayMs: 0 });

    await client.request({ url: '/v1/pets' });

    expect(calls).toHaveLength(2);
  });

  it('4xx 不重试 | never retries 4xx', async () => {
    const { fetch, calls } = createStubFetch([response(400, { code: 'BAD_REQUEST' })]);
    const client = createHttpClient({ fetch, retries: 3, retryDelayMs: 0 });

    await expect(client.request({ url: '/v1/pets' })).rejects.toBeInstanceOf(HttpError);
    expect(calls).toHaveLength(1);
  });

  it('重试次数用尽后抛出最后一次错误 | throws the last error once retries are exhausted', async () => {
    const { fetch, calls } = createStubFetch([response(500, {}), response(500, {})]);
    const client = createHttpClient({ fetch, retries: 1, retryDelayMs: 0 });

    await expect(client.request({ url: '/v1/pets' })).rejects.toBeInstanceOf(HttpError);
    expect(calls).toHaveLength(2);
  });

  it('超时会取消请求且不重试 | aborts on timeout without retrying', async () => {
    const calls: RecordedCall[] = [];
    const fetch: FetchLike = (url, init) =>
      new Promise((_resolve, reject) => {
        calls.push({ url, init });
        init.signal?.addEventListener('abort', () => {
          const error = new Error('请求超时 | request timed out');
          error.name = 'AbortError';
          reject(error);
        });
      });
    const client = createHttpClient({ fetch, timeoutMs: 5, retries: 3, retryDelayMs: 0 });

    await expect(client.request({ url: '/v1/slow' })).rejects.toThrow('请求超时');
    expect(calls).toHaveLength(1);
  });
});

// ============================================================================
// 钩子 | Hooks
// ============================================================================

describe('钩子 | hooks', () => {
  it('请求前后的钩子都会触发 | both hooks fire around the request', async () => {
    const { fetch } = createStubFetch([response(200, { id: 1 })]);
    const onRequest = vi.fn();
    const onResponse = vi.fn();
    const client = createHttpClient({ fetch, onRequest, onResponse });

    await client.request({ url: '/v1/pets' });

    expect(onRequest).toHaveBeenCalledTimes(1);
    expect(onResponse).toHaveBeenCalledTimes(1);
    expect(onResponse.mock.calls[0][0]).toMatchObject({ status: 200, data: { id: 1 } });
  });

  it('失败响应同样会触发 onResponse | onResponse also fires for failed responses', async () => {
    const { fetch } = createStubFetch([response(500, { code: 'OOPS' })]);
    const onResponse = vi.fn();
    const client = createHttpClient({ fetch, onResponse });

    await expect(client.request({ url: '/v1/pets' })).rejects.toBeInstanceOf(HttpError);
    expect(onResponse).toHaveBeenCalledTimes(1);
  });
});
