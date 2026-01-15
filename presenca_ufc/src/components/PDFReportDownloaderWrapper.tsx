'use client'

import dynamic from 'next/dynamic'

const PDFReportDownloader = dynamic(() => import('./pdfReportDownloader'), {
  ssr: false,
})

export default function PDFReportDownloaderWrapper({ report, professorName }: { report: any, professorName: string }) {
  return (
    <PDFReportDownloader report={report} professorName={professorName} />
  )
}