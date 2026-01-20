"""
BuscaSalud Backend - Flask API con patrón MVC
"""
from flask import Flask
from flask_cors import CORS
from src.controllers.health_controller import health_bp
from src.config import Config
import logging
import os

def create_app():
    """Factory para crear la aplicación Flask"""
    app = Flask(__name__)
    
    # Configuración
    app.config.from_object(Config)
    
    # CORS - permitir requests desde el frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Configurar logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Registrar blueprints
    app.register_blueprint(health_bp)
    
    @app.route('/')
    def index():
        return {
            'message': 'BuscaSalud API está funcionando! 🏥',
            'version': '1.0.0',
            'endpoints': {
                'search': '/api/search?location=bogota&type=pharmacy&radius=5000',
                'place_details': '/api/place/{place_id}',
                'health_check': '/api/health'
            }
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"🚀 Iniciando BuscaSalud Backend en puerto {port}")
    print(f"📍 Frontend URL: http://localhost:5173")
    print(f"🔧 Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)