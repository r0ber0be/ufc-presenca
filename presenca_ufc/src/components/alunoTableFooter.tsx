'use client'

import { Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { getPresencaChanges, salvarPresencas, addChangeListener } from '@/services/presenca/presencaService'

export function AlunoTableFooter() {
  const [isLoading, setIsLoading] = useState(false)
  const [changeCount, setChangeCount] = useState(0)

  // Escuta as mudanças no serviço
  useEffect(() => {
    setChangeCount(getPresencaChanges().length)
    
    // Registra o listener para atualizações futuras
    const removeListener = addChangeListener(() => {
      setChangeCount(getPresencaChanges().length)
    });
    
    // Limpa o listener quando o componente é desmontado
    return removeListener
  }, [])

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await salvarPresencas()
      setChangeCount(0); // Após as mudanças bem sucedidas, reseta o count
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Button
      marginTop='1rem'
      loadingText='Salvando'
      spinnerPlacement='end'
      colorScheme='telegram'
      onClick={handleClick}
      isLoading={isLoading}
      isDisabled={changeCount === 0}>
        Salvar alterações
    </Button>
  )
}