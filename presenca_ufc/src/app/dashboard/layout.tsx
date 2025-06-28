import Header from '@/components/header'
import { Box, Flex } from '@chakra-ui/react'

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {
  return (
    <Flex direction='column' height='100vh'>
      <Header />
      <Box flex='1' role='main' overflow='auto' minH='0'>
        {children}
      </Box>
    </Flex>
  )
}
