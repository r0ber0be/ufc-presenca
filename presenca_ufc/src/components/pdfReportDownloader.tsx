'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFReport from './pdfReport'

const PDFReportDownloader = ({ report, professorName }: { report: any, professorName: string }) => {
  const turma = 'Matematica'
  return (
     <div className='p-4'>
      <PDFDownloadLink
        document={<PDFReport report={report} professorName={professorName} />}
        fileName={`${turma}-relatorio-presencas.pdf`}
      >
        {({ loading }) =>
          loading ? (
            <button className='px-4 py-2 bg-gray-400 text-white rounded' disabled>
              Gerando PDF...
            </button>
          ) : (
            <button className='px-4 py-2 bg-blue-600 text-white rounded'>
              Baixar Relatório em PDF
            </button>
          )
        }
      </PDFDownloadLink>
    </div>
  )
}

export default PDFReportDownloader