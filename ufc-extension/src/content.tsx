import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import type { SigaaData } from "types/teacher"
import SyncClassesButton from "~features/content/syncClassesButton"
import ConfirmationModal from "~features/content/confirmationModal"
import FillPercentages from "~features/content/fillPercentages"

export const config: PlasmoCSConfig = {
  matches: [
    "https://si3.ufc.br/sigaa/portais/docente/docente.jsf",
    "https://si3.ufc.br/sigaa/ensino/consolidacao/detalhesTurma.jsf"
  ]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

const SigaaSyncOverlay = () => {
  const [pageMode, setPageMode] = useState<"PORTAL" | "CONSOLIDACAO">()
  const [currentClassCode, setCurrentClassCode] = useState<string>(null)
  const [isUpdatingCache, setIsUpdatingCache] = useState(false)

  const [scrapedData, setScrapedData] = useState<SigaaData | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const triggerSilentUpdate = async () => {
    setIsUpdatingCache(true)
    try {
      await sendToBackground({ name: "updateCache" })
    } catch (error) {
      alert(error)
    } finally {
      setIsUpdatingCache(false)
    }
  }

  useEffect(() => {
    const url = globalThis.location.href
    const bodyText = document.body.innerText

    if (url.includes("docente.jsf") && document.getElementById("agenda-docente")) {
      setPageMode("PORTAL")
    } else if (url.includes("detalhesTurma.jsf")) {
      setPageMode("CONSOLIDACAO")
      // Tenta extrair o código da turma (Ex: QXD0268)
      const match = new RegExp(/([A-Z]{3}\d{4})/).exec(bodyText)
      if (match) {
        setCurrentClassCode(match[0])
        triggerSilentUpdate()
      }
    }
  }, [])

  return (
    <>
      <SyncClassesButton pageMode={pageMode} setErrorMessage={setErrorMessage} setScrapedData={setScrapedData} setShowConfirmation={setShowConfirmation} />
      <ConfirmationModal scrapedData={scrapedData} errorMessage={errorMessage} showConfirmation={showConfirmation} 
        setScrapedData={setScrapedData} setErrorMessage={setErrorMessage} setShowConfirmation={setShowConfirmation}
      />
      <FillPercentages pageMode={pageMode} currentClassCode={currentClassCode} isUpdatingCache={isUpdatingCache} />
    </>
  )
}

export default SigaaSyncOverlay