# Plan de Arquitectura Atómica v3.0

> **Autor:** Principal Software Architect  
> **Objetivo:** Atomizar el servicio de payroll (backend + frontend) en componentes por card, gráfico y tabla, conectados por un solo motor de filtros. Resolver el bug de `$0` en la tabla y la inconsistencia de datos.

---

## Diagnóstico de Problemas Actuales

### Bug Raíz: Tabla muestra `$0` y nombres en `-`

**Ubicación:** `frontend/src/pages/payroll/components/tabs/personal-tab/index.tsx:34-49`

La tabla lee claves en español **con espacios y acentos**:
```tsx
row['Legajo']              // ❌ No existe → muestra '#0'
row['Apellido y Nombre']   // ❌ No existe → muestra '-'
row['Neto a Pagar']        // ❌ No existe → muestra $0
row['Antigüedad (Años)']   // ❌ No existe → muestra '-'
```

Pero `api/src/services/payroll/mapper.ts` **normaliza** los headers a camelCase:
- `'APELLIDO Y NOMBRE'` → `apellidoNombre`
- `'NETO A PAGAR'` → `netoAPagar`
- `'LEGAJO'` → `legajo`
- `'ANTIGÜEDAD (AÑOS)'` → `antiguedad`

Estas filas normalizadas se guardan en MongoDB. La tabla nunca encuentra las keys en español.

**Sin embargo, las cards de KPIs SÍ funcionan** porque `analytics.service.ts:8-22` tiene un `getValue()` con fallbacks que prueba tanto camelCase como claves en español. Esto crea la inconsistencia: cards OK, tabla rota.

### Problemas Adicionales

| # | Problema | Ubicación |
|---|----------|-----------|
| 1 | Filtros se aplican en **3 lugares distintos** con lógicas potencialmente divergentes | Backend `calculateFilteredStats`, frontend `usePayrollFilters`, endpoint `/stats` |
| 2 | `analytics.service.ts` es una sola clase con filtros + 7 KPIs + 4 distribuciones + helper | `api/src/services/payroll/analytics.service.ts` (148 líneas) |
| 3 | Cada tab component hace sus propios cálculos sobre `rows` crudos | `desvios-tab`, `retenciones-tab` |
| 4 | Las filas del API no pasan por normalizador adicional | `dashboard-controller.ts:154` devuelve `payroll.data` sin procesar |
| 5 | El `usePayrollFilters` filtra localmente con camelCase pero la tabla renderiza keys en español | Inconsistencia de nombres de columnas |

---

## 1. Nueva Estructura Backend

```
api/src/services/payroll/
├── index.ts                    # Orquestador: PayrollService.filterAndAnalyze()
│
├── core/
│   ├── value-resolver.ts       # getValue() con fallbacks (extraído de analytics.service)
│   ├── row-normalizer.ts       # Garantiza que cada fila tenga keys camelCase + números
│   └── filter-engine.ts        # Motor centralizado de filtros (sucursal, convenio, antigüedad, search)
│
├── kpis/                       # Un archivo por cada card del dashboard
│   ├── dotacion.kpi.ts         # totalEmployees = rows.length
│   ├── masa-salarial.kpi.ts    # totalNeto / masaSalarial
│   ├── promedio.kpi.ts         # promedioNeto = masaSalarial / dotacion
│   ├── adicionales.kpi.ts      # totalAdicionales
│   ├── deducciones.kpi.ts      # totalDeducciones (SS + OS + Prev)
│   ├── remuneracion.kpi.ts     # totalRemuneration, averageRemuneration
│   └── hijos.kpi.ts            # totalHijos
│
├── distributions/              # Un archivo por cada gráfico de distribución
│   ├── obra-social.dist.ts     # Agrupación por Obra Social → DistributionItem[]
│   ├── condicion.dist.ts       # Agrupación por Condición
│   ├── actividad.dist.ts       # Agrupación por Actividad
│   └── localidad.dist.ts       # Agrupación por Localidad
│
├── processors/                 # (movido desde raíz de payroll/)
│   ├── file-processor.ts
│   ├── mapper.ts
│   ├── parser.ts
│   └── parser.test.ts
│
└── fixtures/
    └── example.csv
```

### Contrato de cada átomo

Cada KPI es una función pura:
```ts
type KpiFunction = (rows: PayrollRow[], resolver: ValueResolver) => number;
```

Cada distribución es una función pura:
```ts
type DistributionFunction = (rows: PayrollRow[]) => DistributionItem[];
```

El orquestador (`index.ts`):
```ts
class PayrollService {
  static analyze(rows: PayrollRow[], filters?: PayrollFilter): PayrollStats {
    const filtered = filters ? filterEngine.apply(rows, filters) : rows;
    return {
      summary: {
        totalEmployees:     dotacionKpi(filtered, resolver),
        totalRemuneration:  remuneracionKpi(filtered, resolver),
        averageRemuneration: promedioKpi(filtered, resolver),
        totalAdicionales:   adicionalesKpi(filtered, resolver),
        totalDeducciones:   deduccionesKpi(filtered, resolver),
        totalHijos:         hijosKpi(filtered, resolver),
        masaSalarial:       masaSalarialKpi(filtered, resolver),
        promedioNeto:       promedioNetoKpi(filtered, resolver),
        totalNeto:          masaSalarialKpi(filtered, resolver),
      },
      distributions: {
        obraSocial: obraSocialDist(filtered),
        condicion:  condicionDist(filtered),
        actividad:  actividadDist(filtered),
        localidad:  localidadDist(filtered),
      }
    };
  }
}
```

---

## 2. Nueva Estructura Frontend

```
frontend/src/pages/payroll/
├── payroll-viewer.tsx          # Orquestador simplificado (compone componentes atómicos)
├── types.ts                    # Re-exports
│
├── types/
│   └── index.ts                # Tipos centralizados (PayrollRow, PayrollStats, etc.)
│
├── hooks/
│   ├── usePayrollFilters.ts    # Filtros locales para la tabla
│   └── usePayrollData.ts       # Fetch y estado de datos (extraído del viewer)
│
├── utils/
│   └── payrollCalculations.ts  # formatCurrency, formatShortCurrency
│
├── components/
│   ├── filter-bar/
│   │   └── index.tsx           # Barra de filtros (extraída del viewer L136-173)
│   │
│   ├── kpi-cards/
│   │   ├── kpi-card.tsx        # (existente, renombrado) Card individual
│   │   └── kpi-row.tsx         # Fila de 5 KPI cards (extraída del viewer L175-189)
│   │
│   ├── table/
│   │   └── employee-table.tsx  # Tabla de empleados (usa camelCase: apellidoNombre, netoAPagar)
│   │
│   ├── charts/
│   │   ├── obra-social-pie.tsx       # Gráfico de torta Obra Social
│   │   ├── distribucion-barras.tsx   # Gráfico de barras Distribución Regional
│   │   └── asistencia-pie.tsx        # Gráfico de torta Asistencia
│   │
│   ├── tabs/
│   │   ├── personal-tab/       # Compone employee-table + obra-social-pie
│   │   ├── costos-tab/         # Compone distribucion-barras + top-5 + adicionales
│   │   ├── desvios-tab/        # Compone asistencia-pie + stat cards
│   │   ├── retenciones-tab/    # Compone bar chart + tax breakdown
│   │   └── ficha-tab/          # (sin cambios mayores)
│   │
│   ├── ai-assistant/           # (existente, sin cambios)
│   │   ├── index.tsx
│   │   └── types.ts
│   │
│   └── layout/
│       └── viewer-header.tsx   # Header del viewer (extraído del viewer L120-133)
```

---

## 3. Fase 1: Atomización Backend

### 3.1 Crear `core/value-resolver.ts`
- Extraer `getValue(row, key, fallbacks)` de `analytics.service.ts`
- Función pura exportada
- Prueba la key normalizada, luego cada fallback
- Convierte strings con formato argentino (puntos de miles, coma decimal)

### 3.2 Crear `core/row-normalizer.ts`
- Recibe `PayrollRow[]`, devuelve `PayrollRow[]`
- Para cada fila, garantiza que existan estas keys en camelCase:
  - `legajo`, `apellidoNombre`, `sucursal`, `convenio`
  - `antiguedad` (número), `netoAPagar` (número), `remuneracionTotal` (número)
  - `adicionales` (número), `deducciones` (número), `deducciones_os` (número)
  - `obraSocial`, `condicion`, `actividad`, `localidad`, `hijos` (número)
- Si la key original está en español, la copia a camelCase
- Si no existe, asigna `0` o `'N/A'` según tipo

### 3.3 Crear `core/filter-engine.ts`
- `applyFilters(rows: PayrollRow[], filters: PayrollFilter): PayrollRow[]`
- Única fuente de verdad para filtrado
- Filtros: `sucursal`, `convenio`, `antiguedadRange`, `searchTerm`
- Usa keys camelCase (las filas ya vienen normalizadas)

### 3.4 Crear archivos en `kpis/`
Cada archivo exporta una función que recibe `(rows, resolver)` y devuelve un número:

| Archivo | Cálculo |
|---------|---------|
| `dotacion.kpi.ts` | `rows.length` |
| `masa-salarial.kpi.ts` | `sum(getValue(r, 'netoAPagar', ['Neto a Pagar', 'NETO A PAGAR', 'Neto', 'Liquido']))` |
| `promedio.kpi.ts` | `masaSalarial / totalEmployees` |
| `adicionales.kpi.ts` | `sum(getValue(r, 'adicionales', ['Adicionales', 'CONCEPTOS NO REMUN.', 'Extras', 'Premios']))` |
| `deducciones.kpi.ts` | `sum(deducSS + deducOS)` donde cada una usa `getValue` con fallbacks |
| `remuneracion.kpi.ts` | `sum(getValue(r, 'remuneracionTotal', ['Remuneración Total', 'Total Bruto', 'Bruto']))` |
| `hijos.kpi.ts` | `sum(getValue(r, 'hijos', ['Hijos', 'HIJOS', 'Cargas', 'Cargas Fam.']))` |

### 3.5 Crear archivos en `distributions/`
Cada archivo exporta una función `(rows: PayrollRow[]) => DistributionItem[]`:
- Agrupa por la key correspondiente
- Cuenta ocurrencias
- Ordena descendente por valor
- Formato: `[{ name: string, value: number }]`

### 3.6 Crear `index.ts` (Orquestador)
- `PayrollService.analyze(rows, filters?)` → `PayrollStats`
- `PayrollService.normalizeRows(rows)` → `PayrollRow[]` (delega a row-normalizer)
- `PayrollService.filterRows(rows, filters)` → `PayrollRow[]` (delega a filter-engine)

### 3.7 Mover archivos existentes
- `file-processor.ts` → `processors/file-processor.ts`
- `mapper.ts` → `processors/mapper.ts`
- `parser.ts` → `processors/parser.ts`
- `parser.test.ts` → `processors/parser.test.ts`
- `fixtures/` → `processors/fixtures/` (o mantener en raíz)
- Actualizar imports internos

### 3.8 Actualizar controladores
- `controllers/payroll/index.ts`: Cambiar imports para usar `PayrollService` del nuevo `index.ts`
- `controllers/dashboard/dashboard-controller.ts`: 
  - Usar `PayrollService.analyze()` para stats
  - Usar `PayrollService.normalizeRows()` antes de devolver filas al frontend
- Verificar que `getPayrollStats` y `comparePayrolls` sigan funcionando

### 3.9 Borrar `analytics.service.ts`
- Una vez que todo funciona con la nueva estructura, eliminar el archivo viejo

---

## 4. Fase 2: Fix de Normalización (Bug de `$0`)

### 4.1 Row Normalizer robusto

```ts
// core/row-normalizer.ts
function normalizeRow(row: any): PayrollRow {
  return {
    legajo:              String(resolveValue(row, ['legajo', 'Legajo', 'LEGAJO'], '')),
    apellidoNombre:      String(resolveValue(row, ['apellidoNombre', 'Apellido y Nombre', 'APELLIDO Y NOMBRE', 'Nombre'], '')),
    sucursal:            String(resolveValue(row, ['sucursal', 'Sucursal', 'SUCURSAL', 'Sucursal / Planta'], '')),
    convenio:            String(resolveValue(row, ['convenio', 'Convenio', 'CONVENIO', 'Sindicato/Convenio'], '')),
    antiguedad:          toNumber(resolveValue(row, ['antiguedad', 'Antigüedad (Años)', 'Antigüedad Total', 'ANTIGÜEDAD'], 0)),
    netoAPagar:          toNumber(resolveValue(row, ['netoAPagar', 'Neto a Pagar', 'NETO A PAGAR', 'Neto', 'Liquido'], 0)),
    remuneracionTotal:   toNumber(resolveValue(row, ['remuneracionTotal', 'Remuneración Total', 'REMUNERACIÓN TOTAL', 'Total Bruto', 'Bruto'], 0)),
    adicionales:         toNumber(resolveValue(row, ['adicionales', 'Adicionales', 'CONCEPTOS NO REMUN.', 'Extras', 'Premios'], 0)),
    deducciones:         toNumber(resolveValue(row, ['deducciones', 'Total Aportes SS', 'Aportes SS', 'Aporte Previsional'], 0)),
    deducciones_os:      toNumber(resolveValue(row, ['deducciones_os', 'Total Aportes OS', 'Aporte OS', 'Aportes OS'], 0)),
    obraSocial:          String(resolveValue(row, ['obraSocial', 'Obra Social', 'O.S.', 'OBRA SOCIAL'], 'N/A')),
    condicion:           String(resolveValue(row, ['condicion', 'Condición', 'CONDICIÓN', 'Situación'], 'N/A')),
    actividad:           String(resolveValue(row, ['actividad', 'Actividad', 'ACTIVIDAD'], 'N/A')),
    localidad:           String(resolveValue(row, ['localidad', 'Localidad', 'LOCALIDAD'], 'N/A')),
    hijos:               toNumber(resolveValue(row, ['hijos', 'Hijos', 'HIJOS', 'Cargas', 'Cargas Fam.'], 0)),
  };
}
```

Esto garantiza que **todas** las filas que recibe el frontend tengan keys camelCase con valores numéricos donde corresponde.

### 4.2 Integrar en los controladores

**`controllers/dashboard/dashboard-controller.ts`** — `getDashboardDetails`:
```ts
// Antes:
res.json({ dashboard, clientName, metadata: payroll.metadata, stats, rows: payroll.data });

// Después:
const normalizedRows = PayrollService.normalizeRows(payroll.data);
res.json({ dashboard, clientName, metadata: payroll.metadata, stats, rows: normalizedRows });
```

**`controllers/payroll/index.ts`** — `getPayroll`:
```ts
// Antes:
res.json({ rows: payroll.data.slice(...), total: payroll.data.length });

// Después:
const normalizedRows = PayrollService.normalizeRows(payroll.data);
res.json({ rows: normalizedRows.slice(...), total: normalizedRows.length });
```

---

## 5. Fase 3: Atomización Frontend

### 5.1 Crear `components/filter-bar/index.tsx`
Extraer del viewer (líneas 136-173). Props:
```ts
interface FilterBarProps {
  filters: PayrollFilters;
  setters: PayrollFilterSetters;
  uniqueSucursales: string[];
  uniqueConvenios: string[];
  onReset: () => void;
}
```

### 5.2 Crear `components/table/employee-table.tsx`
Extraer del personal-tab (líneas 12-61). Props:
```ts
interface EmployeeTableProps {
  rows: PayrollRow[];
  formatCurrency: (v: number) => string;
}
```
Ya usará keys camelCase (fix de la Fase 4).

### 5.3 Crear `components/charts/obra-social-pie.tsx`
Extraer del personal-tab (líneas 63-111). Props:
```ts
interface ObraSocialPieProps {
  data: DistributionItem[];
  total: number;
}
```

### 5.4 Crear `components/charts/distribucion-barras.tsx`
Extraer del costos-tab. Props:
```ts
interface DistribucionBarrasProps {
  data: DistributionItem[];
}
```

### 5.5 Crear `components/charts/asistencia-pie.tsx`
Extraer del desvios-tab. Props:
```ts
interface AsistenciaPieProps {
  presente: number;
  inasistencias: number;
}
```

### 5.6 Crear `components/kpi-cards/kpi-row.tsx`
Extraer del viewer (líneas 175-189). Props:
```ts
interface KpiRowProps {
  summary: PayrollStats['summary'];
  isLoading: boolean;
}
```

### 5.7 Crear `hooks/usePayrollData.ts`
Extraer del viewer (líneas 49-86). Retorna:
```ts
{
  details: DashboardDetailsResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

### 5.8 Crear `components/layout/viewer-header.tsx`
Extraer del viewer (líneas 120-133). Props:
```ts
interface ViewerHeaderProps {
  clientName: string;
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}
```

### 5.9 Simplificar `payroll-viewer.tsx`
Después de la extracción, el viewer solo compone los componentes:
```tsx
<ViewerHeader clientName={...} onBack={...} theme={...} onToggleTheme={...} />
<FilterBar filters={...} setters={...} ... />
<KpiRow summary={...} isLoading={...} />
<TabBar activeTab={...} onTabChange={...} />
{activeTab === 'personal' && <PersonalTab rows={...} stats={...} formatCurrency={...} />}
...
<AIAssistant ... />
```

---

## 6. Fase 4: Fix de Tabla y Consistencia

### 6.1 Cambios en `employee-table.tsx`
Todas las referencias a claves en español se reemplazan por camelCase:

| Antes (ESPAÑOL) | Después (camelCase) |
|---|---|
| `row['Legajo']` | `row.legajo` |
| `row['Apellido y Nombre']` | `row.apellidoNombre` |
| `row['Sucursal']` | `row.sucursal` |
| `row['Convenio']` | `row.convenio` |
| `row['Antigüedad (Años)']` | `row.antiguedad` |
| `row['Neto a Pagar']` | `row.netoAPagar` |

### 6.2 Revisar cada tab component
| Tab | Archivo | Verificar |
|-----|---------|-----------|
| Personal | `personal-tab/index.tsx` | La tabla usa camelCase. El gráfico usa `stats.distributions.obraSocial` (ya funciona) |
| Costos | `costos-tab/index.tsx` | El gráfico usa `stats.distributions.localidad`. El top-5 usa `row['Neto a Pagar']` → cambiar a `row.netoAPagar` |
| Desvíos | `desvios-tab/index.tsx` | Calcula desde `rows`: verificar que use `row.adicionales`, `row['Premio Presentismo']` → `row.presentismo` |
| Retenciones | `retenciones-tab/index.tsx` | Calcula desde `rows`: verificar `row['Neto a Pagar']` → `row.netoAPagar` |
| Ficha | `ficha-tab/index.tsx` | Descubre keys dinámicamente con `Object.keys(row)`: ahora las keys serán camelCase, debe funcionar |

### 6.3 Unificar `usePayrollFilters` con el backend
El hook filtra localmente para la tabla. Verificar que:
- Las keys usadas en el filtro coinciden con las del `row-normalizer`
- El endpoint `getPayrollStats` usa `filter-engine.ts` (backend) para coherencia
- Si hay diferencias, el backend es la fuente de verdad

---

## 7. Verificación Final

### 7.1 Qué debe funcionar después de las 4 fases

- [ ] Tabla de empleados muestra nombres reales y montos en `$`
- [ ] Las 5 cards de KPI coinciden con los datos de la tabla
- [ ] Filtro por sucursal filtra tanto tabla como cards simultáneamente
- [ ] Filtro por convenio filtra tanto tabla como cards simultáneamente
- [ ] Filtro por antigüedad filtra tanto tabla como cards simultáneamente
- [ ] Búsqueda por texto filtra tanto tabla como cards simultáneamente
- [ ] Gráfico de Obra Social usa datos filtrados
- [ ] Gráfico de Distribución Regional usa datos filtrados
- [ ] Tab Desvíos muestra cálculos correctos
- [ ] Tab Retenciones muestra cálculos correctos
- [ ] Tab Ficha muestra el recibo del empleado correctamente
- [ ] AI Assistant recibe stats calculados con los mismos filtros

### 7.2 Tests

- [ ] `parser.test.ts` sigue pasando (los imports se actualizaron)
- [ ] Cada KPI se puede testear unitariamente con datos mock
- [ ] Cada distribución se puede testear unitariamente con datos mock
- [ ] `filter-engine` se puede testear con diferentes combinaciones de filtros
- [ ] El orquestador `PayrollService.analyze()` produce el mismo resultado que el viejo `analytics.service.ts`

---

## 8. Resumen de Archivos

### Archivos a CREAR (backend)
```
api/src/services/payroll/core/value-resolver.ts
api/src/services/payroll/core/row-normalizer.ts
api/src/services/payroll/core/filter-engine.ts
api/src/services/payroll/kpis/dotacion.kpi.ts
api/src/services/payroll/kpis/masa-salarial.kpi.ts
api/src/services/payroll/kpis/promedio.kpi.ts
api/src/services/payroll/kpis/adicionales.kpi.ts
api/src/services/payroll/kpis/deducciones.kpi.ts
api/src/services/payroll/kpis/remuneracion.kpi.ts
api/src/services/payroll/kpis/hijos.kpi.ts
api/src/services/payroll/distributions/obra-social.dist.ts
api/src/services/payroll/distributions/condicion.dist.ts
api/src/services/payroll/distributions/actividad.dist.ts
api/src/services/payroll/distributions/localidad.dist.ts
api/src/services/payroll/index.ts
```

### Archivos a CREAR (frontend)
```
frontend/src/pages/payroll/components/filter-bar/index.tsx
frontend/src/pages/payroll/components/table/employee-table.tsx
frontend/src/pages/payroll/components/charts/obra-social-pie.tsx
frontend/src/pages/payroll/components/charts/distribucion-barras.tsx
frontend/src/pages/payroll/components/charts/asistencia-pie.tsx
frontend/src/pages/payroll/components/kpi-cards/kpi-row.tsx
frontend/src/pages/payroll/components/layout/viewer-header.tsx
frontend/src/pages/payroll/hooks/usePayrollData.ts
```

### Archivos a MOVER (backend)
```
analytics.service.ts        →  ELIMINAR (reemplazado)
file-processor.ts           →  processors/file-processor.ts
mapper.ts                   →  processors/mapper.ts
parser.ts                   →  processors/parser.ts
parser.test.ts              →  processors/parser.test.ts
fixtures/                   →  processors/fixtures/ (o mantener)
```

### Archivos a MODIFICAR (backend)
```
controllers/payroll/index.ts
controllers/dashboard/dashboard-controller.ts
routes/payroll/index.ts (si cambian imports de controllers)
```

### Archivos a MODIFICAR (frontend)
```
payroll-viewer.tsx                          (simplificar)
components/tabs/personal-tab/index.tsx      (usar employee-table + obra-social-pie)
components/tabs/costos-tab/index.tsx        (usar distribucion-barras, fix camelCase)
components/tabs/desvios-tab/index.tsx       (usar asistencia-pie, fix camelCase)
components/tabs/retenciones-tab/index.tsx   (fix camelCase)
components/tabs/ficha-tab/index.tsx         (fix camelCase)
hooks/usePayrollFilters.ts                  (verificar consistencia)
```
