import { Box, Text } from "@chakra-ui/react";

export default function EmptyPage() {
  return (
    <Box w='100%' h='80vh' alignContent='center'>
      <Text fontSize={{ sm: '18', md: '20', lg: '22' }} align='center'>Nenhuma turma por enquanto.</Text>
    </Box>
  )
}