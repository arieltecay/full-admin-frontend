/**
 * Formatea un número como moneda ARS con el formato regional de Argentina.
 */
export const formatCurrency = (val: number | undefined | null): string => {
  if (val === undefined || val === null) return '$0';
  return val.toLocaleString('es-AR', { 
    style: 'currency', 
    currency: 'ARS', 
    maximumFractionDigits: 0 
  });
};

/**
 * Formatea un número como moneda abreviada (ej: 1.2M, 500K) para visualizaciones compactas.
 */
export const formatShortCurrency = (val: number | undefined | null): string => {
  if (val === undefined || val === null) return '$0';
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
};
