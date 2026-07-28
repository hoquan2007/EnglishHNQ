/**
 * Generic retry wrapper with timeout for API calls
 */

/**
 * Fetch with retry logic, timeout, and exponential backoff
 */
export const fetchWithRetry = async <T>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  delay = 1000,
  timeout = 15000
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const contentType = res.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return await res.json();
        }
        return await res.text() as unknown as T;
      } catch (e) {
        if (i === retries - 1) throw e;
        console.warn(`Retry ${i + 1}/${retries} for ${url}:`, e);
        await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }

  throw new Error('All retries failed');
};

/**
 * Generic retry wrapper for async functions
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries - 1) throw e;
      console.warn(`Retry ${i + 1}/${retries}:`, e);
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
  throw new Error('All retries failed');
};
