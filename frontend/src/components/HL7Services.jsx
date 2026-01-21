import React, { useState, useEffect } from 'react';
import { HeartIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const HL7Services = ({ placeType }) => {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (placeType) {
      fetchServices();
    }
  }, [placeType]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hl7/services/${placeType}`);
      const result = await response.json();
      
      if (result.success) {
        setServices(result.data);
      } else {
        setError('Error al obtener servicios');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching HL7 services:', err);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (available) => {
    return available 
      ? <CheckCircleIcon className="w-4 h-4 text-green-500" />
      : <XCircleIcon className="w-4 h-4 text-red-500" />;
  };

  const getServiceStatusText = (available) => {
    return available ? 'Disponible' : 'No disponible';
  };

  const getServiceStatusClass = (available) => {
    return available ? 'text-green-600' : 'text-red-600';
  };

  const getPlaceTypeTitle = (type) => {
    const titles = {
      'hospital': '🏥 Hospital',
      'pharmacy': '💊 Farmacia',
      'dentist': '🦷 Dental',
      'clinic': '🏥 Clínica',
      'veterinarian': '🐕 Veterinaria'
    };
    return titles[type] || '🏥 Centro de Salud';
  };

  if (loading) {
    return (
      <div className="hl7-services">
        <div className="services-header">
          <h4>🔗 Servicios HL7</h4>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Consultando servicios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hl7-services">
        <div className="services-header">
          <h4>🔗 Servicios HL7</h4>
        </div>
        <div className="error-state">
          <XCircleIcon className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!services?.services?.length) return null;

  return (
    <div className="hl7-services">
      <div className="services-header">
        <h4>🔗 Servicios HL7</h4>
        <span className="hl7-badge">HL7 {services.hl7_standard}</span>
      </div>
      
      <div className="services-content">
        <div className="place-type-info">
          <HeartIcon className="w-5 h-5 text-blue-500" />
          <span className="place-type-text">
            {getPlaceTypeTitle(services.place_type)}
          </span>
        </div>

        <div className="services-list">
          {services.services.map((service, index) => (
            <div key={service.code} className="service-item">
              <div className="service-info">
                <div className="service-name">
                  {service.name}
                </div>
                <div className="service-code">
                  Código: {service.code}
                </div>
              </div>
              <div className="service-status">
                {getServiceIcon(service.available)}
                <span className={getServiceStatusClass(service.available)}>
                  {getServiceStatusText(service.available)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="services-summary">
          <div className="summary-stats">
            <span className="stat-item">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              {services.services.filter(s => s.available).length} disponibles
            </span>
            <span className="stat-item">
              <XCircleIcon className="w-4 h-4 text-red-500" />
              {services.services.filter(s => !s.available).length} no disponibles
            </span>
          </div>
        </div>

        <div className="hl7-info">
          <span className="info-text">
            ℹ️ Datos obtenidos mediante estándares HL7 para interoperabilidad en salud
          </span>
        </div>
      </div>
    </div>
  );
};

export default HL7Services;