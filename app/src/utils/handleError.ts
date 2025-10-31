import { AxiosError } from 'axios';

export const handleError = (e: unknown): string => {
  if (typeof e === 'string') return e;
  if (e instanceof AxiosError) {
    if (e.status === 404) return 'Ресурс не знайдено (404)';
    return e.response?.data?.message ?? e.message ?? 'Помилка мережевого запиту';
  }
  if (e instanceof Error) return e.message;
  return 'Unknown error';
};
