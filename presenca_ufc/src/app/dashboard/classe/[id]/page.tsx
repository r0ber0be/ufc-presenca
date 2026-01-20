import dynamic from "next/dynamic"

const DynamicAlunoTable = dynamic(() => import('@/components/alunoTable'))

export default async function DetailsPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params
  return (
    <DynamicAlunoTable turmaId={id} />
  )
}