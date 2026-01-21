import React, { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const FHIRAvailability = ({ placeId, placeName }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (placeId) {
      fetchAvailability();
    }
  }, [placeId]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fhir/availability/${placeId}`);
      const result = await response.json();
      
      if (result.success) {
        setAvailability(result.data);
      } else {
        setError('Error al obtener disponibilidad');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching FHIR availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'busy': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'busy': return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatWaitTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="fhir-availability">
        <div className="availability-header">
          <h4>📊 Disponibilidad FHIR</h4>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Consultando disponibilidad...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fhir-availability">
        <div className="availability-header">
          <h4>📊 Disponibilidad FHIR</h4>
        </div>
        <div className="error-state">
          <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!availability) return null;

  return (
    <div className="fhir-availability">
      <div className="availability-header">
        <h4>📊 Disponibilidad FHIR</h4>
        <span className="fhir-badge">FHIR 4.0.1</span>
      </div>
      
      <div className="availability-content">
        <div className="status-row">
          <div className="status-item">
            {getStatusIcon(availability.status)}
            <span className={getStatusColor(availability.status)}>
              {availability.status === 'available' ? 'Disponible' : 'Ocupado'}
            </span>
          </div>
        </div>

        <div className="wait-times">
          <h5>⏱️ Tiempos de Espera</h5>
          <div className="wait-grid">
            <div className="wait-item">
              <span className="wait-label">Urgencias:</span>
              <span className="wait-time">{formatWaitTime(availability.wait_times.emergency)}</span>
            </div>
            <div className="wait-item">
              <span className="wait-label">Consulta:</span>
              <span className="wait-time">{formatWaitTime(availability.wait_times.consultation)}</span>
            </div>
            <div className="wait-item">
              <span className="wait-label">Especialista:</span>
              <span className="wait-time">{formatWaitTime(availability.wait_times.specialist)}</span>
            </div>
          </div>
        </div>

        {availability.next_appointment && (
          <div className="next-appointment">
            <ClockIcon className="w-4 h-4" />
            <span>
              Próxima cita: {new Date(availability.next_appointment).toLocaleDateString('es-CL')}
            </span>
          </div>
        )}

        {availability.fhir_data?.availabilityExceptions && (
          <div className="availability-note">
            <span>ℹ️ {availability.fhir_data.availabilityExceptions}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FHIRAvailability;