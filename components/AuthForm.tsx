'use client'

import React, { useState } from 'react'
import { useSupabase } from '../lib/useSupabase'

export default function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const supabase = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!supabase) {
      setError('Inizializzazione… riprova tra un attimo.')
      return
    }
    if (!email || !password) {
      setError('Inserisci email e password.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      }
      // Vai in dashboard dopo login/signup riuscito
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err?.message ?? 'Errore di autenticazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-3 rounded-lg border border-gray-200 p-4">
      <h1 className="text-lg font-semibold">
        {mode === 'signin' ? 'Accedi' : 'Crea un account'}
      </h1>

      <label className="block text-sm">
        <span className="text-gray-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="nome@esempio.it"
          autoComplete="email"
        />
      </label>

      <label className="block text-sm">
        <span className="text-gray-700">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        />
      </label>

      {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div>}

      <button
        type="submit"
        disabled={!supabase || loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Attendere…' : (mode === 'signin' ? 'Accedi' : 'Registrati')}
      </button>

      <div className="pt-2 text-center text-xs text-gray-500">
        {mode === 'signin'
          ? 'Non hai un account? Vai su /signup'
          : 'Hai già un account? Vai su /login'}
      </div>
    </form>
  )
}
