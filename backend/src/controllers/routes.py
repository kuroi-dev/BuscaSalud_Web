"""
Rutas de la API para lugares de salud
"""
from flask import Blueprint
from ..controllers.health_place_controller import HealthPlaceController

# Crear blueprint
health_places_bp = Blueprint('health_places', __name__, url_prefix='/api/places')

# Instanciar controlador
controller = HealthPlaceController()

# Definir rutas
@health_places_bp.route('/search', methods=['GET'])
def search_places():
    """Buscar lugares de salud"""
    return controller.search_places()

@health_places_bp.route('/<place_id>', methods=['GET'])
def get_place_details(place_id):
    """Obtener detalles de un lugar específico"""
    return controller.get_place_details(place_id)

@health_places_bp.route('/photo', methods=['GET'])
def get_photo_url():
    """Obtener URL de una foto"""
    return controller.get_photo_url()

@health_places_bp.route('/types', methods=['GET'])
def get_health_types():
    """Obtener tipos de lugares de salud disponibles"""
    return controller.get_health_types()