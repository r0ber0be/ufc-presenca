import { api } from "@/lib/axios/api"
import { getCookies } from "@/utils/authUtils"
import QRCode from "react-qr-code"
import GenerateLesson from "./createAula"
import { PresenceToggle } from "./presenceToggle"
import { Box, Flex } from "@chakra-ui/react"

type Turma = {
  turmaId: string
}

export default async function QRAula({ turmaId }: Turma) {
  console.log(turmaId)
  const token = await getCookies()

  const aula = await api.get(`/api/presencas/aula/${turmaId}`, {
    headers: {
      Authorization: `Bearer ${token}` 
    },
  }).catch(er=> { return er })

  if(!aula.data) {
    return (
      <Flex flexDirection='column' h='80%' alignItems='center' justifyContent='center'>
        <Box p='10px'>
          Nenhuma aula aberta encontrada!
        </Box>
        <GenerateLesson turmaId={turmaId} />
      </Flex>
    )
  }
  console.log(aula.data)

  const { id, classId, acceptPresenceByQRCode, date } = aula.data
  const endpointURL = `http://localhost:8080/api/register/${id}/${classId}`
  return (
    <Flex flexDirection='column' h='90%' alignItems='center'>
      <Box maxW='432px' w='100%' maxH='450px'>
        <QRCode
          size={256}
          style={{ height: "auto", width: "100%" }}
          value={endpointURL}
          viewBox={`0 0 256 256`}
        />
      </Box>
      <Box mt='2' p='4'>
        <PresenceToggle
          aulaId={id}
          turmaId={classId}
          initialAcceptPresenceByQRCode={acceptPresenceByQRCode}
        />
      </Box>
    </Flex>
  )
}