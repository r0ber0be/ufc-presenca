import QRAula from "@/components/showAula";
import TabMenu from "@/components/tabMenu";

export default async function Lesson({ params }: { params: { id: string } }) {
  const { id } = await params
  return (
    <>
      <TabMenu id={id} index={1} />
      <QRAula turmaId={id} />
    </>
  )
}