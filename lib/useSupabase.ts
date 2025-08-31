'use client'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!url || !anon) {
  console.error('NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY mancano nelle env')
}

export const supabase = createClient(url, anon)
export default supabase
