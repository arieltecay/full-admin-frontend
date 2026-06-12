# Plan de Arquitectura Atómica v3.1 — Consolidación Final

> **Autor:** Principal Software Architect  
> **Objetivo:** Ejecutar la atomización total del ecosistema de payroll. Resolver el bug de `$0` en las tablas y centralizar los tipos de datos en archivos independientes para cumplir con los estándares del proyecto.

---

## 1. Fase 0: Estandarización de Tipos (Separación Estricta)

Antes de mover lógica, garantizaremos que los tipos vivan en sus propios archivos, sin lógica de ejecución.

### 1.1 – Tipos Backend
- **Ubicación:** `api/src/services/payroll/types/index.ts`
- **Contenido:** Interfaces `PayrollRow`, `PayrollStats`, `PayrollFilter`, `DistributionItem`. Se eliminarán definiciones de tipos de los archivos de servicio.

### 1.2 – Tipos Frontend (Admin & Cliente)
- **Ubicación:** `frontend/src/pages/payroll/types/index.ts` y `admin/src/pages/reports/payroll-dashboard/types/index.ts`.
- **Contenido:** Reflejarán exactamente las mismas keys camelCase que el backend (`netoAPagar`, `apellidoNombre`, etc.).

---

## 2. Fase 1: Atomización del Backend (Servicios Puros)

Descompondremos el servicio de payroll en átomos funcionales e independientes.

### 2.1 – El Motor "Core"
- `core/value-resolver.ts`: Único responsable de leer valores (con fallbacks para datos viejos).
- `core/filter-engine.ts`: Único responsable de filtrar los datos.
- `core/row-normalizer.ts`: Único responsable de que cada fila tenga las keys correctas antes de ir al frontend.

### 2.2 – KPIs y Distribuciones (Archivos Individuales)
- Cada KPI (Masa Salarial, Dotación, etc.) tendrá su archivo `.kpi.ts`.
- Cada gráfico (Obra Social, Localidad, etc.) tendrá su archivo `.dist.ts`.
- **Beneficio:** Modificar una fórmula no arriesga el resto de los cálculos.

---

## 3. Fase 2: Fix Definitivo de la Tabla (Bug `$0`)

- El bug ocurre porque el frontend busca "Neto a Pagar" pero el backend guarda `netoAPagar`.
- **Acción:** El `PayrollService` en el backend normalizará **todas** las filas de la tabla mediante el `row-normalizer` antes de responder al frontend.
- **Acción Frontend:** Se actualizarán los componentes de tabla para usar exclusivamente las keys camelCase (`row.netoAPagar`).

---

## 4. Fase 3: Atomización del Frontend (Componentes UI)

Extraeremos las piezas masivas de `payroll-viewer.tsx` y `payroll-dashboard.tsx` en componentes reutilizables:
- `FilterBar`: Barra de filtros dinámica.
- `KpiRow`: Fila superior de 5 cards.
- `EmployeeTable`: Tabla de personal normalizada.
- `Charts/`: Carpeta con componentes de Recharts aislados.

---

## 5. Cronograma de Ejecución

1.  **Backend Types**: Crear `api/src/services/payroll/types/index.ts`.
2.  **Backend Core**: Implementar `value-resolver`, `filter-engine` y `row-normalizer`.
3.  **Backend Atoms**: Crear archivos en `kpis/` y `distributions/`.
4.  **Backend Index**: Crear el orquestador que une todo.
5.  **Frontend Sync**: Actualizar tipos y componentes en Admin y Frontend para usar la nueva estructura normalizada.
