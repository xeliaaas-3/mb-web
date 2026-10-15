/** Guía de medidas en cm (busto, cintura, cadera). */
export const sizeChart = [
  { size: "S", label: "S (36-38)", bust: [86, 90], waist: [66, 70], hip: [92, 96] },
  { size: "M", label: "M (40-42)", bust: [92, 96], waist: [72, 76], hip: [98, 102] },
  { size: "L", label: "L (44)", bust: [98, 104], waist: [78, 84], hip: [104, 110] },
  { size: "XL", label: "XL (46)", bust: [106, 112], waist: [86, 92], hip: [112, 118] },
] as const;

export const bustRange = { min: 78, max: 118 } as const;

/** Talle recomendado según el contorno de busto. Entre dos talles, sugiere ambos. */
export function recommendSize(bust: number): { size: string; note: string } {
  for (let i = 0; i < sizeChart.length; i++) {
    const row = sizeChart[i];
    const [min, max] = row.bust;
    if (bust < min) {
      const prev = sizeChart[i - 1];
      return prev
        ? { size: `${prev.size} o ${row.size}`, note: "Estás entre dos talles: el más grande queda más holgado." }
        : { size: row.size, note: "Nuestro talle más chico; puede quedarte levemente holgado." };
    }
    if (bust <= max) return { size: row.size, note: `Busto de ${min} a ${max} cm.` };
  }
  return { size: "XL", note: "Escribinos por WhatsApp y te pasamos medidas exactas de cada prenda." };
}
