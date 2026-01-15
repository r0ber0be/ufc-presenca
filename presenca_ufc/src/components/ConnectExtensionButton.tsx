"use client";

export default function ConnectExtensionButton() {
  function handleConnect() {
    console.log('a')
    window.postMessage({ 
      source: "ufc-presenca", 
      type: "REQUEST_CONNECTION" 
    }, "*");
  }

  return (
    <button 
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Conectar ao SIGAA
    </button>
  );
}
