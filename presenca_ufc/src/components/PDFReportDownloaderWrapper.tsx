'use client'

import dynamic from 'next/dynamic'

const PDFReportDownloader = dynamic(() => import('./pdfReportDownloader'), {
  ssr: false,
})

export default function PDFReportDownloaderWrapper({ report, professorName }: Readonly<{ report: any, professorName: string }>) {
  return (
    <PDFReportDownloader report={report} professorName={professorName} />
  )
}