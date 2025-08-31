'use client'

import React, { useEffect, useState } from 'react'
import supabase from '../../../../lib/supabaseClient'
import { StatusBadge, type DraftStatus } from '../../../../components/StatusBadge'
import StatusControls from '../../../../components/StatusControls'
import Comments from '../../../../components/Comments'
import { useRouter } from 'next/navigation'

interface Draft {
  id: string
  title: string
  content: string
  status: DraftStatus
  created_at: string
  updated_at: string
}

export default function DraftView({ draftId }: { draftId: string }) {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('drafts')
        .select('id, title, content, status, created_at, updated_at')
        .eq('id', draftId)
        .single()

      if (error) {
        console.error(error)
        alert(`Impossibile caricare la bozza: ${error.message}`)
        router.push('/dashboard')
        return
      }
      setDraft(data as Draft)
      setLoading(false)
    }
    load()
  }, [draftId, router])

  if (loading) return <div className="p-6 text-sm text-gray-500">Caricamento bozza…</div>
  if (!draft) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{draft.title}</h1>
          <div className="mt-1">
            <StatusBadge status={draft.status} />
          </div>
        </div>
        <StatusControls draftId={draft.id} initialStatus={draft.status} />
      </div>

      <article className="max-w-none">
        <pre className="whitespace-pre-wrap text-sm leading-6">{draft.content}</pre>
      </article>

      <Comments draftId={draft.id} />
    </div>
  )
}
