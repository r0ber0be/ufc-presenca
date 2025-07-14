import QRAula from "@/components/showAula";
import TabMenu from "@/components/tabMenu";

export default function Lesson({ params }: { params: { id: string } }) {
  const { id } = params
  return (
    <>
      <TabMenu id={id} />
      <QRAula turmaId={id} />
    </>
  )
}