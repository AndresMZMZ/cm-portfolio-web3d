import {MODES, useGameStore } from "@/store/useGameStore";

// Aviso en pantalla cuando el barco se acerca al borde del mundo (HU09, subtarea de UX).
// Se activa desde WorldBounds.jsx mediante el estado outOfBounds (Fuera de límites).
// Lee desde Zustand si el barco entró en una zona de advertencia de WorldBounds.jsx.
// role="alert": Anuncia el mensaje de advertencia en pantalla.
//pointerEvents: "none" (Transparencia al ratón): Evita que el cartel bloquee clics o el arrastre de cámara sobre el Canvas.
export default function BoundaryWarning() {
  const outOfBounds = useGameStore((s) => s.outOfBounds);
  const mode = useGameStore((s) => s.mode);

  if (!outOfBounds || mode !== MODES.NAVIGATION) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        top: 48,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        padding: "12px 22px",
        fontSize: 18,
        fontFamily: "sans-serif",
        borderRadius: 10,
        border: "2px solid #fff",
        background: "rgba(11,19,41,0.85)",
        color: "#fff",
        pointerEvents: "none",
      }}
    >
      Regresa al mar abierto
    </div>
  );
}