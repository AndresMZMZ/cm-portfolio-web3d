import { WORLD } from "@/config/world";
import { useGameStore } from "@/store/useGameStore";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

// Borde del mundo (HU09): 4 muros fijos que detienen el barco y 4 sensores en una franja
// anterior a cada muro que activan el aviso "Regresa al mar abierto" (clase 07: sensor + onIntersectionEnter).
export default function WorldBounds() {
  const setOutOfBounds = useGameStore((s) => s.setOutOfBounds);
  // En una esquina el barco toca dos franjas a la vez; se cuentan para apagar el aviso solo al salir de ambas.
  const inside = useRef(0);

  // - wallHalfThickness (Grosor de muros): para evitar que el barco atraviese el borde.
  //- warningDistance (Franja de aviso): Define a que distancia del muro se activa la advertencia "Regresa al mar abierto".
  const { left, right, back, front, bottom, top } = WORLD.bounds;
  const { wallHalfThickness: thick, warningDistance: warn } = WORLD;

  // Cálculo de centros y mitades desde los 6 bordes independientes de config/world.js
  const centerX = (left + right) / 2;
  const centerY = (bottom + top) / 2;
  const centerZ = (back + front) / 2;
  const halfX = Math.abs(right - left) / 2;
  const halfY = Math.abs(top - bottom) / 2;
  const halfZ = Math.abs(front - back) / 2;

  // Paredes o (walls): detienen físicamente el casco del barco en los 4 puntos cardinales
  const walls = [
    {
      label: "este",
      position: [right + thick, centerY, centerZ],// Ubica el muro justo después del borde derecho (+X) para detener el barco
      halfExtents: [thick, halfY, halfZ + thick * 2],// Define el grosor y extiende el largo para sellar las esquinas sin dejar huecos
    },
    {
      label: "oeste",
      position: [left - thick, centerY, centerZ],
      halfExtents: [thick, halfY, halfZ + thick * 2],
    },
    {
      label: "sur",
      position: [centerX, centerY, front + thick],
      halfExtents: [halfX, halfY, thick],
    },
    {
      label: "norte",
      position: [centerX, centerY, back - thick],
      halfExtents: [halfX, halfY, thick],
    },
  ];
  
  // Franjas sensoras interiores (sensor): detectan la entrada del barco antes del muro sin frenarlo
  const warnHalf = warn / 2;
  const warningZones = [
    {
      label: "zona-este",
      position: [right - warnHalf, centerY, centerZ],// Ubica la franja de aviso justo antes del borde derecho (+X) para activar el aviso
      halfExtents: [warnHalf, halfY, halfZ],// Define la mitad del grosor de la franja y extiende el largo para cubrir toda la altura y profundidad
    },
    {
      label: "zona-oeste",
      position: [left + warnHalf, centerY, centerZ],
      halfExtents: [warnHalf, halfY, halfZ],
    },
    {
      label: "zona-sur",
      position: [centerX, centerY, front - warnHalf],
      halfExtents: [halfX, halfY, warnHalf],
    },
    {
      label: "zona-norte",
      position: [centerX, centerY, back + warnHalf],
      halfExtents: [halfX, halfY, warnHalf],
    },
  ];

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
            key={`${wall.label}-${wall.position.join(",")}-${wall.halfExtents.join(",")}`}
            args={wall.halfExtents}
            position={wall.position}
          />
        ))}
      </RigidBody>
      {/* Cuerpos fijos sensores: disparan la alerta HTML de límite de mapa al cruzarse con el barco */}
      <RigidBody name="world-warning-zones" type="fixed" colliders={false}>
        {warningZones.map((zone) => (
          <CuboidCollider
            key={`${zone.label}-${zone.position.join(",")}-${zone.halfExtents.join(",")}`}
            args={zone.halfExtents}
            position={zone.position}
            sensor
            onIntersectionEnter={handleEnter}
            onIntersectionExit={handleExit}
          />
        ))}
      </RigidBody>
    </>
  );
}