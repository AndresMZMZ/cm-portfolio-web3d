import { CAMERA } from "@/config/camera";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Seguimiento de cámara en el barco:
// - CAMERA.offset (Desplazamiento): Define la distancia fija y la posición relativa de la cámara con respecto al barco (ej. detrás y arriba).
// - lookAhead (Anticipación de vista): Hace que la cámara apunte un poco más adelante hacia donde avanza el barco, permitiendo ver los obstáculos a tiempo.
// - lookHeight (Altura de la mira): Controla la altura vertical del punto al que apunta
//   el objetivo (si enfoca directo al casco, al mástil o hacia el horizonte).

export default function FollowCamera() {
  // Acceso a la escena para localizar el barco que la cámara debe seguir.
  const scene = useThree((s) => s.scene);
  // Referencia al barco y estado para colocar la cámara directamente en el primer fotograma.
  const shipRef = useRef(null);
  const ready = useRef(false);
  // Vectores reutilizados en cada fotograma para evitar crear objetos continuamente.
  const v = useMemo(
    () => ({
      offset: new THREE.Vector3(),
      desired: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      lookTarget: new THREE.Vector3(),
      lookCurrent: new THREE.Vector3(),
    }),
    [],
  );

  useFrame(({ camera }, delta) => {
    // Busca el barco por su nombre; Ship.jsx lo registra como "ship".
    if (!shipRef.current)
      shipRef.current = scene.getObjectByName("ship") ?? null;
    const ship = shipRef.current;
    if (!ship) return;

    // Calcula la posición detrás y arriba del barco según su orientación y CAMERA.offset.
    v.offset.set(...CAMERA.offset).applyQuaternion(ship.quaternion);
    v.desired.copy(ship.position).add(v.offset);
    // Calcula el punto de enfoque por delante de la proa y ajusta su altura.
    v.forward.set(0, 0, -1).applyQuaternion(ship.quaternion);
    v.lookTarget
      .copy(ship.position)
      .addScaledVector(v.forward, CAMERA.lookAhead);
    v.lookTarget.y += CAMERA.lookHeight;

    if (!ready.current) {
      // Primer fotograma: coloca la cámara de inmediato para evitar que llegue desde otra posición.
      camera.position.copy(v.desired);
      v.lookCurrent.copy(v.lookTarget);
      ready.current = true;
    } else {
      // El docente suaviza el movimiento usando un factor fijo por fotograma (clase 2).
      // Aquí se reemplaza por la fórmula de amortiguación exponencial: 1 - exp(-Factor * delta).
      // Donde "Factor" (la 'k' matemática) es el nivel de suavizado y "delta" es el tiempo real por frame.
      // Esto garantiza que la cámara mantenga exactamente la misma fluidez y velocidad
      // tanto en pantallas estándar de 60Hz como en monitores de alta frecuencia (144Hz o más).
      camera.position.lerp(
        v.desired,
        1 - Math.exp(-CAMERA.followDamping * delta),
      );
      v.lookCurrent.lerp(
        v.lookTarget,
        1 - Math.exp(-CAMERA.lookDamping * delta),
      );
    }
    // Orienta la cámara hacia el punto de enfoque suavizado.
    camera.lookAt(v.lookCurrent);
  });

  return null;
}