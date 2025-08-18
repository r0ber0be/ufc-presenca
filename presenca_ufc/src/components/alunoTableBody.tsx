'use client'

import { Tbody, Td, Tr } from '@chakra-ui/react'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { getCheckedState, updatePresencaChanges, addChangeListener } from '@/services/presenca/presencaService'

type Aluno = {
  name: string
  id: string
  presences: { [lessonId: string]: boolean }
};

type Aula = {
  id: string
  date: string
};

type AlunoData = {  
  data: Aluno[],
  dias: Aula[]
}

export function AlunoTableBody(props: AlunoData) {
  const { data, dias } = props
  
  const [, setUpdateTrigger] = useState(0)

  const initialPresences = useMemo(() => {
    const map: { [alunoId: string]: { [lessonId: string]: boolean } } = {}
    data.forEach(aluno => {
      map[aluno.id] = { ...aluno.presences }
    });
    return map
  }, [data])

  useEffect(() => {
    const removeListener = addChangeListener(() => {
      setUpdateTrigger(prev => prev + 1)
    })
    return removeListener;
  }, [])

  const handleChange = (
    ev: ChangeEvent<HTMLInputElement>,
    alunoId: string,
    lessonId: string,
    lessonDate: string
  ) => {
    const isChecked = ev.target.checked;
    const previous = initialPresences[alunoId]?.[lessonId] ?? false;

    updatePresencaChanges(alunoId, lessonDate, lessonId, isChecked, previous)
  }


  return (
    <Tbody>
      {data.map((aluno) => (
        <Tr key={aluno.id}>
          <Td width='150px' fontSize='small' textAlign='left' px={2} overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>
            {aluno.name}
          </Td>

          {dias.map(({ id: lessonId, date }) => {
            const presenca = aluno.presences[lessonId] ?? false;
            const isChecked = getCheckedState(aluno.id, date, presenca);

            return (
              <Td key={lessonId} textAlign='left' px={1} py={1}>
                <label htmlFor={`presenca-${aluno.id}-${lessonId}`}>
                  <input
                    name='presenca'
                    type='checkbox'
                    aria-label='Marcar presença'
                    checked={isChecked}
                    id={`presenca-${aluno.id}-${lessonId}`}
                    onChange={(ev) => handleChange(ev, aluno.id, lessonId, date)}
                    style={{ cursor: 'pointer', margin: 0 }}
                  />
                </label>
              </Td>
            )
          })}
        </Tr>
      ))}
    </Tbody>
  )
}
