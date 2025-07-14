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
  console.log('QRAula', turmaId)
  const token = await getCookies()

  const aula = await api.get(`/api/presencas/aula/${turmaId}`, {
    headers: {
      Authorization: `Bearer ${token}` 
    },
  }).catch(er=> { return er })

  console.log('QRAula Response', aula.data)
  console.log('----------------------------')
  if(aula.response?.status === 403) {
    return (
      <Flex flexDirection='column' h='80%' alignItems='center' justifyContent='center'>
        <Box p='4'>
          <p>
            { aula.response?.data.message }
          </p>
        </Box>
      </Flex>
    )
  }
  
  if(!aula.data) {
    return (
      <Flex flexDirection='column' h='80%' alignItems='center' justifyContent='center'>
        <Box p='4'>
          <p>
            { aula.response?.data.message }
          </p>
        </Box>
        <GenerateLesson turmaId={turmaId} />
      </Flex>
    )
  }

  const { id, classId, acceptPresenceByQRCode, signedToken } = aula.data
  return (
    <Flex flexDirection='column' h='90%' alignItems='center'>
      <Box maxW='432px' w='100%' maxH='450px'>
        <QRCode
          size={256}
          style={{ height: "auto", width: "100%" }}
          value={signedToken}
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