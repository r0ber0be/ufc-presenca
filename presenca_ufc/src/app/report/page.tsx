import { getClassReportServerAction } from '@/actions/getClassReport'
import { getProfessor } from '@/lib/jwt-decode/decoder'
import dynamic from 'next/dynamic'

const PDFReportDownload = dynamic(() => import('@/components/pdfReport'))

export default async function ReportViewer() {
  const { data, success, message } = await getClassReportServerAction('turmaId')
  if(!success) {
    console.log(message)
    return null
  }
  const { name } = await getProfessor()
  
  return (
    <PDFReportDownload report={data} professorName={name} />
  )
}
