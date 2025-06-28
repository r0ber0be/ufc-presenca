import { Tab, TabList, Tabs } from "@chakra-ui/react";
import Link from "next/link";

export default function TabMenu(params: { id: string }) {
  const { id } = params
  return (
    <Tabs variant='line'>
      <TabList mb='1em'>
        <Link href={`/dashboard/classe/${id}`} passHref legacyBehavior>
          <Tab as="a" flex={1} textAlign="center">
            Presenças
          </Tab>
        </Link>
        <Link href={`/dashboard/classe/${id}/lesson`} passHref legacyBehavior>
          <Tab as="a" flex={1} textAlign="center">
            QR Code
          </Tab>
        </Link>
      </TabList>
    </Tabs>
  )
}