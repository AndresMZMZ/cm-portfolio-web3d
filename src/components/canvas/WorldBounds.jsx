import { WORLD } from "@/config/world";
import { useGameStore } from "@/store/useGameStore";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

const BOUNDARY_SEGMENTS = 96;
const SEGMENT_OVERLAP = 1;

function createRingColliders({ label, centerX, centerY, centerZ, radius, halfRadial, halfY }) {
  const halfSegment = radius * Math.tan(Math.PI / BOUNDARY_SEGMENTS) + SEGMENT_OVERLAP;

  return Array.from({ length: BOUNDARY_SEGMENTS }, (_, index) => {
    const angle = (index / BOUNDARY_SEGMENTS) * Math.PI * 2;
    return {
      label: `${label}-${index}`,
      position: [
        centerX + Math.cos(angle) * radius,
        centerY,
        centerZ + Math.sin(angle) * radius,
      ],
      rotation: [0, -angle, 0],
      halfExtents: [halfRadial, halfY, halfSegment],
    };
  });
}

// Límite circular del mundo: segmentos fijos detienen el barco y sensores interiores activan el aviso.
export default function WorldBounds() {
  const setOutOfBounds = useGameStore((s) => s.setOutOfBounds);
  // Se cuentan los sensores ocupados para mantener el aviso activo hasta salir de toda la franja.
  const inside = useRef(0);

  const { left, right, back, front, bottom, top } = WORLD.bounds;
  const { wallHalfThickness: thick, warningDistance: warn } = WORLD;

  // Conserva los límites configurados; el menor semieje define un círculo que cabe dentro de ellos.
  const centerX = (left + right) / 2;
  const centerY = (bottom + top) / 2;
  const centerZ = (back + front) / 2;
  const halfX = Math.abs(right - left) / 2;
  const halfY = Math.abs(top - bottom) / 2;
  const halfZ = Math.abs(front - back) / 2;
  const radius = Math.min(halfX, halfZ);

  const walls = createRingColliders({
    label: "muro",
    centerX,
    centerY,
    centerZ,
    radius: radius + thick,
    halfRadial: thick,
    halfY,
  });
  const warningZones = createRingColliders({
    label: "zona-aviso",
    centerX,
    centerY,
    centerZ,
    radius: radius - warn / 2,
    halfRadial: warn / 2,
    halfY,
  });

  //Filtra el contacto para reaccionar únicamente cuando el cuerpo físico es el barco (name="ship")
  const handleEnter = ({ other }) => {
    if (other.rigidBodyObject?.name !== "ship") return;
    inside.current += 1;
    setOutOfBounds(true);
  };

  const handleExit = ({ other }) => {
    if (other.rigidBodyObject?.name !== "ship") return;
    inside.current = Math.max(0, inside.current - 1);
    if (inside.current === 0) setOutOfBounds(false);
  };

  return (
    <>
    {/* Cuerpos fijos sólidos: actúan como barreras físicas invisibles alrededor del mapa */}
      <RigidBody name="world-walls" type="fixed" colliders={false}>
        {walls.map((wall) => (
          <CuboidCollider
            key={wall.label}
            args={wall.halfExtents}
            position={wall.position}
            rotation={wall.rotation}
          />
        ))}
      </RigidBody>
      {/* Cuerpos fijos sensores: disparan la alerta HTML de límite de mapa al cruzarse con el barco */}
      <RigidBody name="world-warning-zones" type="fixed" colliders={false}>
        {warningZones.map((zone) => (
          <CuboidCollider
            key={zone.label}
            args={zone.halfExtents}
            position={zone.position}
            rotation={zone.rotation}
            sensor
            onIntersectionEnter={handleEnter}
            onIntersectionExit={handleExit}
          />
        ))}
      </RigidBody>
    </>
  );
}