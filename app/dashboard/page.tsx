'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSupabase } from '../../lib/useSupabase'
import { StatusBadge, type DraftStatus } from '../../components/StatusBadge'

type Draft = {
  id: string
  title: string
  status: DraftStatus
  updated_at: string | null
  created_at: string | null
}

export default function DashboardPage() {
  const supabase = useSupabase()
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!supabase) return
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('drafts')
        .select('id, title, status, updated_at, created_at')
        .order('updated_at', { ascending: false })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setDrafts((data ?? []) as Draft[])
      setLoading(false)
    }
    load()
  }, [supabase])

  if (!supabase) return <div className="p-6 text-sm text-gray-500">Inizializzazione…</div>
  if (loading) return <div className="p-6 text-sm text-gray-500">Caricamento bozze…</div>
  if (error) return <div className="p-6 text-sm text-red-600">Errore: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Le tue bozze</h1>

      {drafts.length === 0 ? (
        <div className="text-sm text-gray-600">Non ci sono bozze ancora.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titolo</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aggiornata</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {drafts.map((draft) => (
                <tr key={draft.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{draft.title || '—'}</td>
                  <td className="px-4 py-2"><StatusBadge status={draft.status} /></td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {draft.updated_at ? new Date(draft.updated_at).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/dashboard/drafts/${draft.id}`} className="text-blue-600 hover:underline">
                      Apri
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
