import { Storage } from "@plasmohq/storage"

type FillData = {
  pageMode: string,
  currentClassCode: string,
  isUpdatingCache: boolean,
}

export default function FillPercentages({ pageMode, currentClassCode, isUpdatingCache }: Readonly<FillData>) {
  const handleFillPercentages = async () => {
    if (!currentClassCode) {
      alert("Não foi possível identificar o código da disciplina nesta página.")
      return
    }

    try {
      const storage = new Storage()
      // Recupera as turmas atualizadas pelo triggerSilentUpdate
      const cachedClasses = await storage.get<any[]>("classes")
      
      if (!cachedClasses) {
        alert("Nenhuma turma encontrada. Tente sincronizar no Portal primeiro.")
        return
      }

      // Busca a turma pelo código
      const targetClass = cachedClasses.find(c => c.code === currentClassCode || c.codigo === currentClassCode)

      if (!targetClass) {
        alert(`A turma ${currentClassCode} não foi encontrada nos seus dados salvos.`)
        return
      }

      const tabelaAlunos = document.querySelector("#notas-turma > tbody")
      if (!tabelaAlunos) {
        alert("Tabela de alunos não encontrada.")
        return
      }

      const linhasAlunos = tabelaAlunos.querySelectorAll("tr")
      let filled = 0

      // Trocar forEach por for of
      filled = fillCorrespondingStudents(linhasAlunos, targetClass, filled)

      if (filled > 0) {
        alert(`Sucesso! ${filled} campos preenchidos com os dados mais recentes.`)
      } else {
        alert("Nenhum aluno correspondente encontrado.")
      }

    } catch (error) {
      alert("Erro ao preencher: " + error.message)
    }
  }

  const fillCorrespondingStudents = (linhasAlunos: NodeListOf<HTMLTableRowElement>, targetClass: any, filled: number) => {
    for(const row of linhasAlunos) {
      const lineText = row.textContent || ""
      
      const studentsList = targetClass.alunos || []
      const correspondingStudent = studentsList.find((aluno: any) => {
          const matricula = aluno.matricula
          return lineText.includes(matricula)
      })

      if (correspondingStudent) {
        const inputs = row.querySelectorAll("input[type='text']")
        // Pega o último input habilitado da linha
        const inputTarget = inputs.length > 0 ? inputs[inputs.length - 1] as HTMLInputElement : null

        if (inputTarget && !inputTarget.disabled) {
          const percentageValue = correspondingStudent.porcentagem
          inputTarget.value = percentageValue.toString().replace(".", ",")

          inputTarget.style.border = "2px solid #22c55e"
          inputTarget.style.backgroundColor = "#dcfce7"
          filled++
        }
      }
    }
    return filled
  }

  return (
    <>
      { pageMode === "CONSOLIDACAO" && currentClassCode && (
        <button
          title="Preeencher presenças"
          type="button" 
          onClick={handleFillPercentages} 
          disabled={isUpdatingCache} // Impede clique enquanto atualiza
          className={`plasmo-z-50 plasmo-fixed plasmo-bottom-8 plasmo-right-8 plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-py-3 plasmo-px-4 plasmo-rounded-lg plasmo-font-semibold plasmo-text-white plasmo-shadow-lg transition-all
            ${isUpdatingCache ? "plasmo-bg-gray-500 plasmo-cursor-wait" : "plasmo-bg-emerald-600 hover:plasmo-bg-emerald-700"}
          `}>
          { isUpdatingCache ? (
            <>Atualizando dados...</>
          ) : (
            <>Preencher porcentagens</>
          )}
        </button>
      )}
    </>
  )
}