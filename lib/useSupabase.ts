'use client'
import { useEffect, useState } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function useSupabase(): SupabaseClient | null {
  const [client, setClient] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) {
      console.error('NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY mancano nelle env')
      return
    }
    setClient(createClient(url, anon))
  }, [])

  return client
}

export default useSupabase
