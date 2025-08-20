import dynamic from 'next/dynamic'

const PDFReportDownload = dynamic(() => import('@/components/pdfReport'))

export default function ReportViewer() {
  return (
    <PDFReportDownload />
  )
}
