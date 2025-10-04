# Arbo Inversiones - Simulador de Plan de Inversión en Motocicletas

## 🚀 Configuración del Proyecto

### Requisitos Previos
- Node.js v18 o superior
- npm v9 o superior

### Instalación

1. **Instalar dependencias:**
```bash
npm install
npm install react-is
```

2. **Iniciar el servidor de desarrollo:**
```bash
npx vite@latest
```

O usando el script incluido:
```bash
./start.sh
```

La aplicación estará disponible en: **http://localhost:5173/**

3. **Construir para producción:**
```bash
npm run build
```

4. **Previsualizar build de producción:**
```bash
npm run preview
```

## 📋 Características Implementadas

### ✅ Funcionalidades Principales

1. **Lógica de Cálculo Diario** (`src/hooks/useSimulationLogic.js`)
   - Simulación día a día con interés compuesto
   - Reinversión automática cuando el cash disponible alcanza el valor de una moto
   - Cálculo preciso basado en el archivo Excel original

2. **Parámetros Ajustables** (`src/components/ParametersForm.jsx`)
   - Valor Estándar Moto (default: $6,216,000)
   - Pago Diario por Moto (default: $21,000)
   - Interés Diario por Moto (default: $7,000)
   - Principal Devuelto Diario (default: $14,000)
   - Motos Iniciales (default: 1)
   - Días de Simulación (default: 1560 ≈ 5 años)

3. **Visualización de Resultados**
   - **Cards de Resumen** (`src/components/SummaryCards.jsx`)
     - Motos Totales Proyectadas
     - Capital Acumulado Final
     - ROI Anual Promedio
     - Ganancia Total

   - **Gráfico de Proyección** (`src/components/SimulationChart.jsx`)
     - Evolución de motos totales en el tiempo
     - Cash disponible para reinversión
     - Visualización mensual con Recharts

4. **Tabla de Detalle Mensual** (`src/components/MonthlyTable.jsx`)
   - Resumen mes a mes de la simulación
   - Motos activas, pagos recibidos, intereses, nuevas motos
   - Opción de expandir/contraer para ver todos los meses

5. **Exportación a PDF** (`src/components/PDFExport.jsx`)
   - Reporte completo con parámetros de entrada
   - Resumen de resultados clave
   - Tabla mensual detallada
   - Branding de Arbo Inversiones

### 🎨 Diseño y UX

- **Framework:** React 19 con hooks funcionales
- **Estilos:** Tailwind CSS 4 para diseño responsive
- **Gráficos:** Recharts para visualizaciones interactivas
- **Branding:** Título "ARBO INVERSIONES" destacado en azul
- **Responsive:** Optimizado para desktop y móvil

## 📊 Lógica de Negocio

### Cómo Funciona la Simulación

1. **Día a Día:**
   - Cada moto activa genera un pago diario de $21,000
   - De ese pago, $7,000 es interés (ganancia) y $14,000 es devolución de capital
   - El interés se acumula en el "Cash disponible"

2. **Reinversión Automática:**
   - Cuando Cash disponible ≥ $6,216,000 → se compra 1 moto nueva
   - El cash restante se mantiene para la próxima compra
   - Las nuevas motos empiezan a generar ganancias al día siguiente

3. **Cálculo de ROI:**
   - ROI Total = (Capital Final - Inversión Inicial) / Inversión Inicial × 100
   - ROI Anual = ROI Total / Años de simulación

## 🛠️ Tecnologías Utilizadas

- **React 19.1.1** - Framework principal
- **Vite 7.1.9** - Build tool y dev server
- **Tailwind CSS 4.1.14** - Framework de estilos
- **Recharts 3.2.1** - Biblioteca de gráficos
- **jsPDF 3.0.3** - Generación de PDFs
- **jspdf-autotable 5.0.2** - Tablas en PDF

## 📁 Estructura del Proyecto

```
arbo-simulator/
├── src/
│   ├── components/
│   │   ├── ParametersForm.jsx      # Formulario de parámetros
│   │   ├── SummaryCards.jsx        # Cards de resumen
│   │   ├── SimulationChart.jsx     # Gráfico de proyección
│   │   ├── MonthlyTable.jsx        # Tabla mensual
│   │   └── PDFExport.jsx           # Exportación a PDF
│   ├── hooks/
│   │   └── useSimulationLogic.js   # Lógica de cálculo
│   ├── App.jsx                      # Componente principal
│   └── index.css                    # Estilos Tailwind
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🔧 Solución de Problemas

Si encuentras el error "vite: command not found":
```bash
# Opción 1: Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Opción 2: Usar npx directamente
npx vite

# Opción 3: Instalar vite globalmente
npm install -g vite
```

## 📝 Notas Importantes

- Los cálculos replican fielmente la lógica del archivo Excel "Simulación Reinversión Motos.xlsx"
- La simulación se ejecuta en granularidad diaria para precisión máxima
- Los datos mensuales son agregaciones de los datos diarios
- El PDF incluye toda la información necesaria para análisis offline

## 🎯 Próximos Pasos Potenciales

- [ ] Guardar configuraciones favoritas en LocalStorage
- [ ] Comparar múltiples escenarios lado a lado
- [ ] Agregar más opciones de visualización (gráfico de barras, pie chart)
- [ ] Exportar datos a Excel/CSV
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)

---

**Desarrollado para Arbo Inversiones** 🏍️💰📈
