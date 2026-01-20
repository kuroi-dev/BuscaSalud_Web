"""
Aplicación principal Flask - BuscaSalud API
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from .config.config import config
from .controllers.routes import health_places_bp

def create_app(config_name=None):
    """
    Factory function para crear la aplicación Flask
    """
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Configurar CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Registrar blueprints
    app.register_blueprint(health_places_bp)
    
    # Rutas básicas
    @app.route('/')
    def index():
        """Endpoint raíz de la API"""
        return jsonify({
            'message': 'BuscaSalud API - Encuentra lugares de salud cerca de ti',
            'version': '1.0.0',
            'endpoints': {
                'search_places': '/api/places/search',
                'place_details': '/api/places/<place_id>',
                'photo_url': '/api/places/photo',
                'health_types': '/api/places/types'
            }
        })
    
    @app.route('/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'message': 'API funcionando correctamente'
        })
    
    # Manejadores de errores
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Endpoint no encontrado',
            'data': None
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor',
            'data': None
        }), 500
    
    return app

# Para desarrollo directo
if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)