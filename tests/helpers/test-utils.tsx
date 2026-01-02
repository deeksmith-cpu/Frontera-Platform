import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom render options
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialProps?: Record<string, unknown>;
}

// Provider wrapper for tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Custom render function with providers
const customRender = (ui: ReactElement, options?: CustomRenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render, userEvent };

// API route testing helper
export async function testApiRoute(
  handler: (req: Request, context?: { params: Promise<Record<string, string>> }) => Promise<Response>,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    params?: Record<string, string>;
  } = {}
) {
  const { method = 'GET', body, headers = {}, params = {} } = options;

  const request = new Request('http://localhost:3000/api/test', {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const context = params ? { params: Promise.resolve(params) } : undefined;
  const response = await handler(request, context);

  let data;
  const contentType = response.headers.get('Content-Type');
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return { response, data, status: response.status };
}

// Wait for async operations helper
export const waitForAsync = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Create mock ReadableStream for streaming responses
export function createMockReadableStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let index = 0;

  return new ReadableStream({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(encoder.encode(chunks[index]));
        index++;
      } else {
        controller.close();
      }
    },
  });
}

// Mock fetch helper for streaming responses
export function mockFetchWithStream(chunks: string[]) {
  return vi.fn().mockResolvedValue({
    ok: true,
    body: createMockReadableStream(chunks),
    headers: new Headers({
      'Content-Type': 'text/plain; charset=utf-8',
    }),
  } as Response);
}

// Mock fetch helper for JSON responses
export function mockFetchWithJson(data: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  } as Response);
}

// Import vi for use in helpers
import { vi } from 'vitest';
