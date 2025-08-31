'use client'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export function setTokens(access: string, refresh: string) {
  try {
    localStorage.setItem('sb-access-token', access)
    localStorage.setItem('sb-refresh-token', refresh)
  } catch {}
}

export function clearTokens() {
  try {
    localStorage.removeItem('sb-access-token')
    localStorage.removeItem('sb-refresh-token')
  } catch {}
}

export function getAccessToken(): string {
  try {
    return localStorage.getItem('sb-access-token') ?? ''
  } catch {
    return ''
  }
}

export function getUserId(): string | null {
  const token = getAccessToken()
  if (!token) return null
  try {
    const [, payloadB64] = token.split('.')
    const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    return payload?.sub ?? null
  } catch {
    return null
  }
}

async function rest(path: string, init: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error('Config Supabase mancante (URL o ANON KEY).')
  }

  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON,
    ...(init.headers as Record<string, string> | undefined),
  }

  const token = getAccessToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers,
  })

  // Supabase REST usa codici 200/201/204; per errori mette JSON col messaggio
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const data = await res.json()
      msg = data?.message || data?.error || msg
    } catch {}
    throw new Error(msg)
  }

  // alcune POST/PATCH con Prefer:return=representation tornano JSON
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return null
}

export async function select(table: string, query: string) {
  // Esempio: select('drafts', 'select=id,title&order=updated_at.desc')
  return rest(`/rest/v1/${table}?${query}`, { method: 'GET' })
}

export async function insert(table: string, rows: unknown) {
  return rest(`/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(rows),
  })
}

export async function updateById(table: string, id: string, patch: Record<string, unknown>) {
  return rest(`/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(patch),
  })
}
