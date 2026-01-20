"""
Controlador para lugares de salud
"""
from flask import request, jsonify
from ..services.google_places_service import GooglePlacesService
from ..utils.response_utils import success_response, error_response

class HealthPlaceController:
    """Controlador para manejar las operaciones de lugares de salud"""
    
    def __init__(self):
        self.places_service = GooglePlacesService()
    
    def search_places(self):
        """
        Endpoint para buscar lugares de salud
        GET /api/places/search?location=...&type=...&radius=...
        """
        try:
            # Obtener parámetros de la petición
            location = request.args.get('location', '').strip()
            place_type = request.args.get('type', 'pharmacy')
            radius = int(request.args.get('radius', 5000))
            
            # Validar parámetros
            if not location:
                return error_response('Ubicación requerida', 400)
            
            if radius > 50000:  # Límite de 50km
                return error_response('Radio máximo permitido: 50km', 400)
            
            # Geocodificar ubicación
            search_location = self.places_service.geocode_location(location)
            if not search_location:
                return error_response('Ubicación no encontrada', 404)
            
            # Buscar lugares cercanos
            places = self.places_service.search_nearby_places(
                search_location, place_type, radius
            )
            
            # Preparar respuesta
            response_data = {
                'location': {
                    'address': search_location.address,
                    'coordinates': {
                        'lat': search_location.lat,
                        'lng': search_location.lng
                    }
                },
                'places': [self._serialize_place(place) for place in places],
                'total': len(places),
                'search_params': {
                    'type': place_type,
                    'radius': radius
                }
            }
            
            return success_response(response_data)
            
        except ValueError:
            return error_response('Radio debe ser un número válido', 400)
        except Exception as e:
            return error_response(f'Error interno del servidor: {str(e)}', 500)
    
    def get_place_details(self, place_id):
        """
        Endpoint para obtener detalles de un lugar específico
        GET /api/places/<place_id>
        """
        try:
            if not place_id:
                return error_response('ID de lugar requerido', 400)
            
            # Obtener detalles del lugar
            place_details = self.places_service.get_place_details(place_id)
            if not place_details:
                return error_response('Lugar no encontrado', 404)
            
            response_data = self._serialize_detailed_place(place_details)
            return success_response(response_data)
            
        except Exception as e:
            return error_response(f'Error obteniendo detalles: {str(e)}', 500)
    
    def get_photo_url(self):
        """
        Endpoint para obtener URL de una foto
        GET /api/places/photo?reference=...&width=...
        """
        try:
            photo_reference = request.args.get('reference', '').strip()
            max_width = int(request.args.get('width', 400))
            
            if not photo_reference:
                return error_response('Referencia de foto requerida', 400)
            
            photo_url = self.places_service.get_photo_url(photo_reference, max_width)
            
            return success_response({'url': photo_url})
            
        except ValueError:
            return error_response('Ancho debe ser un número válido', 400)
        except Exception as e:
            return error_response(f'Error obteniendo foto: {str(e)}', 500)
    
    def get_health_types(self):
        """
        Endpoint para obtener tipos de lugares de salud disponibles
        GET /api/places/types
        """
        try:
            health_types = self.places_service.health_place_types
            return success_response({'types': health_types})
        except Exception as e:
            return error_response(f'Error obteniendo tipos: {str(e)}', 500)
    
    def _serialize_place(self, place):
        """Serializar un lugar básico para la respuesta JSON"""
        return {
            'place_id': place.place_id,
            'name': place.name,
            'address': place.address,
            'coordinates': {
                'lat': place.lat,
                'lng': place.lng
            },
            'rating': place.rating,
            'user_ratings_total': place.user_ratings_total,
            'price_level': place.price_level,
            'types': place.types,
            'open_now': place.open_now,
            'photo_reference': place.photo_reference
        }
    
    def _serialize_detailed_place(self, place):
        """Serializar un lugar detallado para la respuesta JSON"""
        return {
            'place_id': place.place_id,
            'name': place.name,
            'address': place.address,
            'coordinates': {
                'lat': place.lat,
                'lng': place.lng
            },
            'rating': place.rating,
            'user_ratings_total': place.user_ratings_total,
            'price_level': place.price_level,
            'types': place.types,
            'phone': place.phone,
            'website': place.website,
            'opening_hours': place.opening_hours,
            'reviews': place.reviews,
            'photos': place.photos
        }