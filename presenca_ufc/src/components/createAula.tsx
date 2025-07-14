'use client'

import { createLessonServerAction } from "@/actions/createLesson"
import { Button, Spinner, useToast } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Turma = {
  turmaId: string
}

export default function GenerateLesson({ turmaId }: Turma) {
  const toast = useToast()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleServerAction = () => {
    setIsCreating(true)
    
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const result = await createLessonServerAction(turmaId, coords.latitude, coords.longitude)
        
        setIsCreating(false)
        
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
      },
      (error) => {
        setIsCreating(false)
        toast({
          position: "top-right",
          title: "Erro ao criar aula",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return (
    <Button onClick={handleServerAction} isLoading={isCreating} loadingText='Criando...' colorScheme='teal'>
      Clique para criar uma nova aula
    </Button>
  )
}