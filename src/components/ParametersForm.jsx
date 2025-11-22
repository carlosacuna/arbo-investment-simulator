import React, { useState, useEffect, useRef } from 'react';

export const ParametersForm = ({ params, onParametersChange, onApplyChanges }) => {
  const [localParams, setLocalParams] = useState(params || {
    valorMoto: 6250000,
    pagoDiario: 21000,
    interesDiario: 7000,
    principalDiario: 14000,
    motosIniciales: 1,
    dias: 1560,
    diasPorMes: 26,
    tipoCashDisponible: 'pagoRecibido'
  });

  const isInternalUpdateRef = useRef(false);
  const lastParamsRef = useRef(JSON.stringify(params));

  // Sincronizar cuando params cambia desde fuera (no desde nuestras propias actualizaciones)
  useEffect(() => {
    if (params) {
      const currentParamsStr = JSON.stringify(params);
      // Solo sincronizar si el cambio viene de fuera (no es una actualización interna)
      if (!isInternalUpdateRef.current && currentParamsStr !== lastParamsRef.current) {
        setLocalParams(params);
        lastParamsRef.current = currentParamsStr;
      } else if (isInternalUpdateRef.current) {
        // Si fue una actualización interna, actualizar la referencia pero no el estado
        lastParamsRef.current = currentParamsStr;
        isInternalUpdateRef.current = false;
      }
    }
  }, [params]);

  const handleChange = (field, value) => {
    let processedValue = value;
    if (field !== 'tipoCashDisponible') {
      // Permitir valores como string mientras el usuario escribe
      // Solo convertir a número si es un valor válido
      if (value === '' || value === '-' || value === '.') {
        // Mantener como string para permitir escritura continua
        processedValue = value;
      } else {
        const numValue = parseFloat(value);
        processedValue = isNaN(numValue) ? 0 : numValue;
      }
    }
    const newParams = { ...localParams, [field]: processedValue };
    
    // Marcar como actualización interna
    isInternalUpdateRef.current = true;
    
    // Actualizar estado local inmediatamente (sin disparar cálculos)
    setLocalParams(newParams);
    // Actualizar el estado del padre para mantener sincronización
    onParametersChange(newParams);
  };

  const handleApply = () => {
    // Validar y normalizar valores antes de aplicar
    const validatedParams = {
      ...localParams,
      valorMoto: Number(localParams.valorMoto) || 6250000,
      pagoDiario: Number(localParams.pagoDiario) || 21000,
      interesDiario: Number(localParams.interesDiario) || 7000,
      principalDiario: Number(localParams.principalDiario) || 14000,
      motosIniciales: Number(localParams.motosIniciales) || 1,
      dias: Number(localParams.dias) || 1560,
      diasPorMes: Number(localParams.diasPorMes) || 26,
    };
    setLocalParams(validatedParams);
    onParametersChange(validatedParams);
    onApplyChanges();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const InputField = ({ label, value, onChange, onBlur, type = "number", min, max, step, helperText, icon }) => {
    // Estado local para el valor del input (como string para permitir escritura parcial)
    const [localValue, setLocalValue] = useState(String(value || ''));
    const [isFocused, setIsFocused] = useState(false);
    const previousValueRef = useRef(value);
    
    // Sincronizar cuando el valor prop cambia desde fuera, pero solo si el input no está enfocado
    useEffect(() => {
      // Solo sincronizar si el valor cambió desde fuera y el input no está enfocado
      if (!isFocused && value !== previousValueRef.current) {
        setLocalValue(String(value || ''));
        previousValueRef.current = value;
      }
    }, [value, isFocused]);
    
    const handleInputChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue); // Actualizar estado local inmediatamente
      onChange(e); // Llamar al onChange del padre
    };
    
    const handleFocus = () => {
      setIsFocused(true);
    };
    
    const handleBlur = (e) => {
      setIsFocused(false);
      // Al perder el foco, asegurar que el valor sea válido
      const numValue = parseFloat(e.target.value) || 0;
      setLocalValue(String(numValue));
      previousValueRef.current = numValue;
      if (onBlur) {
        onBlur(e);
      }
    };
    
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
        <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
          {icon && <span className="mr-2 text-blue-600">{icon}</span>}
          {label}
        </label>
        <div className="relative">
          <input
            type={type}
            value={localValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
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
  };

  const SelectField = ({ label, value, onChange, options, helperText, icon }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
      <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
        {icon && <span className="mr-2 text-blue-600">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium text-gray-900 appearance-none cursor-pointer"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
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
              value={localParams.valorMoto}
              onChange={(e) => handleChange('valorMoto', e.target.value)}
              helperText={formatCurrency(Number(localParams.valorMoto) || 0)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>}
            />
            <InputField
              label="Pago Diario por Moto"
              value={localParams.pagoDiario}
              onChange={(e) => handleChange('pagoDiario', e.target.value)}
              helperText={formatCurrency(Number(localParams.pagoDiario) || 0)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>}
            />
            <InputField
              label="Interés Diario por Moto"
              value={localParams.interesDiario}
              onChange={(e) => handleChange('interesDiario', e.target.value)}
              helperText={formatCurrency(Number(localParams.interesDiario) || 0)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>}
            />
            <InputField
              label="Principal Devuelto Diario"
              value={localParams.principalDiario}
              onChange={(e) => handleChange('principalDiario', e.target.value)}
              helperText={formatCurrency(Number(localParams.principalDiario) || 0)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Motos Iniciales"
              value={localParams.motosIniciales}
              onChange={(e) => handleChange('motosIniciales', e.target.value)}
              min="1"
              helperText={`${Number(localParams.motosIniciales) || 0} motos`}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>}
            />
            <InputField
              label="Días de Simulación"
              value={localParams.dias}
              onChange={(e) => handleChange('dias', e.target.value)}
              min="30"
              step="30"
              helperText={`≈ ${((Number(localParams.dias) || 0) / 365).toFixed(1)} años`}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>}
            />
            <InputField
              label="Días por Mes"
              value={localParams.diasPorMes}
              onChange={(e) => handleChange('diasPorMes', e.target.value)}
              min="1"
              max="31"
              helperText={`${Number(localParams.diasPorMes) || 0} días por mes`}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>}
            />
            <SelectField
              label="Tipo Cash Disponible"
              value={localParams.tipoCashDisponible}
              onChange={(e) => handleChange('tipoCashDisponible', e.target.value)}
              options={[
                { value: 'pagoRecibido', label: 'Pago Recibido' },
                { value: 'interesGanado', label: 'Interés Ganado' }
              ]}
              helperText={localParams.tipoCashDisponible === 'pagoRecibido' ? 'Acumula pagos totales' : 'Solo acumula interés'}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>}
            />
          </div>
        </div>

        {/* Botón para aplicar cambios */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleApply}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aplicar Cambios y Calcular
          </button>
        </div>
      </div>
    </div>
  );
};
