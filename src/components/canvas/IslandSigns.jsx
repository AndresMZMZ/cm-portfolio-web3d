import { SOCIALS } from "@/data/portfolio";
import { MODES, useGameStore } from "@/store/useGameStore";
import { resolveSignAction } from "@/utils/signActions";
import { Html, Text } from "@react-three/drei";
import { useState } from "react";

// Signs (señales); Carteles clicables de la isla de redes (HU28): una tabla de madera sobre un poste con el texto encima.
// Sus posiciones se definen en config/islands.js (signs), relativas al centro de la isla
// El profe en la (clase 5) usa eventos de R3F (onClick, onPointerOver) y Text de drei (clase 6); aquí se combinan.
// Nombres en inglés: Sign (cartel), hovered (con el puntero encima),POST_HEIGHT (alto del poste), BOARD (tabla: ancho y alto).
const SIGN_FONT = "/fonts/PirataOne-Regular.ttf";
const POST_HEIGHT = 22;
const BOARD = [30, 16];
//esta función Sign() dibuja un cartel individual, y IslandSigns() dibuja todos los carteles de la isla.
function Sign({ island, sign }) {
  const [hovered, setHovered] = useState(false);
  const action = resolveSignAction(sign, SOCIALS);
  // Solo se puede pulsar navegando y estando cerca de esta isla (criterio de la HU: "llego a la isla de redes").
  const active = useGameStore(
    (s) => s.mode === MODES.NAVIGATION && s.nearIsland === island.id,
  );
  const clickable = active && action.type !== "soon";
  const hoverLabel =
    action.type === "link"
      ? `${sign.label} ↗`
      : action.type === "panel"
        ? `Ver ${sign.label}`
        : `${sign.label} · Próximamente`;
// Al hacer clic en un cartel, se abre un panel o una pestaña nueva según el tipo de acción.
  const handleClick = (event) => {
    event.stopPropagation(); // El clic no sigue hacia los objetos que haya detrás
    if (!clickable) return;
    if (action.type === "panel") {
      useGameStore.getState().openPanel(action.panel);
    } else {
      // noopener y noreferrer: la pestaña nueva no puede abrirse a la ventana del portafolio.
      window.open(action.url, "_blank", "noopener,noreferrer");
    }
  };
// La altura del cartel se calcula para que la tabla quede justo encima del poste, con un pequeño margen de 2 unidades.
  const boardY = POST_HEIGHT + BOARD[1] / 2 - 2;

  return (
    <group
      position={sign.position}
      rotation={[0, sign.rotationY ?? 0, 0]}
      // Al pasar el puntero sobre un cartel pulsable, crece un poco; el cursor de estrella de HU04 no se cambia.
      scale={(sign.scale ?? 1) * (hovered && clickable ? 1.06 : 1)}
      onClick={handleClick}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow position={[0, POST_HEIGHT / 2, 0]}>
        <boxGeometry args={[2.4, POST_HEIGHT, 2.4]} />
        <meshStandardMaterial color="#4a3018" roughness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, boardY, 0.5]}>
        <boxGeometry args={[BOARD[0], BOARD[1], 1.6]} />
        <meshStandardMaterial
          color={hovered && clickable ? "#8a5a2b" : "#6b4423"}
          roughness={0.85}
        />
      </mesh>
      <Text
        font={SIGN_FONT}
        position={[0, boardY + (action.type === "soon" ? 2 : 0), 1.4]}
        fontSize={4.6}
        maxWidth={BOARD[0] - 4}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#f8fafc"
        outlineWidth={0.12}
        outlineColor="#1b1209"
      >
        {sign.label}
      </Text>
      {action.type === "soon" && (
        <Text
          font={SIGN_FONT}
          position={[0, boardY - 3.5, 1.4]}
          fontSize={2.6}
          anchorX="center"
          anchorY="middle"
          color="#cbd5e1"
        >
          Próximamente
        </Text>
      )}
      {hovered && (
        <Html center distanceFactor={220} position={[0, 26, 0]}>
          <div
            style={{
              padding: "8px 12px",
              border: "1px solid #d4af37",
              borderRadius: 8,
              background: "rgba(11, 19, 41, 0.92)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.45)",
              color: "#fff7db",
              fontFamily: "Georgia, serif",
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {hoverLabel}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function IslandSigns({ island }) {
  if (!island.signs?.length) return null;
  return (
    <group position={island.position}>
      {island.signs.map((sign) => (
        <Sign key={sign.id} island={island} sign={sign} />
      ))}
    </group>
  );
}
