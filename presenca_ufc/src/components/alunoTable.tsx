'use server'

import { api } from '@/lib/axios/api'
import { getCookies } from '@/utils/authUtils'
import { Flex, Table, TableContainer, Th, Thead, Tr } from '@chakra-ui/react'
import { AlunoTableFooter } from './alunoTableFooter'
import { AlunoTableBody } from './alunoTableBody'
import { DateCellTable } from './dateCellTable'

type Turma = {
  turmaId: string
}

type ErrorApiResponseData = {
  message: string
}

type ErrorResponseStructure = {
  status: number,
  code?: string,
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
    return (
      <Flex flexDirection='column' h='80%' alignItems='center' justifyContent='center'>
        <p>{ message }</p>
      </Flex>
    )
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
    return (
      <Flex flexDirection='column' h='80%' alignItems='center' justifyContent='center'>
        Nada aqui por enquanto
      </Flex>
    )
  }

  const agruparPorMes = (aulas: { date: string, id: string }[]) => {
    const mesesAgrupados: { [key: string]: { date: string, id: string }[] } = {}
    
    aulas.forEach(aula => {
      const data = new Date(aula.date)
      const mesAno = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      
      if (!mesesAgrupados[mesAno]) {
        mesesAgrupados[mesAno] = []
      }
      mesesAgrupados[mesAno].push(aula)
    })
    
    return mesesAgrupados
  };

  const mesesAgrupados = agruparPorMes(dataDiasDeAula)

  return (
    <>
      <TableContainer
        whiteSpace='nowrap'
        overflowX={{ base: 'auto', md: 'auto', lg: 'unset' }}
        overflowY='auto'
        maxH='calc(100vh - 200px)'
        flex='1'
        mb={4}
      >
        <Table
          variant='striped'
          colorScheme='teal'
          size='sm'
          width={{ base: 'auto', lg: '100%' }} 
          minWidth='100%'
          layout={{ base: 'auto', lg: 'fixed' }}
        >
          <Thead>
            {/* Linha dos meses */}
            <Tr>
              <Th width='150px' fontSize='xs' textAlign='left' px={2} borderBottom='none'>
                Aluno
              </Th>
              {Object.entries(mesesAgrupados).map(([mes, aulas], index) => (
                <Th
                  key={index}
                  colSpan={aulas.length}
                  fontSize='xs'
                  textAlign={{ base: 'left', lg: 'center' }}
                  px={1}
                  borderBottom='none'
                  textTransform='uppercase'
                >
                  {mes}
                </Th>
              ))}
            </Tr>
            {/* Linha dos dias */}
            <Tr>
              {/* Célula vazia para alinhar com a coluna 'Aluno' */}
              <Th width='150px' />
              {dataDiasDeAula.map((aula: { date: string, id: string }) => (
                <DateCellTable date={aula.date} key={aula.id} />
              ))}
            </Tr>
          </Thead>
          <AlunoTableBody data={data} dias={dataDiasDeAula} />
        </Table>
      </TableContainer>

      <Flex justifyContent='center' py={4}>
        <AlunoTableFooter turmaId={turmaId} />
      </Flex>
    </>
  )
}