import { CONTROLS } from "@/config/controls";
import { MODES, useGameStore } from "@/store/useGameStore";
import { useEffect, useRef } from "react";
import "./SettingsPanel.css";

// Panel de configuración inicial (HU02): aparece al pulsar el botón de inicio de la pantalla de carga.
// Permite elegir si el audio está activado y muestra las instrucciones de control.
// Es HTML normal fuera del Canvas, igual que ProjectPanel (clase 6: HTML sobre el canvas).
// audioEnabled (audio activado), ref (referencia).
export default function SettingsPanel() {
  const mode = useGameStore((s) => s.mode);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const setAudioEnabled = useGameStore((s) => s.SET_AUDIO_ENABLED);
  const confirmSettings = useGameStore((s) => s.confirmSettings);

  const ref = useRef(null);
  const open = mode === MODES.SETTINGS;

  // Al abrirse, el foco pasa al contenedor y no a un botón: si el visitante inició con Enter mantenido,
  // la repetición de la tecla no activaría el interruptor ni cerraría el panel sin querer.
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="sp-backdrop">
      <section
        ref={ref}
        className="sp-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sp-title"
        tabIndex={-1}
      >
        <h2 id="sp-title">Antes de zarpar</h2>

        <h3>Sonido</h3>
        <div className="sp-row">
          <span id="sp-audio-label">Audio</span>
          {/* role="switch" y aria-checked: los lectores de pantalla lo anuncian como interruptor activado o desactivado. */}
          <button
            type="button"
            role="switch"
            aria-checked={audioEnabled}
            aria-labelledby="sp-audio-label"
            className={`sp-switch ${audioEnabled ? "sp-switch-on" : ""}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            <span className="sp-switch-knob" aria-hidden="true" />
            <span className="sp-switch-text">
              {audioEnabled ? "Activado" : "Desactivado"}
            </span>
          </button>
        </div>

        <h3>Controles</h3>
        <ul className="sp-controls">
          {CONTROLS.map((control) => (
            <li key={control.action} className="sp-control">
              <span className="sp-keys">
                {control.keys.map((key) => (
                  <kbd key={key}>{key}</kbd>
                ))}
              </span>
              <span>
                {control.action}
                {control.soon && <em className="sp-soon">Próximamente</em>}
              </span>
            </li>
          ))}
        </ul>

        <footer className="sp-footer">
          <button type="button" className="sp-start" onClick={confirmSettings}>
            Empezar a navegar
          </button>
        </footer>
      </section>
    </div>
  );
}
