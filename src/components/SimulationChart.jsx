import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const SimulationChart = ({ monthlyData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  const chartData = monthlyData.map(month => ({
    mes: `Mes ${month.mes}`,
    motos: month.motosTotales,
    cash: month.cashDisponible
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Proyección de Inversión</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 12 }}
            interval={Math.floor(chartData.length / 10)} // Mostrar ~10 labels
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            label={{ value: 'Motos', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
            label={{ value: 'Cash', angle: 90, position: 'insideRight' }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'motos') return [value, 'Motos Totales'];
              return [formatCurrency(value), 'Cash Disponible'];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="motos"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Motos Totales"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cash"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Cash Disponible"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
