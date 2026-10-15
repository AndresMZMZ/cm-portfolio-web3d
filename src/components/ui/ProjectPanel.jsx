// INICIO archivo reemplazado
import { ISLANDS } from "@/config/islands";
import { PRACTICES, PROFILE, REPOS } from "@/data/portfolio";
import { MODES, useGameStore } from "@/store/useGameStore";
import { useEffect, useRef } from "react";
import "./ProjectPanel.css";

function ExternalLink({ href, label }) {
  if (!href) return <span className="pp-soon">Próximamente</span>;
  // noopener noreferrer: la pestaña nueva no puede controlar la página del portafolio
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

// El docente (clase 6) muestra Html con "fullscreen" para poner HTML dentro del Canvas, pero para un panel que
// cubre la pantalla usamos HTML normal fuera del Canvas porque se estiliza con CSS, es accesible y no depende de la escena
export default function ProjectPanel() {
  const mode = useGameStore((s) => s.mode);
  const activePanel = useGameStore((s) => s.activePanel);
  const backToNavigation = useGameStore((s) => s.backToNavigation);
  const ref = useRef(null);
  const open = mode === MODES.PANEL && activePanel === "proyectos";

  // Al abrirse, el foco pasa al panel: las flechas lo desplazan y los lectores de pantalla lo anuncian
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  if (!open) return null;
  const island = ISLANDS.find((i) => i.id === activePanel);

  return (
    <div className="pp-backdrop">
      <section
        ref={ref}
        className="pp-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pp-title"
        tabIndex={-1}
      >
        <h2 id="pp-title">{island?.name ?? "Proyectos"}</h2>

        <h3>Trayectoria</h3>
        <p>
          <strong>{PROFILE.name}</strong>
        </p>
        <ul className="pp-roles">
          {PROFILE.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
        <p>{PROFILE.summary}</p>

        <h3>Prácticas del curso por semana</h3>
        <ul className="pp-list">
          {PRACTICES.map((p) => (
            <li key={p.week} className="pp-card">
              <span className="pp-week">Semana {p.week}</span>
              <h4>{p.title}</h4>
              <p>{p.description}</p>
              <ExternalLink href={p.url} label="Ver práctica" />
            </li>
          ))}
        </ul>

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

        {/* INICIO bloque HU27: aviso visible y botón de cierre */}
        <footer className="pp-footer">
          <p className="pp-hint">Presiona ESC o haz clic en Sigue Navegando</p>
          <button type="button" className="pp-close" onClick={backToNavigation}>
            Sigue Navegando
          </button>
        </footer>
        {/* FIN bloque HU27 */}
      </section>
    </div>
  );
}
// FIN archivo reemplazado
