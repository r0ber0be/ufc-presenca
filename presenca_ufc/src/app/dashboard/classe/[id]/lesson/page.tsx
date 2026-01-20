import QRAula from "@/components/showAula"

export default async function Lesson({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params
  return (
    <QRAula turmaId={id} />
  )
}