import { ISLANDS } from "@/config/islands";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

// Convierte los seis bordes independientes relativos al centro de la isla
// en el centro y las medias dimensiones que exige el motor de física (Rapier).
// - left + right (Izquierda + Derecha en eje X): Calculan el centro horizontal y la mitad del ancho.
// - bottom + top (Inferior + Superior en eje Y): Calculan la altura central y la mitad del grosor vertical.
// - back + front (Atrás + Adelante en eje Z): Calculan el centro de profundidad y la mitad del largo.
// - halfExtents (Medias dimensiones): ya vienen definidas manualmente, se usan directamente sin convertir.
function resolveCollider(collider) {
  if (collider.halfExtents) {
    return { position: collider.position, halfExtents: collider.halfExtents };
  }
  const { left, right, back, front, bottom, top } = collider;
  return {
    position: [(left + right) / 2, (bottom + top) / 2, (back + front) / 2],
    halfExtents: [
      Math.abs(right - left) / 2,
      Math.abs(top - bottom) / 2,
      Math.abs(front - back) / 2,
    ],
  };
}

// Colisionadores fijos de las islas (HU09):
// - type="fixed" (Cuerpo estático): Mantiene la isla inmóvil a nivel del mar (Y = 0) para detener el barco sin ser empujada.
// - colliders={false} (Sin auto-mallas): Evita generar miles de triángulos (trimesh) sobre el modelo 3D (Clase 07).
// - CuboidCollider (Cajas simples): Dibuja los bloques de config/islands.js usando offsets X/Z relativos al centro de cada isla 
// y su altura Y alrededor de la línea de flotación.
// - key dinámica: Incluye posición y tamaño para reconstruir la caja al instante si cambias medidas en desarrollo.
export default function IslandColliders() {
  return ISLANDS.map((island) => (
    <RigidBody
      key={island.id}
      name={`island-${island.id}`}
      type="fixed"
      colliders={false}
      position={[island.position[0], 0, island.position[2]]}
    >
      {island.colliders.map((collider, index) => {
        const { position, halfExtents } = resolveCollider(collider);
        return (
          <CuboidCollider
            key={`${collider.label ?? index}:${position.join(",")}:${halfExtents.join(",")}`}
            args={halfExtents}
            position={position}
          />
        );
      })}
    </RigidBody>
  ));
}