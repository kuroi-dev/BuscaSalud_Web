# BuscaSalud Backend API

API REST desarrollada con Flask para buscar lugares de salud utilizando Google Places API.

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── config.py          # Configuraciones de la app
│   ├── controllers/
│   │   ├── health_place_controller.py  # Controlador principal
│   │   └── routes.py          # Definición de rutas
│   ├── models/
│   │   └── health_place.py    # Modelos de datos
│   ├── services/
│   │   └── google_places_service.py    # Servicio Google Places
│   ├── utils/
│   │   └── response_utils.py  # Utilidades para respuestas HTTP
│   └── app.py                 # Aplicación Flask
├── venv/                      # Entorno virtual
├── run.py                     # Punto de entrada
├── requirements.txt           # Dependencias
├── .env.example              # Variables de entorno ejemplo
└── README.md                 # Este archivo
```

## Configuración

### 1. Crear entorno virtual y activarlo

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores:
# GOOGLE_MAPS_API_KEY=tu-api-key-de-google
# SECRET_KEY=tu-clave-secreta
```

### 4. Ejecutar la aplicación

```bash
# Modo desarrollo
python run.py

# O usando Flask CLI
export FLASK_APP=src/app.py
export FLASK_ENV=development
flask run
```

## API Endpoints

### GET /
Información básica de la API

### GET /health
Health check de la API

### GET /api/places/search
Buscar lugares de salud
- **Parámetros:**
  - `location` (required): Ubicación para buscar
  - `type` (optional): Tipo de lugar (pharmacy, hospital, clinic, etc.)
  - `radius` (optional): Radio de búsqueda en metros (máx 50000)

### GET /api/places/<place_id>
Obtener detalles de un lugar específico

### GET /api/places/photo
Obtener URL de una foto
- **Parámetros:**
  - `reference` (required): Referencia de la foto
  - `width` (optional): Ancho máximo de la imagen

### GET /api/places/types
Obtener tipos de lugares de salud disponibles

## Ejemplo de Uso

```bash
# Buscar farmacias cerca de "Madrid, España"
GET /api/places/search?location=Madrid,España&type=pharmacy&radius=2000

# Obtener detalles de un lugar
GET /api/places/ChIJrTLr-GyuEmsRBfy61i59si0

# Obtener tipos disponibles
GET /api/places/types
```

## Respuesta Estándar

```json
{
  "success": true,
  "message": "Success",
  "data": { /* datos de respuesta */ }
}
```

## Desarrollo

La aplicación sigue el patrón MVC:
- **Models**: Definición de estructuras de datos
- **Views**: No aplicable (API REST)
- **Controllers**: Lógica de negocio y manejo de peticiones
- **Services**: Integración con servicios externos (Google Places)
- **Utils**: Utilidades compartidas