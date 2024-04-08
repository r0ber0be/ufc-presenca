import { Box, Card, CardBody, CardHeader, Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link"

export default function TurmaCard() {
  return (
    <ChakraLink as={Link} href="/dashboard/classe/IDClasse" >
      <Card maxW='100%' 
        variant='filled' 
        _hover={{ 
          bgGradient: 'linear(to-r, green.200, blue.100)',
        }}
      >
        <Flex p='15px'>
          <Flex flex='1' gap='4' flexWrap='wrap' justify='space-evenly'>
            <Box alignContent='center' p='10px'>
              <Heading size={{ base: 'sm'}}>Fundamentos de programação</Heading>
            </Box>
            <Box p='10px'>
              <Heading size='xs'>
                Segunda-feira
              </Heading>
              <Text pt='2' fontSize='sm'>
                13:30 - 15:30
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Card>
    </ChakraLink>
  )
}