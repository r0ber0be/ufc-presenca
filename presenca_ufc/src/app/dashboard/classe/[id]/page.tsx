import TabMenu from "@/components/tabMenu"
import dynamic from "next/dynamic"

const DynamicAlunoTable = dynamic(() => import('@/components/alunoTable'))

export default async function DetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params
  return (
    <>
      <TabMenu id={id} index={0} />
      <DynamicAlunoTable turmaId={id} />
    </>
  )
}