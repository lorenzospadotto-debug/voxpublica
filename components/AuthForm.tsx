'use client'

import React, { useState } from 'react'
import { setTokens } from '../lib/supaRest'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

type Mode = 'signin' | 'signup'

export default function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loginWithPasswordREST(email: string, password: string) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      const msg = data?.error_description || data?.error || 'Login fallito'
      throw new Error(msg)
    }
    setTokens(data.access_token, data.refresh_token)
  }

  async function signUpREST(email: string, password: string) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      const msg = data?.msg || data?.message || data?.error_description || data?.error || 'Registrazione fallita'
      throw new Error(msg)
    }
    // Se è richiesta conferma email, la sessione potrebbe non essere immediata.
    // Tenteremo comunque il login per convenienza:
    try { await loginWithPasswordREST(email, password) } catch {}
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!SUPABASE_URL || !SUPABASE_ANON) {
      setError('Config Supabase mancante: controlla le variabili NEXT_PUBLIC_* su Render.')
      return
    }
    if (!email || !password) {
      setError('Inserisci email e password.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signin') await loginWithPasswordREST(email, password)
      else await signUpREST(email, password)
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-3 rounded-lg border border-gray-200 p-4">
      <h1 className="text-lg font-semibold">{mode === 'signin' ? 'Accedi' : 'Crea un account'}</h1>

      <label className="block text-sm">
        <span className="text-gray-700">Email</span>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="nome@esempio.it" autoComplete="email" required
        />
      </label>

      <label className="block text-sm">
        <span className="text-gray-700">Password</span>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required
        />
      </label>

      {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div>}

      <button
        type="submit" disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Attendere…' : (mode === 'signin' ? 'Accedi' : 'Registrati')}
      </button>

      <div className="pt-2 text-center text-xs text-gray-500">
        {mode === 'signin' ? 'Non hai un account? Vai su /signup' : 'Hai già un account? Vai su /login'}
      </div>
    </form>
  )
}
