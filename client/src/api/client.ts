import { ApiErrorBody } from '@cafefinder/shared';

/** Base URL for all API calls. Injected from env; proxied during local dev. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/** Raised whenever the server returns a non-2xx response. */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(statusCode: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Typed fetch wrapper for the Café Finder API.
 *
 * Authentication is cookie-based: the server sets an HTTP-only `cf.access` JWT
 * cookie plus a `cf.refresh` cookie. The browser sends them automatically, so no
 * token is ever stored on the client. On a 401 we transparently call
 * `/auth/refresh` once and retry the original request.
 */
class ApiClient {
  private refreshing: Promise<boolean> | null = null;

  async request<T>(
    path: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: unknown;
      query?: Record<string, string | number | boolean | undefined | null>;
      headers?: Record<string, string>;
      signal?: AbortSignal;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, query, headers = {}, signal } = options;

    const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method,
        credentials: 'include', // send the HTTP-only auth cookies
        signal,
        headers: {
          Accept: 'application/json',
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...headers,
        },
        body:
          body === undefined
            ? undefined
            : isFormData
              ? (body as FormData)
              : JSON.stringify(body),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err;
      throw new ApiError(0, 'Network error. Please check your connection and try again.');
    }

    // Transparently attempt one refresh on an expired access cookie.
    if (response.status === 401 && !path.startsWith('/auth')) {
      const refreshed = await this.tryRefreshOnce();
      if (refreshed) return this.request<T>(path, options);
    }

    const contentType = response.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (!response.ok) {
      const errorBody =
        typeof data === 'object' && data !== null ? (data as Partial<ApiErrorBody>) : {};
      throw new ApiError(
        response.status,
        errorBody.message ?? `Request failed with status ${response.status}`,
        errorBody.fieldErrors
      );
    }

    return data as T;
  }

  /** Ensure only one refresh in flight at a time. */
  private tryRefreshOnce(): Promise<boolean> {
    if (!this.refreshing) {
      this.refreshing = this.doRefresh().finally(() => {
        this.refreshing = null;
      });
    }
    return this.refreshing;
  }

  private async doRefresh(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient();