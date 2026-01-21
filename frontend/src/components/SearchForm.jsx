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
    <div className="card">
      <h2 className="card-header">
        Buscar lugares de salud
      </h2>
      
      <form onSubmit={handleSubmit} className="form">
        {/* Ubicación */}
        <div className="form-group">
          <label className="form-label">
            Ubicación
          </label>
          <div className="input-group">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Ingresa una dirección o ciudad"
              className="form-input"
              required
            />
            <button
              type="button"
              onClick={onGetCurrentLocation}
              className="btn btn-gray"
              title="Usar ubicación actual"
            >
              <MapPinIcon className="icon" />
            </button>
          </div>
        </div>

        {/* Tipo de lugar */}
        <div className="form-group">
          <label className="form-label">
            Tipo de lugar
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-select"
          >
            {Object.entries(healthTypes).map(([key, value]) => (
              <option key={key} value={key}>
                {value.icon} {value.name}
              </option>
            ))}
          </select>
        </div>

        {/* Radio de búsqueda */}
        <div className="form-group">
          <label className="form-label">
            Radio de búsqueda: {(searchRadius / 1000).toFixed(1)} km
          </label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={searchRadius}
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            className="range-slider"
          />
          <div className="range-labels">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Botón de búsqueda */}
        <button
          type="submit"
          disabled={isLoading || !searchLocation.trim()}
          className="btn btn-primary btn-full"
        >
          {isLoading ? (
            <>
              <div className="spinner-circle"></div>
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <MagnifyingGlassIcon className="icon" />
              <span>Buscar</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default SearchForm