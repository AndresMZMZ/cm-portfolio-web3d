// Decide qué hace un cartel de la isla de redes al hacer clic (HU28).
// Un cartel con 'panel' abre ese panel; uno con 'link' abre la URL de esa red en SOCIALS (data/portfolio.js).
// Si la URL está vacía devuelve 'soon' (próximamente) y el clic no hace nada.
export function resolveSignAction(sign, socials) {
  if (sign.panel) return { type: 'panel', panel: sign.panel }
  const url = socials.find((social) => social.id === sign.link)?.url
  return url ? { type: 'link', url } : { type: 'soon' }
}
