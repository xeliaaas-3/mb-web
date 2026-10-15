// Fotos de ejemplo de Unsplash (licencia libre, uso comercial permitido).
// Reemplazar por fotos propias de las prendas antes de publicar la tienda real.

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const photo = {
  // Ambiente / editorial
  hero: unsplash("1496747611176-843222e1e57c"),
  boutiqueInterior: unsplash("1441984904996-e0b6ba687e04"),
  rack: unsplash("1612423284934-2850a4ea6b0f"),
  floralField: unsplash("1517970640957-23d07d5ed08c"),
  whiteDressStreet: unsplash("1574655563118-3e3eab32015d"),
  whiteBlouseBasket: unsplash("1772855436877-3fe7489f4199"),
  beachDress: unsplash("1789145508216-ade0a26d518a"),
  greenSlipPalms: unsplash("1612454156787-6b5ad8f31304"),

  // Vestidos
  linenShiftDress: unsplash("1747396206869-75ea57b325ce"),
  terracottaShirtDress: unsplash("1789110853872-f416085557fa"),
  terracottaShirtDressBack: unsplash("1789110853833-bc1a883da2d6"),
  blackSatinGown: unsplash("1623580674393-edf6eb7090f8"),
  chocolateSatinDress: unsplash("1704775990154-b87562565d4c"),
  floralMidiDress: unsplash("1762154057377-cc9d3dd6900c"),
  sageMidiDress: unsplash("1789110519607-6176d668fb72"),
  lavenderKnitDress: unsplash("1789110520279-49e8a3a6fb91"),
  ivoryCrochetDress: unsplash("1789110520500-8fab603b19b8"),
  whiteLinenBeltDress: unsplash("1789110520302-3df8ce0410f0"),
  mustardButtonDress: unsplash("1789111161022-1970ba92f3b9"),

  // Blusas y tops
  whiteSatinShirt: unsplash("1704775991298-38b9139fdad9"),
  whiteLinenShirt: unsplash("1614312185032-a96342b80e3d"),
  crochetHalterTop: unsplash("1789111161049-d01ef1cb4974"),
  smockedLavenderTop: unsplash("1789110520784-3845cb0d0694"),
  blackOversizeTee: unsplash("1587070297440-7b8a62eb01c4"),
  blackRibbedTank: unsplash("1762343041454-8f1fdd459811"),

  // Pantalones y faldas
  tropicalPalazzo: unsplash("1789110520665-f07353f0afbe"),
  momJeans: unsplash("1789110854969-94d36ba7636e"),
  printPalazzo: unsplash("1789110520319-9bbec0598773"),
  blackFlaredSkirt: unsplash("1789110853398-539d78dd63bc"),
  blackSatinSkirt: unsplash("1708363390932-15e8a29c0f56"),
  camelSuedeSkirt: unsplash("1618244942912-7351be026e8b"),

  // Conjuntos, monos y abrigos
  sandSuit: unsplash("1779406166699-662a041a12a9"),
  sandSuitAlt: unsplash("1779406165962-7df12de281b1"),
  linenOversizeSet: unsplash("1690085028725-481caf2f27db"),
  blackSuit: unsplash("1584273143981-41c073dfe8f8"),
  paisleyJumpsuit: unsplash("1768803968246-5b8c7d04b722"),
  paisleyJumpsuitAlt: unsplash("1768982596945-97c5aa2be5d0"),
  whiteJumpsuit: unsplash("1725526750253-0abf4c3f4665"),
  camelBlazer: unsplash("1590873802674-55bb8f947bc5"),
  blackWrapCoat: unsplash("1760551937537-a29dbbfab30b"),
  beigeTrench: unsplash("1692180142575-c31fcd106b5b"),
  oatCardigan: unsplash("1782786980431-e0dcc25454c8"),
  mintSweater: unsplash("1625520109015-2ee42baffda6"),

  // Carteras
  cognacWovenBag: unsplash("1598532163257-ae3c6b2524b6"),
  chocolateClutch: unsplash("1749294435694-ce3c586591e6"),
  juteCrossbody: unsplash("1641934777532-d277296b111c"),
  beachBasket: unsplash("1763056531605-4e75d78e5016"),

  // Bijouterie
  goldHoops: unsplash("1671644730555-916aa8d8157f"),
  twistedHoops: unsplash("1777999745587-31af0844db6c"),
  ovalNecklace: unsplash("1783541507490-edb026e2a961"),
  ringSet: unsplash("1631982690223-8aa4be0a2497"),

  // Calzado y accesorios
  twoToneSandals: unsplash("1585120824848-8a5cd41493d2"),
  camelMules: unsplash("1718365837137-13cbd931068a"),
  pastelMules: unsplash("1585488434451-7ee645d0574b"),
  strawHats: unsplash("1774647001381-6585f36449f9"),
  braidedBelt: unsplash("1711443982852-b3df5c563448"),
  catEyeSunglasses: unsplash("1611824204322-24963b44d68b"),
} as const;

/** Hosts que Next puede optimizar (deben coincidir con images.remotePatterns de next.config.ts). */
export const optimizedImageHosts = [
  "images.unsplash.com",
  "lh3.googleusercontent.com",
  "res.cloudinary.com",
  "i.ibb.co",
];

/** Fotos de otros sitios (links pegados en la planilla) se muestran sin optimizar en vez de romper la página. */
export function isOptimizable(src: string) {
  try {
    const url = new URL(src, "https://local");
    return url.hostname === "local" || optimizedImageHosts.includes(url.hostname);
  } catch {
    return false;
  }
}
