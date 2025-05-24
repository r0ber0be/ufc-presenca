import AlunoTable from "@/components/alunoTable";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

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
          <AlunoTable turmaId={id} />
        </TabPanel>
        <TabPanel>
          <p>Hey sup!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}