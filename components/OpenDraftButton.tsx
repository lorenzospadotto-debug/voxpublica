'use client'
import Link from 'next/link'

export default function OpenDraftButton({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/drafts/${id}`} className="text-blue-600 hover:underline">
      Apri
    </Link>
  )
}
