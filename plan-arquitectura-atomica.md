# Plan de Arquitectura Atómica y Consolidación de Datos v2.2

> **Autor:** Principal Software Architect  
> **Objetivo:** Atomizar el servicio de payroll y asegurar que tanto las cards como la tabla de empleados muestren datos reales y normalizados.

---

## 1. Nueva Estructura Modular (Backend)

Migraremos la lógica a `api/src/services/payroll/` con la siguiente estructura:

- `index.ts`: Punto de entrada único. Orquestador de todos los sub-servicios.
- `processor/`: Manejo de CSV/Excel y el `Mapper` de sinónimos.
- `analytics/`:
  - `filter-engine.ts`: Motor centralizado de filtros.
  - `kpis/`: Un archivo por card (masa-salarial.ts, dotacion.ts, etc.).
  - `distributions/`: Un archivo por gráfico (obra-social.ts, etc.).
- `utils/`: Helpers como `getNumericValue` para manejo robusto de columnas.

---

## 2. Fase A: Normalización de la Tabla (Fix de Ceros)

Actualmente, las cards funcionan pero la tabla muestra `$0`.  
**Causa:** El controlador devuelve las filas "crudas" de la DB.  
**Solución:** El nuevo `index.ts` del servicio de payroll normalizará cada fila antes de enviarla al frontend, convirtiendo `'Neto a Pagar'` en `netoAPagar` (camelCase) de forma consistente.

---

## 3. Fase B: Sincronización de Tipos

El frontend recibirá un objeto con keys estandarizadas que debe usar para renderizar:
- `netoAPagar`
- `sucursal`
- `convenio`
- `adicionales`
- `deducciones`
- `apellidoNombre`
- `legajo`

---

## 4. Pasos de Implementación

1.  **Reorganización Física**: Crear carpetas y mover `mapper.ts` y processors.
2.  **Extracción de Lógica**: Descomponer el "God Object" `analytics.service.ts` en los nuevos átomos de `kpis/` y `distributions/`.
3.  **Implementación del Orquestador**: Crear el nuevo `index.ts` que filtre y normalice tanto los `stats` como las `rows`.
4.  **Refactor del Controlador**: Simplificar `api/src/controllers/payroll/index.ts` para que solo llame al nuevo servicio atomizado.
