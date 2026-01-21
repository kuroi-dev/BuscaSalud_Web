import { StarIcon, PhoneIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

const ResultsList = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-icon">
          <MapPinIcon />
        </div>
        <p className="empty-title">No se encontraron lugares de salud</p>
        <p className="empty-description">
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
    if (!rating) return <span className="rating-text">Sin calificaciones</span>
    
    return (
      <div className="rating">
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            star <= Math.floor(rating) ? (
              <StarIconSolid key={star} className="star star-filled" />
            ) : (
              <StarIcon key={star} className="star star-empty" />
            )
          ))}
        </div>
        <span className="rating-text">
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
    <div className="card">
      <div className="results-header">
        <h3 className="card-header">
          Resultados de búsqueda ({results.length})
        </h3>
      </div>
      
      <div className="results-list">
        {results.map((place, index) => (
          <div key={place.place_id || index} className="result-item">
            <div className="result-content">
              {/* Header */}
              <div className="result-header-info">
                <h4 className="result-name">{place.name}</h4>
                <p className="result-type">{getTypeLabel(place.types)}</p>
              </div>

              {/* Rating */}
              <div className="rating">
                {renderRating(place.rating, place.user_ratings_total)}
              </div>

              {/* Address */}
              <p className="result-address">
                <MapPinIcon className="icon-sm" />
                <span>{place.address}</span>
              </p>

              {/* Status */}
              <div className="result-status">
                {place.open_now !== null && (
                  <div>
                    <ClockIcon className="icon-sm" />
                    <span className={place.open_now ? 'status-open' : 'status-closed'}>
                      {place.open_now ? 'Abierto' : 'Cerrado'}
                    </span>
                  </div>
                )}

                {place.price_level > 0 && (
                  <div>
                    <span>Precio: </span>
                    <span className="status-open font-medium">
                      {'$'.repeat(place.price_level)}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="result-actions">
                <button
                  onClick={() => handleDirections(place)}
                  className="btn btn-primary btn-small"
                >
                  <MapPinIcon className="icon-sm" />
                  <span>Ir</span>
                </button>

                <button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(place.name + ' ' + place.address)}`)}
                  className="btn btn-secondary btn-small"
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