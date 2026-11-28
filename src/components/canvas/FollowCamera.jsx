import { CAMERA } from "@/config/camera";
import { MODES, useGameStore } from "@/store/useGameStore";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Seguimiento de cámara al barco:
// - CAMERA.offset (Desplazamiento): Define la distancia fija y la posición relativa de la cámara con respecto al barco (ej. detrás/arriba).
// - lookAhead (Anticipación de vista): la cámara apunte un poco más adelante hacia donde avanza el barco, permitiendo ver los obstáculos a tiempo.
// - lookHeight (Altura de la mira): Controla la altura del punto al que enfoca la cámara, para que no mire directo al casco del barco 
// sino un poco más arriba (ej. mástil horizonte  o hacia el horizonte).

// Ejes y ángulos fijos del modo cañones (HU13). Nombres en inglés: Y_AXIS (eje vertical), QUARTER_TURN (cuarto de vuelta = 90 grados).
const QUARTER_TURN = Math.PI / 2;
const NORMAL_OFFSET = new THREE.Spherical().setFromVector3(
  new THREE.Vector3(...CAMERA.offset),
);
const COMBAT_OFFSET = new THREE.Spherical().setFromVector3(
  new THREE.Vector3(...CAMERA.combat.offset),
);

export default function FollowCamera() {
  // Acceso a la escena para localizar el barco, y la cámara sepa que debe seguir.
  const scene = useThree((s) => s.scene);
  const domElement = useThree((s) => s.gl.domElement);
  // Referencia al barco y estado para colocar la cámara directamente en el primer fotograma.
  const shipRef = useRef(null);
  const ready = useRef(false);
  const orbit = useRef({
    yaw: 0,
    polar: NORMAL_OFFSET.phi,
    zoom: 1,
  });
  // Vectores reutilizados en cada fotograma para evitar crear objetos continuamente.
  const vectors = useRef({
    offset: new THREE.Vector3(),
    desired: new THREE.Vector3(),
    lookTarget: new THREE.Vector3(),
    lookCurrent: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(), // Orientación de la cámara: la del barco más el giro hacia el costado activo (babor o estribor)
    spherical: new THREE.Spherical(),
  });
  // Ángulo con el que la cámara rodea al barco (radianes): 0 = detrás del barco (navegación),
  // -90 grados = mira hacia estribor (derecha), +90 grados = mira hacia babor (izquierda). Se suaviza cada fotograma.
  const sideAngle = useRef(0);

  useEffect(() => {
    let pointerId = null;
    let lastX = 0;
    let lastY = 0;

    const handlePointerDown = (event) => {
      if (event.button !== 0 || !event.isPrimary) return;
      pointerId = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      domElement.setPointerCapture(pointerId);
    };

    const handlePointerMove = (event) => {
      if (event.pointerId !== pointerId) return;
      const { orbitSpeed, minPolarAngle, maxPolarAngle } = CAMERA;
      orbit.current.yaw -= (event.clientX - lastX) * orbitSpeed;
      orbit.current.polar = THREE.MathUtils.clamp(
        orbit.current.polar + (event.clientY - lastY) * orbitSpeed,
        minPolarAngle,
        maxPolarAngle,
      );
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const releasePointer = (event) => {
      if (event.pointerId !== pointerId) return;
      if (domElement.hasPointerCapture(pointerId)) {
        domElement.releasePointerCapture(pointerId);
      }
      pointerId = null;
    };

    const handleWheel = (event) => {
      event.preventDefault();
      orbit.current.zoom = THREE.MathUtils.clamp(
        orbit.current.zoom * Math.exp(event.deltaY * CAMERA.zoomSpeed),
        CAMERA.minDistance / NORMAL_OFFSET.radius,
        CAMERA.maxDistance / NORMAL_OFFSET.radius,
      );
    };

    domElement.addEventListener("pointerdown", handlePointerDown);
    domElement.addEventListener("pointermove", handlePointerMove);
    domElement.addEventListener("pointerup", releasePointer);
    domElement.addEventListener("pointercancel", releasePointer);
    domElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      domElement.removeEventListener("pointerdown", handlePointerDown);
      domElement.removeEventListener("pointermove", handlePointerMove);
      domElement.removeEventListener("pointerup", releasePointer);
      domElement.removeEventListener("pointercancel", releasePointer);
      domElement.removeEventListener("wheel", handleWheel);
    };
  }, [domElement]);

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
        ? combatSide === "stern"
          ? Math.PI
          : combatSide === "right"
            ? -QUARTER_TURN
            : QUARTER_TURN
        : 0;
    // Mismo suavizado exponencial de abajo: el giro dura lo mismo con cualquier cantidad de FPS.
    sideAngle.current +=
      (targetAngle - sideAngle.current) *
      (1 - Math.exp(-CAMERA.sideDamping * delta));
    const blend = Math.min(1, Math.abs(sideAngle.current) / QUARTER_TURN);
    const polar = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(NORMAL_OFFSET.phi, COMBAT_OFFSET.phi, blend) +
        (orbit.current.polar - NORMAL_OFFSET.phi),
      CAMERA.minPolarAngle,
      CAMERA.maxPolarAngle,
    );
    v.spherical.set(
      THREE.MathUtils.lerp(
        NORMAL_OFFSET.radius,
        COMBAT_OFFSET.radius,
        blend,
      ) * orbit.current.zoom,
      polar,
      THREE.MathUtils.lerp(
        NORMAL_OFFSET.theta,
        COMBAT_OFFSET.theta,
        blend,
      ) +
        sideAngle.current +
        orbit.current.yaw,
    );
    v.quaternion.copy(ship.quaternion);
    v.offset.setFromSpherical(v.spherical).applyQuaternion(v.quaternion);

    v.desired.copy(ship.position).add(v.offset);
    v.lookTarget.copy(ship.position);
    v.lookTarget.y += CAMERA.focusHeight;

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