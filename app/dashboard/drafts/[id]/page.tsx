import DraftView from './DraftView'

export default function Page({ params }: { params: { id: string } }) {
  return <DraftView draftId={params.id} />
}
