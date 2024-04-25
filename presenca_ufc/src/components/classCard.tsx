import { TurmaT } from "@/types/Turma";
import { Box, Card, Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link"

export default function ClassCard({ turma }:{ turma: TurmaT }) {
  const { name, hour, days, id, extraHour } = turma
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
            <Box alignContent='center' w='50%' maxW='250px' minW='150px' p='10px'>
              <Heading size={{ base: 'xs', md: 'sm'}}>
                { name }
              </Heading>
            </Box>

            <Box minW='100px' p='10px'>
              <Heading size='xs'>
                { days }
              </Heading>
              
              <Text pt='2' align='center' fontSize={{ base: 'xs', md: 'sm' }}>
                { hour }
              </Text>

              { extraHour &&
                <Text pt='2' align='center' fontSize={{ base: 'xs', md: 'sm' }}>
                  { extraHour }
                </Text> }
            </Box>
          </Flex>
        </Flex>
      </Card>
    </ChakraLink>
  )
}