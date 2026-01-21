import { useEffect, useRef, useState } from 'react'

// Cargar Google Maps API
const loadGoogleMaps = () => {
  return new Promise((resolve) => {
    if (window.google) {
      resolve(window.google)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google)
    document.head.appendChild(script)
  })
}

const MapContainer = ({ center, places, userLocation }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar Google Maps cuando el componente se monte
  useEffect(() => {
    loadGoogleMaps().then(() => {
      setIsLoaded(true)
    })
  }, [])

  // Inicializar mapa
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 13,
        styles: [
          {
            featureType: 'poi.medical',
            stylers: [{ visibility: 'simplified' }]
          }
        ]
      })
      setMap(newMap)
    }
  }, [isLoaded, center])

  // Actualizar centro del mapa
  useEffect(() => {
    if (map && center) {
      map.setCenter(center)
    }
  }, [map, center])

  // Actualizar marcadores
  useEffect(() => {
    if (!map) return

    // Limpiar marcadores anteriores
    markers.forEach(marker => marker.setMap(null))
    const newMarkers = []

    // Marcador de ubicación del usuario
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Tu ubicación',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="8" fill="#4285f4" stroke="white" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      })
      newMarkers.push(userMarker)
    }

    // Marcadores de lugares de salud
    places.forEach((place, index) => {
      if (!place.geometry?.location) return

      const marker = new window.google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
        icon: {
          url: getHealthIcon(place.types),
          scaledSize: new window.google.maps.Size(40, 40)
        }
      })

      // InfoWindow con información del lugar
      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(place)
      })

      marker.addListener('click', () => {
        // Cerrar otras ventanas de información
        newMarkers.forEach(m => {
          if (m.infoWindow) m.infoWindow.close()
        })
        
        infoWindow.open(map, marker)
        marker.infoWindow = infoWindow
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Ajustar vista para mostrar todos los marcadores
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()))
      map.fitBounds(bounds)
    }
  }, [map, places, userLocation])

  const getHealthIcon = (types) => {
    // Determinar el icono basado en el tipo de lugar
    if (types.includes('pharmacy')) {
      return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    } else if (types.includes('hospital')) {
      return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    } else if (types.includes('doctor') || types.includes('clinic')) {
      return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    } else if (types.includes('dentist')) {
      return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    } else {
      return 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png'
    }
  }

  const createInfoWindowContent = (place) => {
    const rating = place.rating ? `⭐ ${place.rating}` : 'Sin calificaciones'
    const openNow = place.open_now !== null 
      ? (place.open_now ? '🟢 Abierto' : '🔴 Cerrado') 
      : 'Horario no disponible'

    return `
      <div class="p-3 max-w-sm">
        <h3 class="font-semibold text-lg text-gray-800">${place.name}</h3>
        <p class="text-gray-600 text-sm mb-2">${place.address}</p>
        <div class="space-y-1 text-sm">
          <div>📍 ${rating}</div>
          <div>🕒 ${openNow}</div>
          ${place.price_level ? `<div>💰 Nivel de precios: ${'$'.repeat(place.price_level)}</div>` : ''}
        </div>
        <button 
          onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}')"
          class="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Cómo llegar
        </button>
      </div>
    `
  }

  if (!isLoaded) {
    return (
      <div className="map-container">
        <div className="map-content loading-container">
          <div className="loading-spinner">
            <div className="spinner-circle"></div>
            <p className="empty-description">Cargando mapa...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="map-container">
      <div className="map-content" ref={mapRef}></div>
    </div>
  )
}

export default MapContainer