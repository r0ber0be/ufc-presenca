import TabMenu from "@/components/tabMenu"
import dynamic from "next/dynamic"

const DynamicAlunoTable = dynamic(() => import('@/components/alunoTable'))

export default function DetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  return (
    <>
      <TabMenu id={id} />
      <DynamicAlunoTable turmaId={id} />
    </>
  )
}