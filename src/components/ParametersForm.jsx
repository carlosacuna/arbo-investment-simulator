import React, { useState, useCallback, memo } from 'react';

const defaultValues = {
  valorMoto: 6250000,
  pagoDiario: 21000,
  interesDiario: 7000,
  principalDiario: 14000,
  motosIniciales: 1,
  dias: 1560,
  diasPorMes: 26,
  tipoCashDisponible: 'pagoRecibido'
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

// Memoized InputField - evita re-renders innecesarios
const InputField = memo(({ label, value, onChange, min, max, step, helperText, icon, name }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
    <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
      {icon && <span className="mr-2 text-blue-600">{icon}</span>}
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        autoComplete="off"
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium text-gray-900 placeholder-gray-400"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60"></div>
      </div>
    </div>
    <p className="text-xs text-gray-600 mt-1.5 font-medium">{helperText}</p>
  </div>
));

InputField.displayName = 'InputField';

// Memoized SelectField
const SelectField = memo(({ label, value, onChange, options, helperText, icon, name }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
    <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
      {icon && <span className="mr-2 text-blue-600">{icon}</span>}
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
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
));

SelectField.displayName = 'SelectField';

export const ParametersForm = memo(({ params, onApplyChanges }) => {
  // Estado local completamente aislado del padre
  const [localParams, setLocalParams] = useState(() => {
    const initial = params || defaultValues;
    return {
      valorMoto: String(initial.valorMoto ?? defaultValues.valorMoto),
      pagoDiario: String(initial.pagoDiario ?? defaultValues.pagoDiario),
      interesDiario: String(initial.interesDiario ?? defaultValues.interesDiario),
      principalDiario: String(initial.principalDiario ?? defaultValues.principalDiario),
      motosIniciales: String(initial.motosIniciales ?? defaultValues.motosIniciales),
      dias: String(initial.dias ?? defaultValues.dias),
      diasPorMes: String(initial.diasPorMes ?? defaultValues.diasPorMes),
      tipoCashDisponible: initial.tipoCashDisponible ?? defaultValues.tipoCashDisponible
    };
  });

  // Track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);

  // Handler optimizado con useCallback - usa el name del input
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalParams(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  }, []);

  const handleApply = useCallback(() => {
    // Convertir strings a números y validar
    const validatedParams = {
      valorMoto: Number(localParams.valorMoto) || defaultValues.valorMoto,
      pagoDiario: Number(localParams.pagoDiario) || defaultValues.pagoDiario,
      interesDiario: Number(localParams.interesDiario) || defaultValues.interesDiario,
      principalDiario: Number(localParams.principalDiario) || defaultValues.principalDiario,
      motosIniciales: Number(localParams.motosIniciales) || defaultValues.motosIniciales,
      dias: Number(localParams.dias) || defaultValues.dias,
      diasPorMes: Number(localParams.diasPorMes) || defaultValues.diasPorMes,
      tipoCashDisponible: localParams.tipoCashDisponible
    };
    onApplyChanges(validatedParams);
    setHasChanges(false);
  }, [localParams, onApplyChanges]);

  const handleReset = useCallback(() => {
    if (params) {
      setLocalParams({
        valorMoto: String(params.valorMoto ?? defaultValues.valorMoto),
        pagoDiario: String(params.pagoDiario ?? defaultValues.pagoDiario),
        interesDiario: String(params.interesDiario ?? defaultValues.interesDiario),
        principalDiario: String(params.principalDiario ?? defaultValues.principalDiario),
        motosIniciales: String(params.motosIniciales ?? defaultValues.motosIniciales),
        dias: String(params.dias ?? defaultValues.dias),
        diasPorMes: String(params.diasPorMes ?? defaultValues.diasPorMes),
        tipoCashDisponible: params.tipoCashDisponible ?? defaultValues.tipoCashDisponible
      });
      setHasChanges(false);
    }
  }, [params]);

  // Helper para formatear moneda en tiempo real
  const getCurrencyHelper = useCallback((value) => {
    const num = Number(value) || 0;
    return formatCurrency(num);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
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
        {hasChanges && (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
            Cambios sin aplicar
          </span>
        )}
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
              name="valorMoto"
              value={localParams.valorMoto}
              onChange={handleChange}
              helperText={getCurrencyHelper(localParams.valorMoto)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>}
            />
            <InputField
              label="Pago Diario por Moto"
              name="pagoDiario"
              value={localParams.pagoDiario}
              onChange={handleChange}
              helperText={getCurrencyHelper(localParams.pagoDiario)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>}
            />
            <InputField
              label="Interés Diario por Moto"
              name="interesDiario"
              value={localParams.interesDiario}
              onChange={handleChange}
              helperText={getCurrencyHelper(localParams.interesDiario)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>}
            />
            <InputField
              label="Principal Devuelto Diario"
              name="principalDiario"
              value={localParams.principalDiario}
              onChange={handleChange}
              helperText={getCurrencyHelper(localParams.principalDiario)}
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
              name="motosIniciales"
              value={localParams.motosIniciales}
              onChange={handleChange}
              min="1"
              helperText={`${Number(localParams.motosIniciales) || 0} motos`}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>}
            />
            <InputField
              label="Días de Simulación"
              name="dias"
              value={localParams.dias}
              onChange={handleChange}
              min="30"
              step="30"
              helperText={`≈ ${((Number(localParams.dias) || 0) / 365).toFixed(1)} años`}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>}
            />
            <InputField
              label="Días por Mes"
              name="diasPorMes"
              value={localParams.diasPorMes}
              onChange={handleChange}
              min="1"
              max="31"
              helperText={`${Number(localParams.diasPorMes) || 0} días por mes`}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>}
            />
            <SelectField
              label="Tipo Cash Disponible"
              name="tipoCashDisponible"
              value={localParams.tipoCashDisponible}
              onChange={handleChange}
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

        {/* Botones de acción */}
        <div className="mt-8 flex justify-end gap-3">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Descartar
            </button>
          )}
          <button
            onClick={handleApply}
            className={`px-8 py-3 font-semibold rounded-lg shadow-lg transform transition-all duration-200 flex items-center gap-2 ${
              hasChanges
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
            }`}
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
});

ParametersForm.displayName = 'ParametersForm';
