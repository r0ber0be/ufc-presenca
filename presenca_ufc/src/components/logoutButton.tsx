'use client'

import { logoutService } from '@/services/auth'
import { SIGN_IN } from '@/lib/constants/routes'
import { Button, ButtonProps, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton({ children, ...buttonProps }: Readonly<ButtonProps>) {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const error = await logoutService()

      if (error) {
        throw error
      }

      router.push(SIGN_IN)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Não foi possível sair da sessão.',
        description: 'Tente novamente em alguns instantes.',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} isLoading={isLoading} {...buttonProps}>
      { children ?? 'Sair' }
    </Button>
  )
}
