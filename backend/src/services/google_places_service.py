"""
Servicio para interactuar con Google Places API
"""
import googlemaps
from typing import List, Dict, Optional
from ..models.health_place import HealthPlace, DetailedHealthPlace, SearchLocation
from ..config.config import Config

class GooglePlacesService:
    """Servicio para manejar las operaciones con Google Places API"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or Config.GOOGLE_MAPS_API_KEY
        self.client = googlemaps.Client(key=self.api_key)
        
        # Tipos de lugares de salud disponibles
        self.health_place_types = {
            'pharmacy': 'Farmacia',
            'hospital': 'Hospital', 
            'clinic': 'Clínica',
            'doctor': 'Consultorio Médico',
            'dentist': 'Dentista',
            'physiotherapist': 'Fisioterapeuta',
            'veterinary_care': 'Veterinaria'
        }
    
    def geocode_location(self, location: str) -> Optional[SearchLocation]:
        """
        Geocodificar una ubicación
        """
        try:
            geocode_result = self.client.geocode(location)
            if not geocode_result:
                return None
                
            result = geocode_result[0]
            coords = result['geometry']['location']
            
            return SearchLocation(
                address=result['formatted_address'],
                lat=coords['lat'],
                lng=coords['lng']
            )
        except Exception as e:
            print(f"Error geocodificando ubicación: {e}")
            return None
    
    def search_nearby_places(
        self, 
        location: SearchLocation, 
        place_type: str = 'pharmacy', 
        radius: int = 5000
    ) -> List[HealthPlace]:
        """
        Buscar lugares de salud cercanos
        """
        try:
            places_result = self.client.places_nearby(
                location={'lat': location.lat, 'lng': location.lng},
                radius=radius,
                type=place_type
            )
            
            places = []
            for place_data in places_result.get('results', []):
                place = self._convert_to_health_place(place_data)
                if place:
                    places.append(place)
            
            return places
            
        except Exception as e:
            print(f"Error buscando lugares: {e}")
            return []
    
    def get_place_details(self, place_id: str) -> Optional[DetailedHealthPlace]:
        """
        Obtener detalles completos de un lugar
        """
        try:
            place_detail = self.client.place(
                place_id=place_id,
                fields=[
                    'name', 'formatted_address', 'formatted_phone_number',
                    'opening_hours', 'website', 'rating', 'reviews', 
                    'geometry', 'photos', 'types', 'price_level'
                ]
            )
            
            return self._convert_to_detailed_health_place(place_detail['result'])
            
        except Exception as e:
            print(f"Error obteniendo detalles: {e}")
            return None
    
    def get_photo_url(self, photo_reference: str, max_width: int = 400) -> str:
        """
        Obtener URL de una foto
        """
        return f"https://maps.googleapis.com/maps/api/place/photo?maxwidth={max_width}&photoreference={photo_reference}&key={self.api_key}"
    
    def _convert_to_health_place(self, place_data: Dict) -> Optional[HealthPlace]:
        """
        Convertir datos de Google Places a modelo HealthPlace
        """
        try:
            geometry = place_data.get('geometry', {})
            location = geometry.get('location', {})
            
            return HealthPlace(
                place_id=place_data.get('place_id', ''),
                name=place_data.get('name', 'Sin nombre'),
                address=place_data.get('vicinity', 'Dirección no disponible'),
                lat=location.get('lat', 0.0),
                lng=location.get('lng', 0.0),
                rating=place_data.get('rating', 0.0),
                user_ratings_total=place_data.get('user_ratings_total', 0),
                price_level=place_data.get('price_level', 0),
                types=place_data.get('types', []),
                open_now=place_data.get('opening_hours', {}).get('open_now'),
                photo_reference=place_data.get('photos', [{}])[0].get('photo_reference', '') if place_data.get('photos') else ''
            )
        except Exception as e:
            print(f"Error convirtiendo lugar: {e}")
            return None
    
    def _convert_to_detailed_health_place(self, place_data: Dict) -> Optional[DetailedHealthPlace]:
        """
        Convertir datos de Google Places a modelo DetailedHealthPlace
        """
        try:
            geometry = place_data.get('geometry', {})
            location = geometry.get('location', {})
            
            opening_hours_text = []
            if 'opening_hours' in place_data and 'weekday_text' in place_data['opening_hours']:
                opening_hours_text = place_data['opening_hours']['weekday_text']
            
            return DetailedHealthPlace(
                place_id=place_data.get('place_id', ''),
                name=place_data.get('name', 'Sin nombre'),
                address=place_data.get('formatted_address', 'Dirección no disponible'),
                lat=location.get('lat', 0.0),
                lng=location.get('lng', 0.0),
                rating=place_data.get('rating', 0.0),
                user_ratings_total=place_data.get('user_ratings_total', 0),
                price_level=place_data.get('price_level', 0),
                types=place_data.get('types', []),
                open_now=place_data.get('opening_hours', {}).get('open_now'),
                photo_reference=place_data.get('photos', [{}])[0].get('photo_reference', '') if place_data.get('photos') else '',
                phone=place_data.get('formatted_phone_number', ''),
                website=place_data.get('website', ''),
                opening_hours={
                    'open_now': place_data.get('opening_hours', {}).get('open_now'),
                    'weekday_text': opening_hours_text
                },
                reviews=place_data.get('reviews', [])[:3],  # Solo las primeras 3 reseñas
                photos=[photo.get('photo_reference', '') for photo in place_data.get('photos', [])][:5]
            )
        except Exception as e:
            print(f"Error convirtiendo lugar detallado: {e}")
            return None