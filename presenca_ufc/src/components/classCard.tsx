import { TurmaT } from "@/types/Turma";
import { Box, Card, Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link"

export default function ClassCard({ turma }:{ turma: TurmaT }) {
  const { id, code, name, numberOfStudents, classBlock, classRoom } = turma
  return (
    <ChakraLink as={Link} href={`/dashboard/classe/${id}`}>
      <Card maxW='100%'
        variant='filled'
        borderBottom='2px'
        borderColor='gray.200'
        _hover={{ 
          bgGradient: 'linear(to-r, green.200, blue.100)',
        }}
      >
        <Flex p={{ base: '12px', sm:'15px'}}>
          <Flex flex='1' gap={{ base: 'none', sm: '4' }} flexWrap='nowrap' justify='space-evenly'>
            <Box alignContent='center' maxW={{ base:'350px', '2xl': '450px' }} minW='150px' p='10px'>
              <Heading size={{ base: 'xs', md: 'sm', '2xl': 'md'}} textTransform='uppercase'>
                { name } - { code }
              </Heading>
              
              <Text pt='2' 
                align='center' 
                fontSize={{ base: 'xs', md: 'sm' }} 
                textTransform='uppercase'
              >
                Bloco {classBlock}, Sala {classRoom}
              </Text>
            </Box>

            <Box minW='100px' p='10px'>
              <Heading size='xs' textTransform='uppercase'>
                Presentes:
              </Heading>
              <Text pt='2' align='center' fontSize={{ base: 'xs', md: 'sm' }}>
                0 / { numberOfStudents }
              </Text>
            </Box>

            <Box minW='100px' p='10px'>
              <Heading size='xs' textTransform='uppercase'>
                Seg - Ter
              </Heading>
              
              <Text pt='2' align='center' fontSize={{ base: 'xs', md: 'sm' }}>
                13:30 - 15:30
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Card>
    </ChakraLink>
  )
}