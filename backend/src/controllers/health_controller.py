"""
Controlador para endpoints relacionados con lugares de salud
"""
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from src.services.google_maps_service import GoogleMapsService
from src.utils.validators import validate_search_params
import logging

health_bp = Blueprint('health', __name__, url_prefix='/api')
logger = logging.getLogger(__name__)

@health_bp.route('/search', methods=['GET'])
@cross_origin()
def search_health_places():
    """Buscar lugares de salud cerca de una ubicación"""
    try:
        # Obtener parámetros de la URL
        location = request.args.get('location', '').strip()
        place_type = request.args.get('type', 'pharmacy')
        radius = request.args.get('radius', '5000')
        
        logger.info(f"Búsqueda: location={location}, type={place_type}, radius={radius}")
        
        # Validar parámetros
        is_valid, error_msg = validate_search_params(location, place_type, radius)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Convertir radio a entero
        radius = int(radius)
        
        # Usar el servicio de Google Maps
        maps_service = GoogleMapsService()
        result = maps_service.search_health_places(location, place_type, radius)
        
        if 'error' in result:
            return jsonify(result), 400
            
        logger.info(f"Encontrados {len(result.get('places', []))} lugares")
        return jsonify(result)
        
    except ValueError as e:
        logger.error(f"Error de valor en búsqueda: {str(e)}")
        return jsonify({'error': 'Parámetros inválidos'}), 400
    except Exception as e:
        logger.error(f"Error inesperado en búsqueda: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@health_bp.route('/place/<place_id>', methods=['GET'])
@cross_origin()
def get_place_details(place_id):
    """Obtener detalles completos de un lugar específico"""
    try:
        if not place_id:
            return jsonify({'error': 'ID de lugar requerido'}), 400
            
        logger.info(f"Obteniendo detalles para place_id: {place_id}")
        
        maps_service = GoogleMapsService()
        result = maps_service.get_place_details(place_id)
        
        if 'error' in result:
            return jsonify(result), 400
            
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error obteniendo detalles del lugar: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@health_bp.route('/photo/<photo_reference>', methods=['GET'])
@cross_origin()
def get_place_photo(photo_reference):
    """Obtener URL de una foto de Google Places"""
    try:
        if not photo_reference:
            return jsonify({'error': 'Referencia de foto requerida'}), 400
            
        maps_service = GoogleMapsService()
        result = maps_service.get_photo_url(photo_reference)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error obteniendo foto: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@health_bp.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    """Verificación de salud de la API"""
    return jsonify({
        'status': 'healthy',
        'service': 'BuscaSalud API',
        'version': '1.0.0',
        'endpoints': {
            'search': '/api/search',
            'place_details': '/api/place/{place_id}',
            'photo': '/api/photo/{photo_reference}'
        }
    })