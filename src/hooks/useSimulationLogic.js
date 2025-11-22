import { useState, useEffect } from 'react';

/**
 * Hook personalizado para simular la reinversión en motocicletas
 * Replica la lógica del Excel "Simulación Reinversión Motos.xlsx"
 */
export const useSimulationLogic = (params) => {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!params) return;

    setIsCalculating(true);

    // Simular cálculo asíncrono para no bloquear UI
    setTimeout(() => {
      const result = calculateSimulation(params);
      setDailyData(result.daily);
      setMonthlyData(result.monthly);
      setSummary(result.summary);
      setIsCalculating(false);
    }, 100);
  }, [params]);

  return { dailyData, monthlyData, summary, isCalculating };
};

/**
 * Función principal de cálculo que replica la lógica del Excel
 */
const calculateSimulation = (params) => {
  const {
    valorMoto = 6216000,           // Valor estándar de la moto
    pagoDiario = 21000,            // Pago total recibido por moto al día
    interesDiario = 7000,          // Interés (ganancia) por moto al día
    principalDiario = 14000,       // Principal devuelto por moto al día
    motosIniciales = 1,            // Motos iniciales
    dias = 1560,                   // Días de simulación (5 años aprox)
    diasPorMes = 26,               // Días por mes para cálculos mensuales
    tipoCashDisponible = 'pagoRecibido'  // Tipo de acumulación para cash disponible
  } = params;

  const daily = [];
  const monthly = [];

  // Variables de estado
  let motosActivas = motosIniciales;
  let motosGenerandoIngresos = motosIniciales; // Motos que realmente generan ingresos hoy
  let motosTotales = motosIniciales;
  let cashDisponible = 0;
  let mesActual = 1;

  // Variables para acumulados
  let pagoRecibidoAcumulado = 0;
  let inversionTotal = 0; // Solo cuenta reinversiones en nuevas motos

  // Simulación diaria
  for (let dia = 1; dia <= dias; dia++) {
    const mesAprox = Math.ceil(dia / diasPorMes);
    
    // Si es un nuevo mes, las nuevas motos compradas el mes anterior ahora pueden generar ingresos
    if (mesAprox > mesActual) {
      motosGenerandoIngresos = motosActivas; // Todas las motas activas ahora generan ingresos
      mesActual = mesAprox;
    }

    // Al inicio del día, verificar si se puede comprar una nueva moto
    // (usando el cash disponible acumulado hasta el día anterior)
    // Las nuevas motos compradas este mes NO generarán ingresos hasta el mes siguiente
    let nuevasMotos = 0;
    let inversionDelDia = 0;
    if (cashDisponible >= valorMoto) {
      nuevasMotos = Math.floor(cashDisponible / valorMoto);
      inversionDelDia = nuevasMotos * valorMoto;
      inversionTotal += inversionDelDia;
      cashDisponible = cashDisponible % valorMoto; // Resto después de comprar
      motosTotales += nuevasMotos;
      motosActivas += nuevasMotos;
      // Las nuevas motos se activan hoy, pero NO generan ingresos hasta el mes siguiente
    }

    // Cálculos del día (solo con las motos que realmente generan ingresos hoy)
    // Las nuevas motos compradas este mes no generan ingresos hasta el mes siguiente
    const pagoRecibido = motosGenerandoIngresos * pagoDiario;
    const interesGanado = motosGenerandoIngresos * interesDiario;
    const principalDevuelto = motosGenerandoIngresos * principalDiario;

    // Acumular pago recibido total
    pagoRecibidoAcumulado += pagoRecibido;

    // El cash se acumula según el tipo configurado
    if (tipoCashDisponible === 'pagoRecibido') {
      cashDisponible += pagoRecibido;
    } else {
      cashDisponible += interesGanado;
    }

    // Guardar datos diarios
    daily.push({
      dia,
      mes: mesAprox,
      motosActivas: motosGenerandoIngresos, // Solo las que generan ingresos hoy
      pagoRecibido,
      interesGanado,
      principalDevuelto,
      nuevasMotos,
      cashDisponible,
      motosTotales,
      pagoRecibidoAcumulado,
      inversionTotal,
      pagoAcumuladoNeto: pagoRecibidoAcumulado - inversionTotal
    });

    // Agregar datos mensuales (al final de cada mes aproximado)
    if (dia % diasPorMes === 0 || dia === dias) {
      const diasDelMes = dia % diasPorMes === 0 ? diasPorMes : dia % diasPorMes;
      const mesData = daily.slice(-diasDelMes).reduce((acc, day) => ({
        mes: mesAprox,
        motosActivasPromedio: acc.motosActivasPromedio + day.motosActivas / diasDelMes,
        pagoRecibidoTotal: acc.pagoRecibidoTotal + day.pagoRecibido,
        interesGanadoTotal: acc.interesGanadoTotal + day.interesGanado,
        principalDevueltoTotal: acc.principalDevueltoTotal + day.principalDevuelto,
        nuevasMotasTotal: acc.nuevasMotasTotal + day.nuevasMotos,
        cashDisponible: day.cashDisponible,
        motosTotales: day.motosTotales,
        pagoRecibidoAcumulado: day.pagoRecibidoAcumulado,
        inversionTotal: day.inversionTotal,
        pagoAcumuladoNeto: day.pagoAcumuladoNeto
      }), {
        motosActivasPromedio: 0,
        pagoRecibidoTotal: 0,
        interesGanadoTotal: 0,
        principalDevueltoTotal: 0,
        nuevasMotasTotal: 0,
        cashDisponible: 0,
        motosTotales: 0,
        pagoRecibidoAcumulado: 0,
        inversionTotal: 0,
        pagoAcumuladoNeto: 0
      });

      monthly.push(mesData);
    }
  }

  // Calcular resumen
  const ultimoDia = daily[daily.length - 1];
  const totalInvertido = motosIniciales * valorMoto;
  const valorActivo = ultimoDia.motosTotales * valorMoto;
  const capitalAcumulado = valorActivo + ultimoDia.cashDisponible;
  const gananciaTotal = capitalAcumulado - totalInvertido;
  const roiTotal = (gananciaTotal / totalInvertido) * 100;
  const roiAnual = roiTotal / (dias / 365);
  const interesesTotales = daily.reduce((sum, day) => sum + day.interesGanado, 0);

  const summary = {
    motosFinales: ultimoDia.motosTotales,
    cashFinal: ultimoDia.cashDisponible,
    capitalAcumulado,
    totalInvertido,
    gananciaTotal,
    roiTotal,
    roiAnual,
    interesesTotales,
    diasSimulados: dias,
    añosSimulados: (dias / 365).toFixed(2)
  };

  return { daily, monthly, summary };
};
