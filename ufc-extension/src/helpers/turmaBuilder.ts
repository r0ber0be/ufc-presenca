import type { SemestreInfo, TurmaData } from "types/turma"

export function turmaBuilder(rows: NodeListOf<Element>) {
  const turmas: TurmaData[] = []
  for (let i = 0; i < rows.length; i += 2) {
    const descricaoRow = rows[i]
    const infoRow = rows[i + 1]

    const codigoNome = descricaoRow.querySelector("td.descricao").innerText.split("-")
    const codigo = codigoNome[0].trim()
    const nome = codigoNome[1].trim()

    const infoCells = infoRow.querySelectorAll("td.info")
    const semestreLocal = infoCells[0].innerText.split("-")
    const local = semestreLocal[1].split(":")[1].trim()

    const horarioAulaFimDoSemestre = infoCells[2].innerText.split("\n")
    const primeiroDia = horarioAulaFimDoSemestre[0].split(" ")
    const dia: string = primeiroDia[0].trim()
    const horario: string = primeiroDia[1].trim()
    let segundoDia = ""
    let semestre: SemestreInfo

    const cronograma = [
      {
        dia,
        horario
      }
    ]

    if (horarioAulaFimDoSemestre[1].startsWith("(")) {
      semestre = {
        atual: semestreLocal[0].split(" ")[0].trim(),
        inicio: horarioAulaFimDoSemestre[1].split("-")[0].replace("(", "").trim(),
        fim: horarioAulaFimDoSemestre[1].split("-")[1].replace(")", "").trim()
      }
    } else {
      segundoDia = horarioAulaFimDoSemestre[1].split(" ")
      const dia = segundoDia[0].trim()
      const horario = segundoDia[1].trim()
      cronograma.push({ dia, horario })

      semestre = { 
        atual: semestreLocal[0].split(" ")[0].trim(),
        inicio: horarioAulaFimDoSemestre[2].split("-")[0].replace("(", "").trim(),
        fim: horarioAulaFimDoSemestre[2].split("-")[1].replace(")", "").trim()
      }
    }

    const quantidadeCapacidade = infoCells[3].innerText.split("/")
    const quantidadeDeAlunos = quantidadeCapacidade[0].trim()
    const capacidadeDeAlunos = quantidadeCapacidade[1].trim()

    turmas.push({
      codigo,
      nome,
      semestre,
      local,
      cronograma,
      quantidadeDeAlunos,
      capacidadeDeAlunos
    })
  }
  return turmas
}