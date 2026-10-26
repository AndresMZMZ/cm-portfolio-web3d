import { ISLANDS } from "@/config/islands";
import { PRACTICES, PROFILE, REPOS } from "@/data/portfolio";
import { MODES, useGameStore } from "@/store/useGameStore";
import { useEffect, useRef } from "react";
import "./ProjectPanel.css";

// SUBCOMPONENTE REUTILIZABLE: ExternalLink
// Renderiza un enlace seguro a una pestaña nueva o un texto gris si no hay URL disponible.
function ExternalLink({ href, label }) {
  // Si no hay una dirección web (!href), rompe el flujo y muestra un mensaje de "Próximamente" estático
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

// COMPONENTE PRINCIPAL: ProjectPanel
// El docente (clase 6) muestra Html con "fullscreen" para poner HTML dentro del Canvas, pero para un panel que
// cubre la pantalla usamos HTML normal fuera del Canvas porque se estiliza con CSS, es accesible y no depende de la escena.
export default function ProjectPanel() {
  // SUSCRIPCIÓN AL ESTADO GLOBAL (Zustand):
  const mode = useGameStore((s) => s.mode);                     // Lee la fase actual (ej: PANEL o NAVIGATION)
  const activePanel = useGameStore((s) => s.activePanel);       // Almacena el ID del panel interactivo activo
  const backToNavigation = useGameStore((s) => s.backToNavigation); // Función global para cerrar el menú y volver al mundo 3D

  const ref = useRef(null); // Referencia mutable conectada a la etiqueta <section> del cuadro de diálogo para control de foco

  // CONDICIÓN DE APERTURA:
  // El modal solo es "válido" si el modo global está en PANEL y el panel activo solicitado es "proyectos"
  const open = mode === MODES.PANEL && activePanel === "proyectos";

  // EFECTO DE ACCESIBILIDAD AUTOMÁTICA:
  // Al abrirse, el foco del navegador pasa inmediatamente al contenedor del panel (<section>).
  // Esto permite que las flechas del teclado sirvan para desplazar el texto interno (scroll)
  // y que los lectores de pantalla (para usuarios con discapacidad visual) anuncien el inicio del diálogo.
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  // Si la condición 'open' es falsa, el componente no dibuja absolutamente nada en la pantalla
  if (!open) return null;

  // Busca los datos específicos de la isla (como su nombre) basados en el string que tiene guardado 'activePanel'
  const island = ISLANDS.find((i) => i.id === activePanel);

  return (
    <div className="pp-backdrop">
      {/* DIRECTIVAS DE ACCESIBILIDAD EN EL CONTENEDOR (ARIA):
          role="dialog": Le avisa al sistema operativo que esto es una ventana emergente interactiva.
          aria-modal="true": Indica que el usuario no puede interactuar con lo que está detrás hasta cerrarlo.
          aria-labelledby: Vincula el anuncio por voz de este modal directamente con el texto del título (h2).
          tabIndex={-1}: Permite que el elemento reciba el foco programático por JavaScript sin romper la tabulación normal. */}
      <section
        ref={ref}
        className="pp-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pp-title"
        tabIndex={-1}
      >
        {/* TÍTULO PRINCIPAL: Si la isla existe muestra su nombre, de lo contrario muestra "Proyectos" por defecto */}
        <h2 id="pp-title">{island?.name ?? "Proyectos"}</h2>

        {/* SECCIÓN 1: PERFIL GENERAL */}
        <h3>Trayectoria</h3>
        <p>
          <strong>{PROFILE.name}</strong>
        </p>
        {/* Renderiza dinámicamente cada uno de tus roles como un elemento de lista individual */}
        <ul className="pp-roles">
          {PROFILE.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
        <p>{PROFILE.summary}</p>

        {/* SECCIÓN 2: LISTADO DE PRÁCTICAS ACADÉMICAS */}
        <h3>Prácticas del curso por semana</h3>
        <ul className="pp-list">
          {PRACTICES.map((p) => (
            <li key={p.week} className="pp-card">
              <span className="pp-week">Semana {p.week}</span>
              <h4>{p.title}</h4>
              <p>{p.description}</p>
              {/* Usa el subcomponente seguro para pintar el botón de redirección externa */}
              <ExternalLink href={p.url} label="Ver práctica" />
            </li>
          ))}
        </ul>

        {/* SECCIÓN 3: REPOSITORIOS DE GITHUB DESTACADOS */}
        <h3>Repositorios destacados</h3>
        <ul className="pp-list">
          {REPOS.map((r) => (
            <li key={r.title} className="pp-card">
              <h4>{r.title}</h4>
              <p>{r.description}</p>
              <ExternalLink href={r.url} label="Ver en GitHub" />
            </li>
          ))}
        </ul>
        {/* Pie del panel: indica cómo cerrarlo y permite volver a la navegación. */}
        <footer className="pp-footer">
          <p className="pp-hint">Presiona ESC o haz clic en Sigue Navegando</p>
          <button type="button" className="pp-close" onClick={backToNavigation}>
            Sigue Navegando
          </button>
        </footer>      
      </section>
    </div>
  );
}