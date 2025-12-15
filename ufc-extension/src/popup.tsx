import { useState, useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"

import "./style.css"
import type { TeacherClass, TeacherPayload } from "types/teacher"
import TeacherSection from "~features/popup/teacherSection"
import ConnectionStatus from "~features/popup/connectionStatus"
import TurmaSection from "~features/popup/turmaSection"
import TurnInOff from "~features/popup/turnInOff"

function IndexPopup() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState("")
  const [professor, setProfessor] = useState<TeacherPayload>()
  const [classes, setClasses] = useState<TeacherClass[]>([])

  const fetchClasses = async () => {
    try {
      const res = await sendToBackground({ name: "getTeacherClasses" })
      if (res.success) {
        setClasses(res.classes)
      } else {
        setStatusMessage("Erro ao buscar turmas.")
      }
    } catch (error) {
      setStatusMessage(`Erro ao buscar turmas: ${error}`)
    }
  }

  useEffect(() => {
    const checkConnectionStatus = async () => {
      setIsLoading(true)
      setStatusMessage("Verificando status...")
      try {
        const res = await sendToBackground({ name: "checkStatus" })
        if (res.success && res.isConnected) {
          setIsConnected(true)
          setProfessor(res.payload)
          setStatusMessage("")
          await fetchClasses()
        } else {
          setIsConnected(false)
          setProfessor(null)
          setClasses([])
          setStatusMessage("")
        }
      } catch (e) {
        console.error("Popup: Erro ao checar status", e)
        setIsConnected(false)
        setStatusMessage("Erro ao verificar status.")
      }
      setIsLoading(false)
    }
    checkConnectionStatus()
  }, [])

  const handleConnectToggle = async () => {
    setIsLoading(true)
    if (isConnected) {
      setStatusMessage("Desconectando...")
      try {
        const res = await sendToBackground({ name: "disconnect" })
        if (res.success) {
          setIsConnected(false)
          setProfessor(null)
          setClasses([])
          setStatusMessage("Desconectado.")
        } else {
          setStatusMessage("Erro ao desconectar.")
        }
      } catch (error) {
        setStatusMessage(`Erro fatal ao desconectar: ${error}`)
      }
    } else {
      setStatusMessage("Conectando...")
      try {
        const res = await sendToBackground({ name: "connect" })
        if (res.success) {
          setIsConnected(true)
          setProfessor(res.payload)
          setStatusMessage("Conectado com sucesso!")
          await fetchClasses()
        } else {
          setIsConnected(false)
          setStatusMessage(`${res.error}`)
        }
      } catch (error) {
        setIsConnected(false)
        setStatusMessage(`Erro fatal: ${error}`)
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="plasmo-min-w-[300px] plasmo-max-w-[350px] plasmo-bg-gray-800 plasmo-text-white plasmo-shadow-lg plasmo-rounded-lg plasmo-flex plasmo-flex-col">
      <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-4 plasmo-border-b plasmo-border-gray-700">
        <h1 className="plasmo-text-xl plasmo-font-bold">UFC Connector</h1>
      </div>

      <div className="plasmo-p-4 plasmo-flex plasmo-flex-col plasmo-gap-4">
        <TeacherSection professor={professor} isConnected={isConnected} isLoading={isLoading} />
        <ConnectionStatus isConnected={isConnected} isLoading={isLoading} />
        <TurmaSection classes={classes} isConnected={isConnected} isLoading={isLoading} />
        <TurnInOff isLoading={isLoading} isConnected={isConnected} statusMessage={statusMessage} handleConnectToggle={handleConnectToggle} />
      </div>

      <div className="plasmo-p-4 plasmo-border-t plasmo-border-gray-700 plasmo-flex plasmo-justify-end plasmo-text-sm plasmo-text-gray-500 plasmo-bg-gray-900 plasmo-rounded-b-lg">
        <span>Versão 1.0</span>
      </div>
    </div>
  )
}

export default IndexPopup