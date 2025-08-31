'use client'

import React, { useState } from 'react'
import supabase from '../lib/supabaseClient'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export default function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loginWithPasswordREST(email: string, password: string) {
    if (!SUPABASE_URL || !SUPABASE_ANON) {
      throw new Error('Config mancante: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }

    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON,
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      // Supabase di solito fornisce error_description / error
      const msg = data?.error_description || data?.error || 'Login fallito'
      throw new Error(msg)
    }

    // Imposta la sessione nel client Supabase
    const { access_token, refresh_token } = data
    const { error } = await supabase.auth.setSession({ access_token, refresh_token })
    if (error) throw error
  }

  async function signUpREST(email: string, password: string) {
    if (!SUPABASE_URL || !SUPABASE_ANON) {
      throw new Error('Config mancante: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON,
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      const msg = data?.msg || data?.message || data?.error_description || data?.error || 'Registrazione fallita'
      throw new Error(msg)
    }
    // opzionale: se il progetto richiede conferma email, qui potrebbe non esserci subito la sessione
    // Per coerenza tentiamo comunque il login immediato:
    try {
      await loginWithPasswordREST(email, password)
    } catch {
      // se l’email va confermata non forziamo il login
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Inserisci email e password.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        // 👉 bypass della funzione interna che ti dava “s is not a function”
        await loginWithPasswordREST(email, password)
      } else {
        await signUpREST(email, password)
      }
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error('[AUTH]', err)
      setError(String(err?.message ?? err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-3 rounded-lg border border-gray-200 p-4">
      <h1 className="text-lg font
