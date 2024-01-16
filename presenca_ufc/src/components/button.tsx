'use client'

import { Button } from '@chakra-ui/react'

export default function PressButton() {
  return <Button onClick={() => alert("Botão clicado com sucesso!")} colorScheme='blue'>Clique aqui</Button>
}