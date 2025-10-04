import React from 'react';
import { useState } from 'react';

export const ParametersForm = ({ onParametersChange }) => {
  const [params, setParams] = useState({
    valorMoto: 6216000,
    pagoDiario: 21000,
    interesDiario: 7000,
    principalDiario: 14000,
    motosIniciales: 1,
    dias: 1560
  });

  const handleChange = (field, value) => {
    const newParams = { ...params, [field]: parseFloat(value) || 0 };
    setParams(newParams);
    onParametersChange(newParams);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Parámetros de Simulación</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor Estándar Moto
          </label>
          <input
            type="number"
            value={params.valorMoto}
            onChange={(e) => handleChange('valorMoto', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(params.valorMoto)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pago Diario por Moto
          </label>
          <input
            type="number"
            value={params.pagoDiario}
            onChange={(e) => handleChange('pagoDiario', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(params.pagoDiario)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interés Diario por Moto
          </label>
          <input
            type="number"
            value={params.interesDiario}
            onChange={(e) => handleChange('interesDiario', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(params.interesDiario)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Principal Devuelto Diario
          </label>
          <input
            type="number"
            value={params.principalDiario}
            onChange={(e) => handleChange('principalDiario', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(params.principalDiario)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motos Iniciales
          </label>
          <input
            type="number"
            value={params.motosIniciales}
            onChange={(e) => handleChange('motosIniciales', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
          />
          <p className="text-xs text-gray-500 mt-1">{params.motosIniciales} motos</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Días de Simulación
          </label>
          <input
            type="number"
            value={params.dias}
            onChange={(e) => handleChange('dias', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="30"
            step="30"
          />
          <p className="text-xs text-gray-500 mt-1">≈ {(params.dias / 365).toFixed(1)} años</p>
        </div>
      </div>
    </div>
  );
};
