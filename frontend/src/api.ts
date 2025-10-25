export const BASE_URL: string = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'

export function api(path: string, init?: RequestInit) {
  return fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}
