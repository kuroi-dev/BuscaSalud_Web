"""
Utilidades de validación para la API
"""
import re
from typing import Tuple

def validate_search_params(location: str, place_type: str, radius: str) -> Tuple[bool, str]:
    """
    Validar parámetros de búsqueda
    
    Args:
        location: Ubicación a validar
        place_type: Tipo de lugar a validar
        radius: Radio de búsqueda a validar
        
    Returns:
        Tuple (es_valido, mensaje_error)
    """
    
    # Validar ubicación
    if not location or len(location.strip()) < 2:
        return False, "La ubicación debe tener al menos 2 caracteres"
    
    if len(location) > 200:
        return False, "La ubicación es demasiado larga (máximo 200 caracteres)"
    
    # Validar tipo de lugar
    valid_types = {
        'pharmacy', 'hospital', 'clinic', 'doctor', 
        'dentist', 'physiotherapist', 'veterinary_care'
    }
    
    if place_type not in valid_types:
        return False, f"Tipo de lugar inválido. Tipos válidos: {', '.join(valid_types)}"
    
    # Validar radio
    try:
        radius_int = int(radius)
        if radius_int < 100:
            return False, "El radio mínimo es 100 metros"
        if radius_int > 50000:
            return False, "El radio máximo es 50,000 metros (50 km)"
    except ValueError:
        return False, "El radio debe ser un número entero"
    
    return True, ""

def validate_coordinates(lat: float, lng: float) -> Tuple[bool, str]:
    """
    Validar coordenadas geográficas
    
    Args:
        lat: Latitud
        lng: Longitud
        
    Returns:
        Tuple (es_valido, mensaje_error)
    """
    if not (-90 <= lat <= 90):
        return False, "La latitud debe estar entre -90 y 90 grados"
    
    if not (-180 <= lng <= 180):
        return False, "La longitud debe estar entre -180 y 180 grados"
    
    return True, ""

def sanitize_input(text: str) -> str:
    """
    Limpiar y sanitizar texto de entrada
    
    Args:
        text: Texto a sanitizar
        
    Returns:
        Texto sanitizado
    """
    if not text:
        return ""
    
    # Remover caracteres potencialmente peligrosos
    text = re.sub(r'[<>"\';\\]', '', text)
    
    # Limpiar espacios extra
    text = ' '.join(text.split())
    
    return text.strip()

def validate_place_id(place_id: str) -> Tuple[bool, str]:
    """
    Validar ID de lugar de Google Places
    
    Args:
        place_id: ID a validar
        
    Returns:
        Tuple (es_valido, mensaje_error)
    """
    if not place_id:
        return False, "ID de lugar requerido"
    
    if len(place_id) < 10:
        return False, "ID de lugar inválido (demasiado corto)"
    
    if len(place_id) > 200:
        return False, "ID de lugar inválido (demasiado largo)"
    
    # Verificar que solo contenga caracteres alfanuméricos y algunos especiales
    if not re.match(r'^[A-Za-z0-9_-]+$', place_id):
        return False, "ID de lugar contiene caracteres inválidos"
    
    return True, ""