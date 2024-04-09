import ClassCard from "./classCard";

const turmasMock = [
  { id: 1, name: 'Fundamentos da programação',  days: 'SEG, TER', hour: '13:30 - 15:30', extraHour: null },
  { id: 2, name: 'Matemática Básica',           days: 'QUA',      hour: '13:30 - 15:30', extraHour: null },
  { id: 3, name: 'Arquitetura de Computadores', days: 'QUI, SEX', hour: '10:00 - 12:00', extraHour: '08:00 - 10:00' }
]

export default function ClassList() {
  return (
    <>
      { turmasMock.map((turma) => (
        <ClassCard turma={ turma } key={ turma.id } />
      ))}
    </>
  )
}