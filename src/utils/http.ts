/**
 * HTTP client
 *
 * Thin wrapper around the Fetch API that:
 *   • Prepends API_BASE to relative URLs
 *   • Injects the stored auth token as a Bearer header
 *   • Normalises error responses into a typed ApiError
 *   • Provides typed get/post/put/del convenience methods
 */

import { API_BASE } from '@/constants'
import { getStorage, setStorage } from './storage'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ---------------------------------------------------------------------------
// Token management
// ---------------------------------------------------------------------------

const TOKEN_KEY = 'auth_token'

let _cachedToken: string | null = null

export async function getToken(): Promise<string | null> {
  if (_cachedToken !== null) return _cachedToken
  _cachedToken = (await getStorage(TOKEN_KEY)) as string | null
  return _cachedToken
}

export async function setToken(token: string): Promise<void> {
  _cachedToken = token
  await setStorage(TOKEN_KEY, token)
}

export async function clearToken(): Promise<void> {
  _cachedToken = null
  await setStorage(TOKEN_KEY, null)
}

// ---------------------------------------------------------------------------
// Core request helper
// ---------------------------------------------------------------------------

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  extraHeaders: Record<string, string> = {},
): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`
  const token = await getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    throw new ApiError(res.status, `HTTP ${res.status}: ${res.statusText}`)
  }

  const json: ApiResponse<T> = await res.json()

  // Non-zero codes from the API are treated as errors.
  if (json.code !== 0 && json.code !== 200) {
    throw new ApiError(json.code, json.msg)
  }

  return json.data
}

// ---------------------------------------------------------------------------
// Convenience methods
// ---------------------------------------------------------------------------

export const http = {
  get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return request<T>('GET', url, undefined, headers)
  },

  post<T>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    return request<T>('POST', url, body, headers)
  },

  put<T>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    return request<T>('PUT', url, body, headers)
  },

  del<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return request<T>('DELETE', url, undefined, headers)
  },
}

export default http
