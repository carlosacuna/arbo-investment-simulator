import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const PDFExport = ({ params, summary, monthlyData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Encabezado con logo/título
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.text('ARBO INVERSIONES', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;
    doc.setFontSize(16);
    doc.setTextColor(52, 73, 94);
    doc.text('Simulador de Plan de Inversión en Motocicletas', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 10;

    // Sección 1: Parámetros de Entrada
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text('1. Parámetros de Entrada', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const parametros = [
      ['Valor Estándar Moto', formatCurrency(params.valorMoto)],
      ['Pago Diario por Moto', formatCurrency(params.pagoDiario)],
      ['Interés Diario por Moto', formatCurrency(params.interesDiario)],
      ['Principal Devuelto Diario', formatCurrency(params.principalDiario)],
      ['Motos Iniciales', params.motosIniciales],
      ['Días de Simulación', `${params.dias} días (≈ ${(params.dias / 365).toFixed(1)} años)`]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Parámetro', 'Valor']],
      body: parametros,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 20, right: 20 }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Sección 2: Resumen de Resultados
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text('2. Resumen de Resultados', 20, yPosition);

    yPosition += 8;

    const resultados = [
      ['Motos Totales Proyectadas', summary.motosFinales],
      ['Cash Final Disponible', formatCurrency(summary.cashFinal)],
      ['Capital Acumulado Total', formatCurrency(summary.capitalAcumulado)],
      ['Inversión Inicial', formatCurrency(summary.totalInvertido)],
      ['Ganancia Total', formatCurrency(summary.gananciaTotal)],
      ['ROI Total', `${summary.roiTotal.toFixed(2)}%`],
      ['ROI Anual Promedio', `${summary.roiAnual.toFixed(2)}%`],
      ['Intereses Totales Generados', formatCurrency(summary.interesesTotales)]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Métrica', 'Valor']],
      body: resultados,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
      margin: { left: 20, right: 20 }
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
      Math.round(month.motosActivasPromedio),
      formatCurrency(month.pagoRecibidoTotal),
      formatCurrency(month.interesGanadoTotal),
      month.nuevasMotasTotal,
      formatCurrency(month.cashDisponible),
      month.motosTotales
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Mes', 'Motos Act.', 'Pago Rec.', 'Interés', 'Nuevas', 'Cash Disp.', 'Total Motos']],
      body: monthlyTableData,
      theme: 'striped',
      headStyles: { fillColor: [142, 68, 173], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20, halign: 'right' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 15, halign: 'right' },
        5: { cellWidth: 30, halign: 'right' },
        6: { cellWidth: 20, halign: 'right' }
      }
    });

    // Footer en todas las páginas
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generado por Arbo Inversiones - ${new Date().toLocaleDateString('es-CO')}`,
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
    doc.save(`Simulacion_Inversion_Arbo_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Exportar Reporte</h2>
          <p className="text-gray-600 text-sm mt-1">
            Descarga un reporte completo en PDF con todos los detalles de la simulación
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Descargar PDF
        </button>
      </div>
    </div>
  );
};
