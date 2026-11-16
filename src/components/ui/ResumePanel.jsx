import ExternalLink from "@/components/ui/ExternalLink";
import { ISLANDS } from "@/config/islands";
import { PROFILE, RESUME, SOCIALS } from "@/data/portfolio";
import { MODES, useGameStore } from "@/store/useGameStore";
import { useEffect, useRef } from "react";
import "./ProjectPanel.css";

// Panel de la isla de redes y hoja de vida (HU28): estudios, gustos, redes y enlace a la hoja de vida.
// Se abre con el cartel "Hoja de vida" o con Enter/F cerca de la isla (activePanel "redes").
// Reutiliza el aspecto de ProjectPanel (clases pp-*) y, como él, es HTML normal fuera del Canvas (clase 6).
// Nombres en inglés: open (abierto), ref (referencia), studies (estudios), interests (gustos).
// Puedes renombrarlos a tu gusto.
export default function ResumePanel() {
  const mode = useGameStore((s) => s.mode);
  const activePanel = useGameStore((s) => s.activePanel);
  const backToNavigation = useGameStore((s) => s.backToNavigation);

  const ref = useRef(null);
  const open = mode === MODES.PANEL && activePanel === "redes";

  // Al abrirse, el foco pasa al contenedor para que las flechas desplacen el texto y los lectores de pantalla lo anuncien.
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
        aria-labelledby="rp-title"
        tabIndex={-1}
      >
        <h2 id="rp-title">{island?.name ?? "Redes y hoja de vida"}</h2>
        <p>
          <strong>{PROFILE.name}</strong>
        </p>

        <h3>Estudios</h3>
        <ul className="pp-list">
          {RESUME.studies.map((study) => (
            <li key={study.title} className="pp-card">
              <h4>{study.title}</h4>
              <p>
                {study.place}
                {study.detail ? ` · ${study.detail}` : ""}
              </p>
            </li>
          ))}
        </ul>

        <h3>Gustos</h3>
        <ul className="pp-roles">
          {RESUME.interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>

        <h3>Redes</h3>
        <ul className="pp-list">
          {SOCIALS.map((social) => (
            <li key={social.id} className="pp-card">
              <h4>{social.label}</h4>
              <ExternalLink href={social.url} label={`Abrir ${social.label}`} />
            </li>
          ))}
        </ul>

        <h3>Hoja de vida</h3>
        <ExternalLink href={RESUME.cvUrl} label="Ver hoja de vida" />

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
