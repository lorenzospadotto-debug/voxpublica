'use client'

import React, { useEffect, useState } from 'react'
import { select, insert, getUserId } from '../lib/supaRest'

type Comment = { id: string; body: string; created_at: string; author_id: string }

export default function Comments({ draftId }: { draftId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    try {
      const data = await select(
        'draft_comments',
        `select=id,body,created_at,author_id&draft_id=eq.${draftId}&order=created_at.asc`
      )
      setComments(data ?? [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId])

  async function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    try {
      const uid = getUserId()
      if (!uid) throw new Error('Devi essere loggato')
      await insert('draft_comments', [{ draft_id: draftId, author_id: uid, body: body.trim() }])
      setBody('')
      await load()
    } catch (err: any) {
      alert(`Errore aggiungendo il commento: ${err?.message ?? err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-900">Commenti</h3>

      <ul className="mt-3 space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="rounded-lg border border-gray-200 p-3">
            <div className="text-sm text-gray-900 whitespace-pre-wrap">{c.body}</div>
            <div className="mt-1 text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
          </li>
        ))}
        {comments.length === 0 && <li className="text-sm text-gray-500">Nessun commento ancora.</li>}
      </ul>

      <form onSubmit={addComment} className="mt-4 flex items-start gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Scrivi un commento…"
          className="flex-1 rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
        <button
          disabled={loading || !body.trim()}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Invia
        </button>
      </form>
    </div>
  )
}

