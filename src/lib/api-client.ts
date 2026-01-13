import { ApiResponse } from "../../shared/types"
import { MESSAGES } from './messages'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init })
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok || !json.success || json.data === undefined) throw new Error(json.error || MESSAGES.API.REQUEST_FAILED)
  return json.data
}