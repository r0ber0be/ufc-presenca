import { sendToBackground } from "@plasmohq/messaging"
import type { Dispatch, SetStateAction } from "react"
import type { SigaaData } from "types/teacher"
import type { TurmaData } from "types/turma"
import { turmaBuilder } from "~helpers/turmaBuilder"

type SyncButtonData = {
  pageMode: string,
  setScrapedData: Dispatch<SetStateAction<SigaaData>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  setShowConfirmation: Dispatch<SetStateAction<boolean>>
}

export default function SyncClassesButton(
  { pageMode, setErrorMessage, setScrapedData, setShowConfirmation }: Readonly<SyncButtonData>
) {
  const handleStartSync = async () => {
    setErrorMessage("")
    try {
      const res = await sendToBackground({ name: "checkStatus" })
      if (res.success === false) throw new Error("Você não está conectado.")

      const nomeCompleto = document.querySelector("#info-usuario p")?.textContent.trim() || ""
      const categoria = document.querySelector("#agenda-docente > table > tbody > tr:nth-child(2) > td:nth-child(2)")?.textContent.trim() || ""
      const rows = document.querySelectorAll("#j_id_jsp_658057906_214 > table > tbody > tr:not(:nth-child(-n+2))")
      
      const turmas: TurmaData[] = turmaBuilder(rows)

      if (!nomeCompleto || !turmas) throw new Error("Dados não encontrados. Verifique se está na página correta.")
      
      setScrapedData({ nomeCompleto, categoria, turmas })
      setShowConfirmation(true)
    } catch (error) {
      setErrorMessage(error.message)
      setShowConfirmation(true) 
    }
  }
  return (
    <>
      { pageMode === "PORTAL" && (
        <button
          title="Sincronizar turmas"
          type="button" 
          onClick={handleStartSync} 
          className="plasmo-z-50 plasmo-fixed plasmo-bottom-8 plasmo-right-8 plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-py-3 plasmo-px-4 plasmo-rounded-lg plasmo-font-semibold plasmo-text-white plasmo-bg-blue-600 hover:plasmo-bg-blue-700 plasmo-shadow-lg"
        >
          Sincronizar turmas
        </button>
      )}
    </>
  )
}