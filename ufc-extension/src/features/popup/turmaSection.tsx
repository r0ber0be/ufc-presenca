import type { TeacherClass } from "types/teacher"

type TurmaSectionType = {
  classes: TeacherClass[]
  isConnected: boolean,
  isLoading: boolean
}

export default function TurmaSection({ classes, isConnected, isLoading }: Readonly<TurmaSectionType>) {
  return (
    <>
      { isConnected && !isLoading && classes.length > 0 && (
          <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
            <h2 className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-400 plasmo-uppercase">
              Minhas Turmas
            </h2>
            <div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-max-h-32 plasmo-overflow-y-auto plasmo-overflow-x-hidden plasmo-p-2 plasmo-bg-gray-900 plasmo-rounded-md">
              { classes.map((classe) => (
                <div key={classe.id} className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-2 plasmo-bg-gray-700 plasmo-rounded-md">  
                  <span className="plasmo-text-sm plasmo-truncate plasmo-min-w-0">
                    {classe.nome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
    </>
  )
}