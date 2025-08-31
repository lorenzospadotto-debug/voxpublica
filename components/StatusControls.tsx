'use client'
import React, { useState } from 'react'
import type { DraftStatus } from './StatusBadge'
import { useSupabase } from '@/lib/useSupabase'

export default function StatusControls({ draftId, initialStatus }: { draftId: string; initialStatus: DraftStatus }) {
const supabase = useSupabase()
const [status, setStatus] = useState<DraftStatus>(initialStatus)
const [saving, setSaving] = useState(false)

async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
const newStatus = e.target.value as DraftStatus
setSaving(true)
try {
if (!supabase) return
const { error } = await supabase.from('drafts').update({ status: newStatus }).eq('id', draftId)
if (error) throw error
setStatus(newStatus)
} catch (err: any) {
alert(`Errore aggiornando lo stato: ${err.message ?? err}`)
} finally {
setSaving(false)
}
}

return (
<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
Stato:
<select
value={status}
onChange={onChange}
disabled={!supabase || saving}
className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
>
<option value="draft">Bozza</option>
<option value="review">In revisione</option>
<option value="approved">Approvato</option>
<option value="published">Pubblicato</option>
</select>
</label>
)
}
