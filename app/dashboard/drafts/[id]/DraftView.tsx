'use client'
content: string
status: DraftStatus
created_at: string
updated_at: string
}

export default function DraftView({ draftId }: { draftId: string }) {
const supabase = useSupabase()
const [draft, setDraft] = useState<Draft | null>(null)
const [loading, setLoading] = useState(true)
const router = useRouter()

async function load() {
if (!supabase) return
const { data, error } = await supabase
.from('drafts')
.select('id, title, content, status, created_at, updated_at')
.eq('id', draftId)
.single()
if (error) {
alert(`Impossibile caricare la bozza: ${error.message}`)
router.push('/dashboard')
return
}
setDraft(data as Draft)
setLoading(false)
}

useEffect(() => {
load()
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [supabase, draftId])

if (!supabase) return <div className="p-6 text-sm text-gray-500">Inizializzazione…</div>
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
