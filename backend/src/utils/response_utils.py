"""
Utilidades para respuestas HTTP
"""
from flask import jsonify

def success_response(data=None, message="Success", status_code=200):
    """
    Crear respuesta exitosa estándar
    """
    response = {
        'success': True,
        'message': message,
        'data': data
    }
    return jsonify(response), status_code

def error_response(message="Error", status_code=400, details=None):
    """
    Crear respuesta de error estándar
    """
    response = {
        'success': False,
        'message': message,
        'data': None
    }
    if details:
        response['details'] = details
    
    return jsonify(response), status_code

def pagination_response(data, page, per_page, total_items, message="Success"):
    """
    Crear respuesta paginada
    """
    total_pages = (total_items + per_page - 1) // per_page
    
    response = {
        'success': True,
        'message': message,
        'data': data,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total_items': total_items,
            'total_pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }
    return jsonify(response), 200