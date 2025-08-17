export const fetcher = <T>(url: string, options?: RequestInit): Promise<T> =>
  fetch(url, { credentials: "include", ...options }).then((res) => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json() as Promise<T>;
  });
