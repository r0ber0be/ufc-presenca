import { TurmaT } from "@/types/Turma";
import { Box, Card, Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link"

export default function ClassCard({ turma }:{ turma: TurmaT }) {
  const { name, hour, days, id } = turma
  return (
    <ChakraLink as={Link} href={`/dashboard/classe/${id}`}>
      <Card maxW='100%' 
        variant='filled' 
        _hover={{ 
          bgGradient: 'linear(to-r, green.200, blue.100)',
        }}
      >
        <Flex p='15px'>
          <Flex flex='1' gap='4' flexWrap='wrap' justify='space-evenly'>
            <Box alignContent='center' w='50%' p='10px'>
              <Heading size={{ base: 'xs', md: 'sm'}}>
                { name }
              </Heading>
            </Box>
            <Box p='10px'>
              <Heading size='xs'>
                { days }
              </Heading>
              <Text pt='2' align='center' fontSize={{ base: 'xs', md: 'sm' }}>
                { hour }
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Card>
    </ChakraLink>
  )
}