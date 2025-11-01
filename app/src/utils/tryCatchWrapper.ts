export type TypeTryCatchResult<T> = { success: true; data: T } | { success: false; error: unknown };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function tryCatchWrapper<T, Args extends any[]>(
  fn: (...args: Args) => T | Promise<T>,
  args: Args
): Promise<TypeTryCatchResult<T>> {
  try {
    return {
      success: true,
      data: await fn(...args),
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}
