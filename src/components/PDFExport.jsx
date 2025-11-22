import React, { memo, useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const PDFExport = memo(({ params, summary, monthlyData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = useCallback((value) => {
    if (value === undefined || value === null || isNaN(value)) return '$ 0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }, []);

  const generatePDF = useCallback(() => {
    // Validar que tenemos datos
    if (!params || !summary || !monthlyData || monthlyData.length === 0) {
      setError('No hay datos disponibles para generar el PDF. Por favor, ejecute la simulación primero.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;

      // Encabezado con logo/título
      doc.setFontSize(24);
      doc.setTextColor(41, 128, 185);
      doc.text('ARBO INVERSIONES', pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 10;
      doc.setFontSize(14);
      doc.setTextColor(52, 73, 94);
      doc.text('Simulador de Plan de Inversión en Motocicletas', pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 8;
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Reporte generado: ${new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 10;
      doc.setDrawColor(41, 128, 185);
      doc.setLineWidth(0.5);
      doc.line(20, yPosition, pageWidth - 20, yPosition);

      yPosition += 15;

      // Sección 1: Parámetros de Entrada
      doc.setFontSize(14);
      doc.setTextColor(41, 128, 185);
      doc.text('1. Parámetros de Entrada', 20, yPosition);

      yPosition += 8;

      const parametros = [
        ['Valor Estándar Moto', formatCurrency(params.valorMoto)],
        ['Pago Diario por Moto', formatCurrency(params.pagoDiario)],
        ['Interés Diario por Moto', formatCurrency(params.interesDiario)],
        ['Principal Devuelto Diario', formatCurrency(params.principalDiario)],
        ['Motos Iniciales', String(params.motosIniciales || 1)],
        ['Días de Simulación', `${params.dias || 0} días (≈ ${((params.dias || 0) / 365).toFixed(1)} años)`],
        ['Días por Mes', String(params.diasPorMes || 26)],
        ['Tipo Acumulación', params.tipoCashDisponible === 'pagoRecibido' ? 'Pago Recibido' : 'Interés Ganado']
      ];

      doc.autoTable({
        startY: yPosition,
        head: [['Parámetro', 'Valor']],
        body: parametros,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 80, halign: 'right' }
        }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // Sección 2: Resumen de Resultados
      doc.setFontSize(14);
      doc.setTextColor(41, 128, 185);
      doc.text('2. Resumen de Resultados', 20, yPosition);

      yPosition += 8;

      const resultados = [
        ['Motos Totales Proyectadas', String(summary.motosFinales || 0)],
        ['Cash Final Disponible', formatCurrency(summary.cashFinal)],
        ['Capital Acumulado Total', formatCurrency(summary.capitalAcumulado)],
        ['Inversión Inicial', formatCurrency(summary.totalInvertido)],
        ['Ganancia Total', formatCurrency(summary.gananciaTotal)],
        ['ROI Total', `${(summary.roiTotal || 0).toFixed(2)}%`],
        ['ROI Anual Promedio', `${(summary.roiAnual || 0).toFixed(2)}%`],
        ['Intereses Totales Generados', formatCurrency(summary.interesesTotales)]
      ];

      doc.autoTable({
        startY: yPosition,
        head: [['Métrica', 'Valor']],
        body: resultados,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133], fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 80, halign: 'right' }
        }
      });

      // Nueva página para la tabla mensual
      doc.addPage();
      yPosition = 20;

      // Sección 3: Detalle Mensual
      doc.setFontSize(14);
      doc.setTextColor(41, 128, 185);
      doc.text('3. Proyección Mensual Detallada', 20, yPosition);

      yPosition += 8;

      const monthlyTableData = monthlyData.map(month => [
        `Mes ${month.mes}`,
        String(Math.round(month.motosActivasPromedio || 0)),
        formatCurrency(month.pagoRecibidoTotal),
        formatCurrency(month.interesGanadoTotal),
        String(month.nuevasMotasTotal || 0),
        formatCurrency(month.cashDisponible),
        String(month.motosTotales || 0)
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Mes', 'Motos Act.', 'Pago Rec.', 'Interés', 'Nuevas', 'Cash Disp.', 'Total']],
        body: monthlyTableData,
        theme: 'striped',
        headStyles: { fillColor: [142, 68, 173], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        margin: { left: 10, right: 10 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 20, halign: 'right' },
          2: { cellWidth: 32, halign: 'right' },
          3: { cellWidth: 32, halign: 'right' },
          4: { cellWidth: 15, halign: 'right' },
          5: { cellWidth: 32, halign: 'right' },
          6: { cellWidth: 18, halign: 'right' }
        }
      });

      // Footer en todas las páginas
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Arbo Inversiones - Simulación de Reinversión en Motocicletas`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          `Página ${i} de ${totalPages}`,
          pageWidth - 20,
          doc.internal.pageSize.height - 10,
          { align: 'right' }
        );
      }

      // Descargar el PDF
      const filename = `Simulacion_Arbo_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

    } catch (err) {
      console.error('Error generando PDF:', err);
      setError('Error al generar el PDF. Por favor intente nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  }, [params, summary, monthlyData, formatCurrency]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Exportar Reporte PDF</h2>
            <p className="text-gray-600 text-sm mt-1">
              Descarga un reporte completo con parámetros, resultados y proyección mensual
            </p>
          </div>
        </div>
        <button
          onClick={generatePDF}
          disabled={isGenerating || !summary || !monthlyData || monthlyData.length === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            isGenerating || !summary || !monthlyData || monthlyData.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar PDF
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
});

PDFExport.displayName = 'PDFExport';
