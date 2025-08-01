import { Tab, TabList, Tabs } from "@chakra-ui/react";
import Link from "next/link";

export default function TabMenu(params: { id: string, index: number }) {
  const { id, index } = params
  return (
    <Tabs defaultIndex={index} variant='line'>
      <TabList mb='1em'>
        <Tab as={Link} href={`/dashboard/classe/${id}`} width="50%" textAlign="center">
          Presenças
        </Tab>
        <Tab as={Link} href={`/dashboard/classe/${id}/lesson`} width="50%" textAlign="center">
          QR Code
        </Tab>
      </TabList>
    </Tabs>
  )
}