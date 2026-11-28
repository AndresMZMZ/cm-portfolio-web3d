import { CAMERA } from "@/config/camera";
import { MODES, useGameStore } from "@/store/useGameStore";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Seguimiento de cámara al barco:
// - CAMERA.offset (Desplazamiento): Define la distancia fija y la posición relativa de la cámara con respecto al barco (ej. detrás/arriba).
// - lookAhead (Anticipación de vista): la cámara apunte un poco más adelante hacia donde avanza el barco, permitiendo ver los obstáculos a tiempo.
// - lookHeight (Altura de la mira): Controla la altura del punto al que enfoca la cámara, para que no mire directo al casco del barco 
// sino un poco más arriba (ej. mástil horizonte  o hacia el horizonte).

// Ejes y ángulos fijos del modo cañones (HU13). Nombres en inglés: Y_AXIS (eje vertical), QUARTER_TURN (cuarto de vuelta = 90 grados).
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const QUARTER_TURN = Math.PI / 2;

export default function FollowCamera() {
  // Acceso a la escena para localizar el barco, y la cámara sepa que debe seguir.
  const scene = useThree((s) => s.scene);
  // Referencia al barco y estado para colocar la cámara directamente en el primer fotograma.
  const shipRef = useRef(null);
  const ready = useRef(false);
  // Vectores reutilizados en cada fotograma para evitar crear objetos continuamente.
  const vectors = useRef({
    offset: new THREE.Vector3(),
    desired: new THREE.Vector3(),
    forward: new THREE.Vector3(),
    lookTarget: new THREE.Vector3(),
    lookCurrent: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(), // Orientación de la cámara: la del barco más el giro hacia el costado activo (babor o estribor)
  });
  // Ángulo con el que la cámara rodea al barco (radianes): 0 = detrás del barco (navegación),
  // -90 grados = mira hacia estribor (derecha), +90 grados = mira hacia babor (izquierda). Se suaviza cada fotograma.
  const sideAngle = useRef(0);

  // Bucle de animación: cada fotograma, la cámara sigue al barco suavemente.
  useFrame(({ camera }, delta) => {
    // Busca el barco por su nombre; Ship.jsx lo registra como "ship".
    if (!shipRef.current)
      shipRef.current = scene.getObjectByName("ship") ?? null;
    const ship = shipRef.current;
    if (!ship) return;

    // Calcula la posición detrás y arriba del barco según su orientación y CAMERA.offset.
    const v = vectors.current;

    // MODO CAÑONES (HU13): en combate la cámara rodea al barco hasta quedar del lado contrario al costado activo y mira hacia él.
    // Con la cámara mirando a estribor, la derecha de la pantalla es la popa; en babor es la proa (CombatControls.jsx usa lo mismo).
    const { mode, combatSide } = useGameStore.getState();
    const targetAngle =
      mode === MODES.COMBAT && combatSide
        ? combatSide === "right"
          ? -QUARTER_TURN
          : QUARTER_TURN
        : 0;
    // Mismo suavizado exponencial de abajo: el giro dura lo mismo con cualquier cantidad de FPS.
    sideAngle.current +=
      (targetAngle - sideAngle.current) *
      (1 - Math.exp(-CAMERA.sideDamping * delta));
    // blend (mezcla): 0 = ajustes de navegación, 1 = ajustes de combate; evita saltos al entrar y salir.
    const blend = Math.min(1, Math.abs(sideAngle.current) / QUARTER_TURN);
    // Orientación = giro del barco + giro hacia el costado. premultiply aplica primero el giro lateral y luego el del barco.
    v.quaternion
      .setFromAxisAngle(Y_AXIS, sideAngle.current)
      .premultiply(ship.quaternion);
    const { lerp } = THREE.MathUtils;
    const combat = CAMERA.combat;

    // Calcula la posición detrás y arriba del barco según su orientación y CAMERA.offset.
    v.offset
      .set(
        lerp(CAMERA.offset[0], combat.offset[0], blend),
        lerp(CAMERA.offset[1], combat.offset[1], blend),
        lerp(CAMERA.offset[2], combat.offset[2], blend),
      )
      .applyQuaternion(v.quaternion);

    v.desired.copy(ship.position).add(v.offset);
    // Calcula el punto de enfoque por delante de la proa y ajusta su altura.
    v.forward.set(0, 0, -1).applyQuaternion(v.quaternion);
    v.lookTarget
      .copy(ship.position)
      .addScaledVector(v.forward, lerp(CAMERA.lookAhead, combat.lookAhead, blend));
    v.lookTarget.y += lerp(CAMERA.lookHeight, combat.lookHeight, blend);

    if (!ready.current) {
      // Primer fotograma: coloca la cámara de inmediato para evitar que llegue desde otra posición.
      camera.position.copy(v.desired);
      v.lookCurrent.copy(v.lookTarget);
      ready.current = true;
    } else {
      // El profesor suaviza el movimiento usando un factor fijo por fotograma (clase 2).
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