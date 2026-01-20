import { useState } from 'react'
import Header from './components/Header'
import SearchForm from './components/SearchForm'
import MapContainer from './components/MapContainer'
import ResultsList from './components/ResultsList'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

function App() {
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedType, setSelectedType] = useState('pharmacy')
  const [searchRadius, setSearchRadius] = useState(5000)
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 4.7110, lng: -74.0721 }) // Bogotá por defecto

  const handleSearch = async (location, type, radius) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/search?location=${encodeURIComponent(location)}&type=${type}&radius=${radius}`)
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setSearchResults(data.places || [])
      
      if (data.location && data.location.coords) {
        setMapCenter(data.location.coords)
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error)
      alert('Error al realizar la búsqueda. Por favor, intente nuevamente.')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setMapCenter(location)
          setSearchLocation(`${location.lat}, ${location.lng}`)
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error)
          alert('No se pudo obtener su ubicación actual.')
        }
      )
    } else {
      alert('La geolocalización no está soportada en este navegador.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de búsqueda */}
          <div className="lg:col-span-1">
            <SearchForm
              searchLocation={searchLocation}
              setSearchLocation={setSearchLocation}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchRadius={searchRadius}
              setSearchRadius={setSearchRadius}
              onSearch={handleSearch}
              onGetCurrentLocation={getCurrentLocation}
              isLoading={isLoading}
            />
            
            {/* Lista de resultados */}
            <div className="mt-6">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <ResultsList results={searchResults} />
              )}
            </div>
          </div>
          
          {/* Mapa */}
          <div className="lg:col-span-2">
            <MapContainer
              center={mapCenter}
              places={searchResults}
              userLocation={userLocation}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
