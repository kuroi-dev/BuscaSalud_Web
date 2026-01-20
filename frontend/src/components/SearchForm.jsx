import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'

const healthTypes = {
  pharmacy: { name: 'Farmacia', icon: '💊' },
  hospital: { name: 'Hospital', icon: '🏥' },
  clinic: { name: 'Clínica', icon: '🏥' },
  doctor: { name: 'Consultorio Médico', icon: '👨‍⚕️' },
  dentist: { name: 'Dentista', icon: '🦷' },
  physiotherapist: { name: 'Fisioterapeuta', icon: '🤸‍♀️' },
  veterinary_care: { name: 'Veterinaria', icon: '🐕' }
}

const SearchForm = ({ 
  searchLocation, 
  setSearchLocation, 
  selectedType, 
  setSelectedType, 
  searchRadius, 
  setSearchRadius, 
  onSearch, 
  onGetCurrentLocation, 
  isLoading 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchLocation.trim()) {
      onSearch(searchLocation, selectedType, searchRadius)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Buscar lugares de salud
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Ingresa una dirección o ciudad"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={onGetCurrentLocation}
              className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              title="Usar ubicación actual"
            >
              <MapPinIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tipo de lugar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de lugar
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(healthTypes).map(([key, value]) => (
              <option key={key} value={key}>
                {value.icon} {value.name}
              </option>
            ))}
          </select>
        </div>

        {/* Radio de búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radio de búsqueda: {(searchRadius / 1000).toFixed(1)} km
          </label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={searchRadius}
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Botón de búsqueda */}
        <button
          type="submit"
          disabled={isLoading || !searchLocation.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Buscar</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default SearchForm