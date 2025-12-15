type TurnButton = {
  isLoading: boolean,
  isConnected: boolean,
  statusMessage: string,
  handleConnectToggle: () => Promise<void>
}

export default function TurnInOff({ isLoading, isConnected, statusMessage, handleConnectToggle }: Readonly<TurnButton>) {
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
      <button
        type="button"
        onClick={handleConnectToggle}
        disabled={isLoading}
        className={`plasmo-w-full plasmo-py-2 plasmo-px-4 plasmo-rounded-md plasmo-font-semibold plasmo-text-white plasmo-text-base plasmo-transition-all plasmo-duration-150 plasmo-ease-in-out plasmo-shadow-md
          ${
            isLoading
              ? "plasmo-bg-gray-500 plasmo-cursor-not-allowed"
              : isConnected
              ? "plasmo-bg-red-600 hover:plasmo-bg-red-700 focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-red-500 focus:plasmo-ring-opacity-50"
              : "plasmo-bg-blue-600 hover:plasmo-bg-blue-700 focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-blue-500 focus:plasmo-ring-opacity-50"
          }`}>
        { isLoading
          ? "Aguarde..."
          : isConnected
          ? "Desconectar"
          : "Conectar ao UFC Presença"}
      </button>
      
      { statusMessage && !isLoading && (
        <p className="plasmo-text-sm plasmo-text-center plasmo-text-gray-400">
          {statusMessage}
        </p>
      )}
    </div>
  )
}