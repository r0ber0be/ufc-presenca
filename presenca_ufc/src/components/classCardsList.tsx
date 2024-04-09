import ClassCard from "./classCard";

const turmas = [
  { name: 'Fundamentos da programação',  days: 'Segunda-Feira', hour: '13:30 - 15:30', id: 1 },
  { name: 'Matemática Básica',           days: 'Quarta-Feira',  hour: '13:30 - 15:30', id: 2 },
  { name: 'Arquitetura de Computadores', days: 'Quinta-Feira',  hour: '10:00 - 12:00', id: 3 }
]

export default function ClassList() {
  return (
    <>
      { turmas.map((turma) => (
        <ClassCard turma={turma} key={turma.id}/>
      ))}
    </>
  )
}