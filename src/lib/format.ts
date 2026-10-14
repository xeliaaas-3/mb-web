const gs = new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 });

/** 280000 → "280.000 Gs." */
export function formatGs(value: number) {
  return `${gs.format(value)} Gs.`;
}
