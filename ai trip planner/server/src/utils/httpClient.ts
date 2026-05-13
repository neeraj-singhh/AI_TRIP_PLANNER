import axios, { AxiosRequestConfig } from 'axios';

export async function httpGetWithRetry<T>(
  url: string,
  config: AxiosRequestConfig = {},
  retries = 2
): Promise<T> {
  let attempt = 0;
  let lastError: any;

  while (attempt <= retries) {
    try {
      const res = await axios.get<T>(url, config);
      return res.data;
    } catch (err: any) {
      lastError = err;
      const status = err?.response?.status;
      const retryable = !status || status >= 500 || status === 429;
      if (!retryable || attempt === retries) break;
      await new Promise(r => setTimeout(r, 300 * Math.pow(2, attempt)));
      attempt++;
    }
  }

  throw lastError;
}

