import { StarIcon, PhoneIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

const ResultsList = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-gray-400 mb-2">
          <MapPinIcon className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-600">No se encontraron lugares de salud</p>
        <p className="text-sm text-gray-500 mt-1">
          Intenta cambiar la ubicación o aumentar el radio de búsqueda
        </p>
      </div>
    )
  }

  const getTypeLabel = (types) => {
    const typeMap = {
      pharmacy: '💊 Farmacia',
      hospital: '🏥 Hospital', 
      clinic: '🏥 Clínica',
      doctor: '👨‍⚕️ Consultorio',
      dentist: '🦷 Dentista',
      physiotherapist: '🤸‍♀️ Fisioterapia',
      veterinary_care: '🐕 Veterinaria'
    }

    for (let type of types) {
      if (typeMap[type]) return typeMap[type]
    }
    return '🏥 Centro de salud'
  }

  const renderRating = (rating, totalRatings) => {
    if (!rating) return <span className="text-gray-500 text-sm">Sin calificaciones</span>
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            star <= Math.floor(rating) ? (
              <StarIconSolid key={star} className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon key={star} className="h-4 w-4 text-gray-300" />
            )
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)} ({totalRatings || 0})
        </span>
      </div>
    )
  }

  const handleDirections = (place) => {
    const lat = place.geometry?.location?.lat
    const lng = place.geometry?.location?.lng
    if (lat && lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`)
    }
  }

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Resultados de búsqueda ({results.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {results.map((place, index) => (
          <div key={place.place_id || index} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="space-y-3">
              {/* Header */}
              <div>
                <h4 className="font-medium text-gray-900">{place.name}</h4>
                <p className="text-sm text-blue-600">{getTypeLabel(place.types)}</p>
              </div>

              {/* Rating */}
              {renderRating(place.rating, place.user_ratings_total)}

              {/* Address */}
              <p className="text-sm text-gray-600 flex items-start space-x-1">
                <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{place.address}</span>
              </p>

              {/* Status */}
              <div className="flex items-center space-x-4 text-sm">
                {place.open_now !== null && (
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span className={place.open_now ? 'text-green-600' : 'text-red-600'}>
                      {place.open_now ? 'Abierto' : 'Cerrado'}
                    </span>
                  </div>
                )}

                {place.price_level > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Precio:</span>
                    <span className="text-green-600 font-medium">
                      {'$'.repeat(place.price_level)}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDirections(place)}
                  className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <MapPinIcon className="h-4 w-4" />
                  <span>Ir</span>
                </button>

                <button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(place.name + ' ' + place.address)}`)}
                  className="flex-1 bg-gray-100 text-gray-700 text-sm py-2 px-3 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Más info
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsList