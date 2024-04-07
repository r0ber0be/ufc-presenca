import { getProfessor } from "@/lib/jwt-decode/decoder"
import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const { name, sub, picture } = getProfessor()
  return (
    <Box w='100%' color='white' bgGradient='linear(to-r, teal.500, green.500)'>
      <Flex h='10vh' align='center' justify='space-between' px={{ base: 4, sm: 9}}>
        <Box>
          <Heading as='h2'>UFC</Heading>
          <Text align='center' fontSize='x-small'>PRESENÇAS</Text>
        </Box>
        <Link href='dashboard/profile' className='flex hover:transition-colors'>
          <Text alignSelf='center' display={{ base: 'none', sm: 'revert' }} pe={2}>{name}</Text>
          { 
            picture 
            ? <Image src={picture} width={40} height={40} className='w-10 h-10 rounded-full' alt='Foto de perfil' />
            : <Avatar size='md' />
          }
        </Link>
      </Flex>
    </Box>
  )
}