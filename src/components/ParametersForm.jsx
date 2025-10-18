import React from 'react';
import { useState } from 'react';

export const ParametersForm = ({ onParametersChange }) => {
  const [params, setParams] = useState({
    valorMoto: 6216000,
    pagoDiario: 21000,
    interesDiario: 7000,
    principalDiario: 14000,
    motosIniciales: 1,
    dias: 1560,
    diasPorMes: 26
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

  const InputField = ({ label, value, onChange, type = "number", min, max, step, helperText, icon }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
      <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
        {icon && <span className="mr-2 text-blue-600">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium text-gray-900 placeholder-gray-400"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60"></div>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-1.5 font-medium">{helperText}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Parámetros de Simulación</h2>
          <p className="text-gray-600 mt-1">Configura los valores para la simulación de inversión</p>
        </div>
      </div>

      {/* Form Groups */}
      <div className="space-y-6">
        {/* Parámetros Financieros */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 mr-3"></div>
            <h3 className="text-xl font-bold text-gray-800">Parámetros Financieros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Valor Estándar Moto"
              value={params.valorMoto}
              onChange={(e) => handleChange('valorMoto', e.target.value)}
              helperText={formatCurrency(params.valorMoto)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>}
            />
            <InputField
              label="Pago Diario por Moto"
              value={params.pagoDiario}
              onChange={(e) => handleChange('pagoDiario', e.target.value)}
              helperText={formatCurrency(params.pagoDiario)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>}
            />
            <InputField
              label="Interés Diario por Moto"
              value={params.interesDiario}
              onChange={(e) => handleChange('interesDiario', e.target.value)}
              helperText={formatCurrency(params.interesDiario)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>}
            />
            <InputField
              label="Principal Devuelto Diario"
              value={params.principalDiario}
              onChange={(e) => handleChange('principalDiario', e.target.value)}
              helperText={formatCurrency(params.principalDiario)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
            />
          </div>
        </div>

        {/* Parámetros de Simulación */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-green-300 mr-3"></div>
            <h3 className="text-xl font-bold text-gray-800">Configuración de Simulación</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              label="Motos Iniciales"
              value={params.motosIniciales}
              onChange={(e) => handleChange('motosIniciales', e.target.value)}
              min="1"
              helperText={`${params.motosIniciales} motos`}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>}
            />
            <InputField
              label="Días de Simulación"
              value={params.dias}
              onChange={(e) => handleChange('dias', e.target.value)}
              min="30"
              step="30"
              helperText={`≈ ${(params.dias / 365).toFixed(1)} años`}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>}
            />
            <InputField
              label="Días por Mes"
              value={params.diasPorMes}
              onChange={(e) => handleChange('diasPorMes', e.target.value)}
              min="1"
              max="31"
              helperText={`${params.diasPorMes} días por mes`}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
