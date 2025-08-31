'use client'
import React from 'react'

export type DraftStatus = 'draft' | 'review' | 'approved' | 'published'

const styles: Record<DraftStatus, string> = {
draft: 'bg-gray-100 text-gray-800',
review: 'bg-yellow-100 text-yellow-800',
approved: 'bg-green-100 text-green-800',
published: 'bg-blue-100 text-blue-800',
}

export function StatusBadge({ status }: { status: DraftStatus }) {
return (
<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
{status.toUpperCase()}
</span>
)
}
