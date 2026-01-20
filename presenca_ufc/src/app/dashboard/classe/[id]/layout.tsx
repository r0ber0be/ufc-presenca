import TabMenu from "@/components/tabMenu"

export default async function ClasseLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ id: string }>
}>) {
  const { id } = await params
  return (
    <>
      <TabMenu id={id} />
      {children}
    </>
  )
}
