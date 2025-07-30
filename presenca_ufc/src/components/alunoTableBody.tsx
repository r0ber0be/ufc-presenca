'use client'

import { Tbody, Td, Tr } from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { getCheckedState, updatePresencaChanges, addChangeListener } from '@/services/presenca/presencaService'

type Aluno = {
  name: string;
  id: string;
  presences: boolean[];
};

type AlunoData = {  
  data: Aluno[],
  dias: []
}

export function AlunoTableBody(props: AlunoData) {
  const { data, dias } = props
  console.log(data)
  const [initialPresences, setInitialPresences] = useState<{ [key: string]: boolean[] }>({});
  // Estado para forçar renderização quando os checkboxes mudarem
  const [, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const initialData: { [key: string]: boolean[] } = {};
    data.forEach(aluno => {
      initialData[aluno.id] = [...aluno.presences];
    });
    setInitialPresences(initialData);
  }, [data]);

  // Registrar um listener para atualizações
  useEffect(() => {
    const removeListener = addChangeListener(() => {
      // Forçar re-renderização quando houver mudanças
      setUpdateTrigger(prev => prev + 1);
    });
    
    return removeListener;
  }, []);

  const handleChange = (ev: ChangeEvent<HTMLInputElement>, alunoId: string, index: number) => {
    const isChecked = ev.target.checked;
    const { date: lessonDate, id: lessonId } = dias[index];

    console.log('here friends', dias[index], lessonId)
    
    // Usa o serviço para gerenciar as alterações
    updatePresencaChanges(alunoId, lessonDate, lessonId, isChecked, initialPresences[alunoId][index]);
  };

  return (
    <Tbody>
      { data.map((aluno: { name: string, id: string, presences: Array<boolean> }, index: number) => {
        return (
          <Tr key={index}>
            <Td width='150px' fontSize='small' textAlign='left' px={2} overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>
              { aluno.name }
            </Td>
            { aluno.presences.map((presenca: boolean, idx: number) => {
              const { date } = dias[idx];
              // Certifique-se de obter o estado atual do checkbox do service
              const isChecked = getCheckedState(aluno.id, date, presenca);
              
              return <Td key={idx} textAlign='center' px={1} py={1}>
                <label htmlFor={`presenca-${aluno.id}-${idx}`}>
                  <input
                    name='presenca'
                    type='checkbox'
                    aria-label='Marcar presença'
                    checked={isChecked}
                    id={`presenca-${aluno.id}-${idx}`}
                    onChange={(ev) => handleChange(ev, aluno.id, idx)}
                    style={{ cursor: 'pointer', margin: 0 }}
                  />
                </label>
              </Td>
            })}
          </Tr>
          )
        })
      }
    </Tbody>
  )
}