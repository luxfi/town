import cache from "memory-cache";

export const cachedFetch = async (url: RequestInfo, options: RequestInit = {}, ttl = 60000) => {
  const cachedResponse = cache.get(url);
  if (cachedResponse) {
    return cachedResponse;
  } else {
    const response = await fetch(url, options);
    const data = await response.json();
    cache.put(url, data, ttl);
    return data;
  }
};