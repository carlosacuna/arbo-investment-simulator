import React, { useState } from 'react';
import { useSimulationLogic } from './hooks/useSimulationLogic';
import { ParametersForm } from './components/ParametersForm';
import { SummaryCards } from './components/SummaryCards';
import { SimulationChart } from './components/SimulationChart';
import { MonthlyTable } from './components/MonthlyTable';
import { PDFExport } from './components/PDFExport';

function App() {
  const [params, setParams] = useState({
    valorMoto: 6216000,
    pagoDiario: 21000,
    interesDiario: 7000,
    principalDiario: 14000,
    motosIniciales: 1,
    dias: 1560,
    diasPorMes: 26,
    tipoCashDisponible: 'pagoRecibido'
  });

  const { dailyData, monthlyData, summary, isCalculating } = useSimulationLogic(params);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                <span className="text-blue-600">ARBO</span> INVERSIONES
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Simulador de Plan de Inversión en Motocicletas
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ParametersForm onParametersChange={setParams} />

        {isCalculating ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <SummaryCards summary={summary} />
            <SimulationChart monthlyData={monthlyData} />
            <MonthlyTable monthlyData={monthlyData} />
            <PDFExport params={params} summary={summary} monthlyData={monthlyData} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Arbo Inversiones. Sistema de simulación de inversión en motocicletas.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
