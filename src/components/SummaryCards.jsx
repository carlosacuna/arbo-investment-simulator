import React from 'react';
export const SummaryCards = ({ summary }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const cards = [
    {
      title: 'Motos Totales Proyectadas',
      value: summary.motosFinales || 0,
      icon: '🏍️',
      color: 'bg-blue-500'
    },
    {
      title: 'Capital Acumulado Final',
      value: formatCurrency(summary.capitalAcumulado || 0),
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      title: 'ROI Anual Promedio',
      value: `${(summary.roiAnual || 0).toFixed(2)}%`,
      icon: '📈',
      color: 'bg-purple-500'
    },
    {
      title: 'Ganancia Total',
      value: formatCurrency(summary.gananciaTotal || 0),
      icon: '💵',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`${card.color} p-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-white text-sm font-semibold">{card.title}</h3>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
