'use client'

import { createLessonServerAction } from "@/actions/createLesson"
import { Button, useToast } from "@chakra-ui/react"
import { useRouter } from "next/navigation"

type Turma = {
  turmaId: string
}

export default function GenerateLesson({ turmaId }: Turma) {
  const toast = useToast()
  const router = useRouter()

  const handleServerAction = async () => {
    const result = await createLessonServerAction(turmaId)
    
    if (result.success) {
      toast({
        position: "top-right",
        title: 'Aula criada com sucesso!',
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      router.refresh()
    } else {
      toast({
        position: "top-right",
        title: "Erro ao criar aula",
        description: result.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Button onClick={handleServerAction} colorScheme='teal'>
      Clique para criar uma nova aula
    </Button>
  )
}