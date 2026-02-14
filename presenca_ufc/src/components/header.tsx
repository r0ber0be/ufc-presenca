import { getProfessor } from "@/lib/jwt-decode/decoder"
import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"
import LogoutButton from "./logoutButton"

export default async function Header() {
  const { name, picture } = await getProfessor()
  return (
    <Box w='100%' color='white' bgGradient='linear(to-r, teal.500, green.500)'>
      <Flex h='10vh' align='center' justify='space-between' px={{ base: 4, sm: 9 }}>
        <Link href='/dashboard' >
          <Heading as='h2'>UFC</Heading>
          <Text align='center' fontSize={{ base: '8px', md: 'x-small' }} >PRESENÇAS</Text>
        </Link>
        <Flex align='center' gap={4}>
          <LogoutButton 
            size='sm' 
            variant='outline' 
            color='white' 
            borderColor='whiteAlpha.700'
            _hover={{ bg: 'whiteAlpha.300' }}
          >
            Sair
          </LogoutButton>

          <Box className='flex'>
            <Text alignSelf='center'
              fontSize={{ sm: '0.9rem', md: '1rem' }}
              display={{ base: 'none', sm: 'revert' }} pe={2}
            >
              {name}
            </Text>
            {
              picture
                ? <Image src={picture} priority width={40} height={40} className='w-10 h-10 rounded-full' alt='Foto de perfil' />
                : <Avatar size='md' />
            }
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}