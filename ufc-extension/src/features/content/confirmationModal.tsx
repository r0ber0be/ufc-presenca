import { sendToBackground } from "@plasmohq/messaging"
import { useState, type Dispatch, type SetStateAction } from "react"
import type { SigaaData } from "types/teacher"

type ModalType = {
  scrapedData: SigaaData,
  errorMessage: string,
  showConfirmation: boolean,
  setScrapedData: Dispatch<SetStateAction<SigaaData>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  setShowConfirmation: Dispatch<SetStateAction<boolean>>
}

export default function ConfirmationModal({ scrapedData, errorMessage, showConfirmation, setScrapedData, setErrorMessage, setShowConfirmation }: Readonly<ModalType>) {
  const [syncLoading, setSyncLoading] = useState(false)

  const handleConfirmSync = async () => {
    if (!scrapedData) return
    setSyncLoading(true)
    setErrorMessage("")

    try {
      const res = await sendToBackground({
        name: "syncSigaaData",
        body: scrapedData
      })

      if (!res.success) throw new Error(res.error) 
      
      setShowConfirmation(false)
      setScrapedData(null)
      alert(res.data.message)
    } catch (e) {
      setErrorMessage(e.message)
    }
    setSyncLoading(false)
  }
  
  const handleCancelSync = () => {
    setShowConfirmation(false)
    setScrapedData(null)
    setErrorMessage("")
  }

  return (
    <>
      { showConfirmation && (
        <div className="plasmo-z-[1000] plasmo-fixed plasmo-inset-0 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-bg-black plasmo-bg-opacity-70">
          <div className="plasmo-bg-gray-800 plasmo-text-white plasmo-rounded-lg plasmo-shadow-2xl plasmo-p-6 plasmo-w-full plasmo-max-w-md plasmo-flex plasmo-flex-col plasmo-gap-4">
            <h2 className="plasmo-text-xl plasmo-font-bold">Confirmar Sincronização</h2>
            
            { errorMessage && !scrapedData && (
              <p className="plasmo-text-red-400">
                {errorMessage}
              </p>
            )}

            { scrapedData && (
              <>
                <p className="plasmo-text-sm plasmo-text-gray-300">Deseja enviar estes dados para o UFC Presença?</p>
                <div className="plasmo-bg-gray-700 plasmo-p-4 plasmo-rounded-md plasmo-flex plasmo-flex-col plasmo-gap-2">
                  <div className="plasmo-flex plasmo-justify-between">
                    <span className="plasmo-text-gray-400">Professor:</span>
                    <span className="plasmo-font-medium">
                      {scrapedData.nomeCompleto}
                    </span>
                  </div>
                  { scrapedData.turmas.length > 0 && (
                    <div className="plasmo-mt-3">
                      <span className="plasmo-text-gray-400 plasmo-text-sm">Turmas:</span>
                      <ul className="plasmo-mt-2 plasmo-flex plasmo-flex-col plasmo-gap-1">
                        { scrapedData.turmas.map((turma) => (
                          <li key={turma.codigo} className="plasmo-bg-gray-600 plasmo-px-2 plasmo-py-1 plasmo-rounded plasmo-text-sm plasmo-font-medium">
                            {turma.nome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            { errorMessage && scrapedData && (
              <p className="plasmo-text-sm plasmo-text-red-400">{errorMessage}</p>
            )}

            <div className="plasmo-flex plasmo-justify-end plasmo-gap-3 plasmo-mt-2">
              <button title="Cancelar" type="button" onClick={handleCancelSync} disabled={syncLoading} className="plasmo-py-2 plasmo-px-4 plasmo-rounded-md plasmo-font-semibold plasmo-bg-gray-600 hover:plasmo-bg-gray-500 disabled:plasmo-opacity-50">Cancelar</button>
              
              { scrapedData && (
                <button title="Confirmar" type="submit" onClick={handleConfirmSync} disabled={syncLoading} className="plasmo-py-2 plasmo-px-4 plasmo-rounded-md plasmo-font-semibold plasmo-bg-blue-600 hover:plasmo-bg-blue-500 disabled:plasmo-opacity-50">
                  { syncLoading ? "Enviando..." : "Confirmar"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}