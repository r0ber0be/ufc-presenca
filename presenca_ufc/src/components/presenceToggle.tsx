'use client'

import React, { useState, useTransition } from 'react'
import { FormControl, FormLabel, Switch, Spinner, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Button, useDisclosure } from '@chakra-ui/react'
import { updateAulaPresenceStatus } from '@/actions/updateLesson'
import { useRouter } from 'next/navigation'

interface PresenceToggleProps {
  aulaId: string
  turmaId: string
  initialAcceptPresenceByQRCode: boolean
}

export function PresenceToggle({ aulaId, turmaId, initialAcceptPresenceByQRCode }: PresenceToggleProps) {
  const [isChecked, setIsChecked] = useState(initialAcceptPresenceByQRCode)
  const [isPending, startTransition] = useTransition()
  const toast = useToast()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const handleToggle = async () => {
    const newStatus = !isChecked

    setIsChecked(newStatus);

    startTransition(async () => {
      const result = await updateAulaPresenceStatus({
        aulaId,
        turmaId,
        acceptPresenceByQRCode: newStatus,
      });

      if (!result.success) {
        setIsChecked(!newStatus);
        toast({
          position: "top-right",
          title: "Erro ao atualizar",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          position: "top-right",
          title: "Sucesso!",
          description: `Presença por QR Code ${newStatus ? 'ativada' : 'desativada'}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        onClose()
        router.refresh()
      }
    })
  }

  return (
    <FormControl display='flex' alignItems='center' justifyContent='center'>
      <FormLabel htmlFor='allowPresence' mb='0'>
        Desativar registros de presença desta aula?
      </FormLabel>
      <Switch
        id="allowPresence"
        name="allowPresence"
        colorScheme="teal"
        size="lg"
        isChecked={isChecked}
        onChange={onOpen}
        isDisabled={isPending}
      />
      {isPending && <Spinner size="sm" ml={2} />}
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Esta ação é irreversível!</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Tem certeza que deseja desabilitar os registros de presença?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} colorScheme='red'>
              Não
            </Button>
            <Button onClick={handleToggle} colorScheme='green' ml={3}>
              Sim
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormControl>
  )
}