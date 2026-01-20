"""
Servicio para interactuar con Google Maps Places API
"""
import googlemaps
import os
import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class GoogleMapsService:
    """Servicio para manejar operaciones con Google Maps API"""
    
    def __init__(self):
        """Inicializar el cliente de Google Maps"""
        api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_MAPS_API_KEY no encontrada en variables de entorno")
        
        self.client = googlemaps.Client(key=api_key)
        
        # Tipos de lugares de salud soportados
        self.health_types = {
            'pharmacy': 'pharmacy',
            'hospital': 'hospital', 
            'clinic': 'clinic',
            'doctor': 'doctor',
            'dentist': 'dentist',
            'physiotherapist': 'physiotherapist',
            'veterinary_care': 'veterinary_care'
        }
    
    def search_health_places(self, location: str, place_type: str, radius: int) -> Dict[str, Any]:
        """
        Buscar lugares de salud cerca de una ubicación
        
        Args:
            location: Dirección o coordenadas para buscar
            place_type: Tipo de lugar de salud
            radius: Radio de búsqueda en metros
            
        Returns:
            Dict con lugares encontrados y información de ubicación
        """
        try:
            # Geocodificar la ubicación
            geocode_result = self.client.geocode(location)
            if not geocode_result:
                return {'error': 'Ubicación no encontrada'}
                
            location_coords = geocode_result[0]['geometry']['location']
            
            # Buscar lugares cercanos
            places_result = self.client.places_nearby(
                location=location_coords,
                radius=radius,
                type=place_type
            )
            
            # Procesar los resultados
            places = []
            for place in places_result.get('results', []):
                processed_place = self._process_place_data(place)
                places.append(processed_place)
            
            return {
                'location': {
                    'address': geocode_result[0]['formatted_address'],
                    'coords': location_coords
                },
                'places': places,
                'total': len(places),
                'search_params': {
                    'type': place_type,
                    'radius': radius
                }
            }
            
        except googlemaps.exceptions.ApiError as e:
            logger.error(f"Error de Google Maps API: {str(e)}")
            return {'error': f'Error en la API de Google Maps: {str(e)}'}
        except Exception as e:
            logger.error(f"Error en búsqueda: {str(e)}")
            return {'error': 'Error interno en la búsqueda'}
    
    def get_place_details(self, place_id: str) -> Dict[str, Any]:
        """
        Obtener detalles completos de un lugar específico
        
        Args:
            place_id: ID del lugar en Google Places
            
        Returns:
            Dict con detalles completos del lugar
        """
        try:
            # Campos a solicitar
            fields = [
                'name', 'formatted_address', 'formatted_phone_number',
                'opening_hours', 'website', 'rating', 'reviews', 
                'geometry', 'photos', 'types', 'price_level',
                'place_id'
            ]
            
            place_detail = self.client.place(place_id=place_id, fields=fields)
            
            if not place_detail.get('result'):
                return {'error': 'Lugar no encontrado'}
            
            processed_place = self._process_detailed_place_data(place_detail['result'])
            return processed_place
            
        except googlemaps.exceptions.ApiError as e:
            logger.error(f"Error obteniendo detalles: {str(e)}")
            return {'error': f'Error en la API de Google Maps: {str(e)}'}
        except Exception as e:
            logger.error(f"Error obteniendo detalles: {str(e)}")
            return {'error': 'Error interno obteniendo detalles'}
    
    def get_photo_url(self, photo_reference: str, max_width: int = 400) -> Dict[str, str]:
        """
        Generar URL para una foto de Google Places
        
        Args:
            photo_reference: Referencia de la foto
            max_width: Ancho máximo de la imagen
            
        Returns:
            Dict con la URL de la foto
        """
        api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
        url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth={max_width}&photoreference={photo_reference}&key={api_key}"
        return {'url': url}
    
    def _process_place_data(self, place: Dict[str, Any]) -> Dict[str, Any]:
        """Procesar datos básicos de un lugar"""
        return {
            'place_id': place.get('place_id', ''),
            'name': place.get('name', 'Sin nombre'),
            'address': place.get('vicinity', 'Dirección no disponible'),
            'rating': place.get('rating', 0),
            'user_ratings_total': place.get('user_ratings_total', 0),
            'price_level': place.get('price_level', 0),
            'types': place.get('types', []),
            'geometry': place.get('geometry', {}),
            'open_now': place.get('opening_hours', {}).get('open_now', None),
            'photo_reference': place.get('photos', [{}])[0].get('photo_reference', '') if place.get('photos') else ''
        }
    
    def _process_detailed_place_data(self, place: Dict[str, Any]) -> Dict[str, Any]:
        """Procesar datos detallados de un lugar"""
        opening_hours_text = []
        if 'opening_hours' in place and 'weekday_text' in place['opening_hours']:
            opening_hours_text = place['opening_hours']['weekday_text']
        
        return {
            'place_id': place.get('place_id', ''),
            'name': place.get('name', 'Sin nombre'),
            'address': place.get('formatted_address', 'Dirección no disponible'),
            'phone': place.get('formatted_phone_number', 'No disponible'),
            'website': place.get('website', ''),
            'rating': place.get('rating', 0),
            'user_ratings_total': place.get('user_ratings_total', 0),
            'price_level': place.get('price_level', 0),
            'types': place.get('types', []),
            'geometry': place.get('geometry', {}),
            'opening_hours': {
                'open_now': place.get('opening_hours', {}).get('open_now', None),
                'weekday_text': opening_hours_text
            },
            'reviews': place.get('reviews', [])[:3],  # Solo las primeras 3 reseñas
            'photos': [photo.get('photo_reference', '') for photo in place.get('photos', [])][:5]
        }