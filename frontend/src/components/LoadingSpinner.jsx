const LoadingSpinner = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="animate-pulse absolute inset-2 rounded-full bg-blue-100"></div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-800">Buscando lugares de salud</h3>
          <p className="text-sm text-gray-600">
            Estamos encontrando los mejores lugares cerca de ti...
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner