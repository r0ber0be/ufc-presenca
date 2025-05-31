'use server'

import { api } from '@/lib/axios/api'
import { getCookies } from '@/utils/authUtils'
import { Table, TableContainer, Th, Thead, Tr } from '@chakra-ui/react'
import { AlunoTableFooter } from './alunoTableFooter'
import { AlunoTableBody } from './alunoTableBody'
//const AlunoTableBody = dynamic(() => import('@/components/alunoTableBody'), { ssr: false })

type Turma = {
  turmaId: string
}

type ErrorApiResponseData = {
  message: string
}

type ErrorResponseStructure = {
  status: number,
  code?: string,
  // Quando há erro, 'data' pode não existir ou ser vazia,
  // mas o erro relevante está em 'response.data.message'
  data?: [],
  response: {
    data: ErrorApiResponseData,
    status: number,
  };
}

type SucccesPresencasResponse = {
  status: number,
  data: [],
  code?: string,
  response?: never,
}

type PresencasResponse = ErrorResponseStructure | SucccesPresencasResponse

export default async function AlunoTable({ turmaId }: Turma) {
  console.log('Id da turma', turmaId)
  const token = await getCookies()
  
  const diasDeAula: PresencasResponse = await api.get(`/api/${turmaId}/presencas/aulas`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    }).catch(er=> { return er })
  
  const message = diasDeAula.response?.data.message
  if(message) {
    return <p>{message}</p>
  }

  const dataDiasDeAula = diasDeAula.data!
  
  const presencasAlunos: PresencasResponse = await api.get(`/api/${turmaId}/presencas/alunos`, {
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  }).catch(er=> { return er })

  const { status, data, code } = presencasAlunos

  if(status === 401) {
    return <p>Você não tem permissão para acessar essa página.</p>
  }

  if(code === 'ECONNREFUSED') {
    return <p>Não foi possível se conectar com o servidor. Tente novamente.</p>
  }

  if(!data || data.length === 0) {
    return <p>Nada aqui por enquanto</p>
  }

  const formatarData = (isoDate: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(isoDate));
  };

  return (
    <>
      <TableContainer>
        <Table variant='striped' colorScheme='teal' size='sm' maxW='100%'>
          <Thead>
            <Tr>
              <Th>Aluno</Th>
              { dataDiasDeAula.map((aula: { date: string, id: string }) => {
                return ( <Th key={aula.id}> { formatarData(aula.date) } </Th> )
              })}
            </Tr>
          </Thead>
          <AlunoTableBody data={data} dias={dataDiasDeAula} />
        </Table>
      </TableContainer>

      <AlunoTableFooter />
    </>
  )
}