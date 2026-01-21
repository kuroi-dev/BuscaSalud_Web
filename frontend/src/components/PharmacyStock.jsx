import React, { useState, useEffect } from 'react';
import { BuildingStorefrontIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PharmacyStock = ({ placeId }) => {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (placeId) {
      fetchStock();
    }
  }, [placeId]);

  const fetchStock = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fhir/pharmacy/${placeId}/stock`);
      const result = await response.json();
      
      if (result.success) {
        setStock(result.data);
      } else {
        setError('Error al obtener stock');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching pharmacy stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (medication) => {
    if (medication.status === 'inactive') return 'unavailable';
    if (medication.amount.value === 0) return 'out-of-stock';
    if (medication.amount.value < 50) return 'low-stock';
    return 'in-stock';
  };

  const getStockColor = (status) => {
    switch (status) {
      case 'in-stock': return 'text-green-600';
      case 'low-stock': return 'text-yellow-600';
      case 'out-of-stock': return 'text-red-600';
      case 'unavailable': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  const getStockIcon = (status) => {
    switch (status) {
      case 'in-stock': return <CheckIcon className="w-4 h-4 text-green-500" />;
      case 'low-stock': return <BuildingStorefrontIcon className="w-4 h-4 text-yellow-500" />;
      case 'out-of-stock': 
      case 'unavailable': return <XMarkIcon className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStockText = (status, amount) => {
    switch (status) {
      case 'in-stock': return `${amount} unidades`;
      case 'low-stock': return `${amount} unidades (Pocas)`;
      case 'out-of-stock': return 'Sin stock';
      case 'unavailable': return 'No disponible';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="pharmacy-stock">
        <div className="stock-header">
          <h4>💊 Stock FHIR</h4>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Consultando inventario...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pharmacy-stock">
        <div className="stock-header">
          <h4>💊 Stock FHIR</h4>
        </div>
        <div className="error-state">
          <XMarkIcon className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!stock?.medications?.length) return null;

  return (
    <div className="pharmacy-stock">
      <div className="stock-header">
        <h4>💊 Stock FHIR</h4>
        <span className="fhir-badge">FHIR {stock.fhir_version}</span>
      </div>
      
      <div className="stock-content">
        <div className="medications-list">
          {stock.medications.map((medication) => {
            const stockStatus = getStockStatus(medication);
            return (
              <div key={medication.id} className="medication-item">
                <div className="medication-info">
                  <div className="medication-name">
                    {medication.code.text}
                  </div>
                  <div className="medication-stock">
                    {getStockIcon(stockStatus)}
                    <span className={getStockColor(stockStatus)}>
                      {getStockText(stockStatus, medication.amount.value)}
                    </span>
                  </div>
                </div>
                <div className="medication-status">
                  <span className={`status-badge ${stockStatus}`}>
                    {stockStatus.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {stock.last_updated && (
          <div className="stock-footer">
            <span className="update-time">
              ⏰ Actualizado: {new Date(stock.last_updated).toLocaleDateString('es-CL')} 
              {' '}{new Date(stock.last_updated).toLocaleTimeString('es-CL')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyStock;