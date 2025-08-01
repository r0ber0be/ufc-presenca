'use client'

import { Button, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import {
  getPresencaChanges,
  salvarPresencas,
  addChangeListener
} from '@/services/presenca/presencaService'

export function AlunoTableFooter(props: { turmaId: string }) {
  const { turmaId } = props
  const [isLoading, setIsLoading] = useState(false)
  const [changeCount, setChangeCount] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const toast = useToast()

  const updateChangeCount = () => {
    const count = getPresencaChanges().length
    console.log('[DEBUG] Atualizando changeCount:', count)
    setChangeCount(count)
  }

  useEffect(() => {
    updateChangeCount()

    const removeListener = addChangeListener(() => {
      console.log('[DEBUG] Alteração detectada no serviço')
      updateChangeCount()
      setHasInteracted(true) // Marca que houve interação
    })

    return () => removeListener?.()
  }, [])

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await salvarPresencas(turmaId)
      toast({
        position: "top",
        title: 'Presenças atualizadas!',
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      // Após salvar, assume que não há mais alterações pendentes
      setChangeCount(0)
      setHasInteracted(false)
    } catch {
      toast({
        position: "top",
        title: 'Falha ao atualizar presenças!',
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      display='flex'
      justifySelf='center'
      alignSelf='center'
      marginTop="1rem"
      loadingText="Salvando"
      spinnerPlacement="end"
      colorScheme="blue"
      onClick={handleClick}
      isLoading={isLoading}
      isDisabled={changeCount === 0 && !hasInteracted} // ✅ considera interação
    >
      Salvar alterações
    </Button>
  )
}
