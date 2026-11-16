// Enlace seguro a una pestaña nueva, o un texto gris "Próximamente" si no hay URL disponible.
// Se separó de ProjectPanel.jsx para reutilizarlo también en ResumePanel.jsx (HU28).
export default function ExternalLink({ href, label }) {
  // Si no hay una dirección web (!href), muestra un mensaje de "Próximamente" estático
  if (!href) return <span className="pp-soon">Próximamente</span>;

  // SEGURIDAD EN LA WEB:
  // target="_blank" abre el enlace en una nueva pestaña del navegador.
  // rel="noopener noreferrer": impide que la nueva página web acceda a la ventana de tu portafolio
  return (
    <a
      className="pp-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}
