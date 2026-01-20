# 🏥 BuscaSalud - Aplicación Web de Lugares de Salud

BuscaSalud es una aplicación web que permite encontrar fácilmente lugares de salud (farmacias, hospitales, clínicas, consultorios médicos, etc.) cerca de cualquier ubicación utilizando la API de Google Maps Places.

## 🚀 Características

- **Búsqueda por ubicación**: Encuentra lugares de salud cerca de cualquier dirección
- **Múltiples tipos de lugares**: Farmacias, hospitales, clínicas, dentistas, fisioterapeutas y veterinarias
- **Mapa interactivo**: Visualiza los resultados en Google Maps con marcadores personalizados
- **Información detallada**: Horarios, teléfonos, calificaciones, y enlaces para navegación
- **Interfaz responsive**: Funciona perfecto en móviles y escritorio
- **Arquitectura separada**: Backend Flask con API REST y frontend React

## 🏗️ Arquitectura del Proyecto

```
buscaSalud/
├── backend/                 # API Flask con patrón MVC
│   ├── src/
│   │   ├── controllers/    # Controladores de la API
│   │   ├── services/       # Lógica de negocio
│   │   ├── models/         # Modelos de datos
│   │   └── utils/          # Utilidades y validadores
│   ├── requirements.txt
│   └── app.py
├── frontend/               # Aplicación React con Vite
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── utils/          # Utilidades del frontend
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Python 3.8+
- Node.js 16+
- Clave API de Google Maps con las siguientes APIs habilitadas:
  - Maps JavaScript API
  - Places API
  - Geocoding API

### 1. Obtener API Key de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las APIs necesarias:
   - Maps JavaScript API
   - Places API 
   - Geocoding API
4. Crea credenciales (API Key)
5. (Opcional) Restringe la clave por dominio/IP para mayor seguridad

### 2. Configurar Backend

```bash
# Navegar a la carpeta del proyecto
cd buscaSalud

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\\Scripts\\activate
# En macOS/Linux:
source venv/bin/activate

# Navegar al backend
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env (copia desde .env.example)
cp .env.example .env

# Editar .env y añadir tu API key:
# GOOGLE_MAPS_API_KEY=tu-google-maps-api-key-aqui
# SECRET_KEY=tu-clave-secreta-super-segura
# FLASK_ENV=development
```

### 3. Configurar Frontend

```bash
# En una nueva terminal, navegar al frontend
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env (copia desde .env.example)
cp .env.example .env

# Editar .env y añadir tu API key:
# VITE_GOOGLE_MAPS_API_KEY=tu-google-maps-api-key-aqui
# VITE_API_BASE_URL=http://localhost:5000
```

## 🚀 Ejecutar la Aplicación

### Ejecutar Backend (Terminal 1)

```bash
# Activar entorno virtual si no está activo
cd backend
python app.py
```

El backend estará disponible en: http://localhost:5000

### Ejecutar Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## 📚 Uso de la Aplicación

1. **Buscar ubicación**: Introduce una dirección, ciudad o usa tu ubicación actual
2. **Seleccionar tipo**: Elige el tipo de lugar de salud (farmacia, hospital, etc.)
3. **Ajustar radio**: Define el radio de búsqueda (1-50 km)
4. **Ver resultados**: Los resultados aparecen en la lista y en el mapa
5. **Obtener direcciones**: Haz clic en "Ir" para abrir navegación en Google Maps

## 🔧 API Endpoints

### Buscar lugares de salud
```
GET /api/search?location={ubicacion}&type={tipo}&radius={radio}
```

### Obtener detalles de un lugar
```
GET /api/place/{place_id}
```

### Verificar salud de la API
```
GET /api/health
```

## 🎨 Componentes Frontend

- **App.jsx**: Componente principal con estado global
- **Header.jsx**: Barra de navegación
- **SearchForm.jsx**: Formulario de búsqueda con filtros
- **MapContainer.jsx**: Integración con Google Maps
- **ResultsList.jsx**: Lista de resultados con información detallada
- **LoadingSpinner.jsx**: Indicador de carga

## 🔒 Seguridad

- Las claves API se gestionan mediante variables de entorno
- CORS configurado para permitir solo orígenes autorizados
- Validación de parámetros en el backend
- Manejo seguro de errores sin exposer información sensible

## 🛠️ Tecnologías Utilizadas

### Backend
- **Flask**: Framework web de Python
- **googlemaps**: Cliente oficial de Google Maps para Python
- **python-dotenv**: Gestión de variables de entorno
- **flask-cors**: Manejo de CORS

### Frontend
- **React**: Biblioteca de JavaScript para interfaces de usuario
- **Vite**: Build tool y servidor de desarrollo
- **Tailwind CSS**: Framework de CSS utilitario
- **Heroicons**: Iconos SVG para React

## 🤝 Contribuir

1. Fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Desarrollado por

David - 2026

---

¿Necesitas ayuda? Abre un issue en el repositorio o contacta al desarrollador.