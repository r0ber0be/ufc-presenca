import type { TeacherPayload } from "types/teacher"

type TeacherSection = {
  professor: TeacherPayload,
  isConnected: boolean,
  isLoading: boolean
}

export default function TeacherSection({ professor, isConnected, isLoading }: Readonly<TeacherSection>) {
  return (
    <>
      { isConnected && !isLoading && professor && (
        <div className="plasmo-flex plasmo-items-center plasmo-gap-3 plasmo-pb-4 plasmo-border-b plasmo-border-gray-700">
          <img
            src={professor.picture}
            alt={professor.name}
            className="plasmo-w-10 plasmo-h-10 plasmo-rounded-full plasmo-bg-gray-600 plasmo-flex-shrink-0"
          />
          <div className="plasmo-flex plasmo-flex-col">
            <span className="plasmo-text-base plasmo-font-medium plasmo-truncate">
              {professor.name}
            </span>
            <span
              className={`plasmo-text-xs ${
                professor.isSynced
                  ? "plasmo-text-green-400"
                  : "plasmo-text-yellow-400"
              }`}>
              { professor.isSynced
                ? "Sincronizado ao SIGAA"
                : "Não sincronizado ao SIGAA"}
            </span>
          </div>
        </div>
      )}
    </>
  )
}