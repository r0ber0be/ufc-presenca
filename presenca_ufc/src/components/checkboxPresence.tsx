'use client'

import { ChangeEvent } from 'react'
import { CheckboxValue } from '@/types/Aluno'

export function CheckboxPresence({ isPresent, index, alunoID, checked, onCheckedChange }: CheckboxValue) {
  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault()

    if(onCheckedChange) {
      onCheckedChange(alunoID)
    }
  }

  return (
    <label htmlFor='presenca'>
      <input
        name='presenca'
        type='checkbox'
        checked={checked}
        id={index.toString()}
        onChange={(ev) => handleChange(ev)}
      />
    </label>
  )
}