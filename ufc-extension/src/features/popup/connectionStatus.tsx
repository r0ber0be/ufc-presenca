type Connection = {
  isConnected: boolean,
  isLoading: boolean
}

export default function ConnectionStatus({ isConnected, isLoading }: Readonly<Connection>) {
  return (
    <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
      <span className="plasmo-text-base">UFC PRESENÇA:</span>
      <span
        className={`plasmo-font-semibold plasmo-text-sm ${
          isConnected
            ? "plasmo-text-green-400"
            : "plasmo-text-red-400"
        }`}>
        { isLoading
          ? "Verificando..."
          : isConnected
          ? "Conectado"
          : "Desconectado"
        }
      </span>
    </div>
  )
}