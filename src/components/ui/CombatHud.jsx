import { MODES, useGameStore } from "@/store/useGameStore";
// modo cañones (HU13): muestra el lado activo y las teclas disponibles. Solo aparece en combate.
// pointerEvents: "none" evita que el cartel bloquee clics sobre el Canvas (igual que BoundaryWarning).
// Nombres en inglés: SIDE_LABEL (nombre del lado), side (lado activo).
const SIDE_LABEL = { left: "Babor (izquierda)", right: "Estribor (derecha)" };

export default function CombatHud() {
  const mode = useGameStore((s) => s.mode);
  const side = useGameStore((s) => s.combatSide);

  if (mode !== MODES.COMBAT || !side) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        bottom: 48,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        padding: "12px 22px",
        fontSize: 18,
        fontFamily: "sans-serif",
        textAlign: "center",
        borderRadius: 10,
        border: "2px solid #fff",
        background: "rgba(11,19,41,0.85)",
        color: "#fff",
        pointerEvents: "none",
      }}
    >
      <strong>Cañones de {SIDE_LABEL[side]}</strong>
      <div style={{ fontSize: 14, marginTop: 6 }}>
        W/S elevar · A/D girar · Espacio disparar · Q/E cambiar de lado · Esc salir
      </div>
    </div>
  );
}