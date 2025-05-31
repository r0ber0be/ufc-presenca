import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const DynamicAlunoTable = dynamic(() => import('@/components/alunoTable'))

export default function DetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  return (
    <Tabs isFitted>
      <TabList>
        <Tab>Presenças</Tab>
        <Tab>QR Code</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <DynamicAlunoTable turmaId={id} />
        </TabPanel>
        <TabPanel>
          <p>Hey sup!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}