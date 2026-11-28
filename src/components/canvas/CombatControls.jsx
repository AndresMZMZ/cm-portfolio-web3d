import { BULLET } from "@/config/bullets";
import { useBulletStore } from "@/store/useBulletStore";
import { MODES, useGameStore } from "@/store/useGameStore";
import { getSalvoShots } from "@/utils/cannons";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Controles del modo cañones (HU13): mover la mira con W/A/S/D y disparar con Espacio.
// No dibuja nada: solo lee el teclado y actualiza la mira en useBulletStore. Debe ir dentro del <Canvas>.
// Nombres en inglés: aim (mira), elevation (elevación), yaw (giro lateral), lastShot (último disparo), lift (subir), turn (girar).
export default function CombatControls() {
  const [subscribe, get] = useKeyboardControls();
  const scene = useThree((state) => state.scene);
  const domElement = useThree((state) => state.gl.domElement);
  const lastShot = useRef(-Infinity); // Instante del último disparo, en segundos
  const clockTime = useRef(0);

  useEffect(() => {
    let pointerId = null;
    let lastY = 0;

    const handlePointerDown = (event) => {
      if (event.button !== 2 || !event.isPrimary) return;
      if (useGameStore.getState().mode !== MODES.COMBAT) return;
      pointerId = event.pointerId;
      lastY = event.clientY;
      domElement.setPointerCapture(pointerId);
      event.preventDefault();
    };

    const handlePointerMove = (event) => {
      if (event.pointerId !== pointerId) return;
      const { mode } = useGameStore.getState();
      if (mode !== MODES.COMBAT) return;
      const deltaY = event.clientY - lastY;
      lastY = event.clientY;
      const { aim, setAim } = useBulletStore.getState();
      setAim({
        ...aim,
        elevation: THREE.MathUtils.clamp(
          aim.elevation - deltaY * BULLET.mouseAimSpeed,
          BULLET.minElevation,
          BULLET.maxElevation,
        ),
      });
    };

    const releasePointer = (event) => {
      if (event.pointerId !== pointerId) return;
      if (domElement.hasPointerCapture(pointerId)) {
        domElement.releasePointerCapture(pointerId);
      }
      pointerId = null;
    };

    const handleContextMenu = (event) => {
      if (useGameStore.getState().mode === MODES.COMBAT) event.preventDefault();
    };

    domElement.addEventListener("pointerdown", handlePointerDown);
    domElement.addEventListener("pointermove", handlePointerMove);
    domElement.addEventListener("pointerup", releasePointer);
    domElement.addEventListener("pointercancel", releasePointer);
    domElement.addEventListener("contextmenu", handleContextMenu);

    return () => {
      domElement.removeEventListener("pointerdown", handlePointerDown);
      domElement.removeEventListener("pointermove", handlePointerMove);
      domElement.removeEventListener("pointerup", releasePointer);
      domElement.removeEventListener("pointercancel", releasePointer);
      domElement.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [domElement]);

  // Mira: W/S cambian la elevación y A/D giran el tiro. Se usa delta para que la rapidez no dependa de los FPS (clase 4).
  useFrame((state, delta) => {
    clockTime.current = state.clock.elapsedTime;
    const { mode, combatSide } = useGameStore.getState();
    if (mode !== MODES.COMBAT || !combatSide) return;
    const { targetUp, targetDown, targetLeft, targetRight } = get();
    const lift = (targetUp ? 1 : 0) - (targetDown ? 1 : 0);
    const turn = (targetRight ? 1 : 0) - (targetLeft ? 1 : 0);
    if (!lift && !turn) return;

    const { aim, setAim } = useBulletStore.getState();
    // Con la cámara mirando hacia el lado activo, la derecha de la pantalla es la popa en estribor y la proa en babor.
    const yawSign =
      combatSide === "right" || combatSide === "stern" ? -1 : 1;
    setAim({
      elevation: THREE.MathUtils.clamp(
        aim.elevation + lift * BULLET.elevationSpeed * delta,
        BULLET.minElevation,
        BULLET.maxElevation,
      ),
      yaw: THREE.MathUtils.clamp(
        aim.yaw + turn * yawSign * BULLET.aimYawSpeed * delta,
        -BULLET.aimYawLimit,
        BULLET.aimYawLimit,
      ),
    });
  });

  // Al cambiar de lado (Q/E) el giro lateral vuelve al centro del costado; la elevación se conserva.
  useEffect(
    () =>
      useGameStore.subscribe((state, previous) => {
        if (state.combatSide === previous.combatSide) return;
        const { aim, setAim } = useBulletStore.getState();
        setAim({ ...aim, yaw: 0 });
      }),
    [],
  );

  // Espacio programa una salva y respeta el tiempo de recarga entre descargas.
  useEffect(
    () =>
      subscribe(
        (state) => state.fire,
        (pressed) => {
          if (!pressed) return;
          const { mode, combatSide } = useGameStore.getState();
          if (mode !== MODES.COMBAT || !combatSide) return;
          const now = performance.now() / 1000;
          if (now - lastShot.current < BULLET.reloadTime) return;
          const ship = scene.getObjectByName("ship");
          if (!ship) return;
          const { aim, scheduleSalvo } = useBulletStore.getState();
          const salvoShots = getSalvoShots(
            ship,
            combatSide,
            aim.elevation,
            aim.yaw,
          );
          const startedAt = performance.now() / 1000;
          const shots = salvoShots.map((shot, index) => ({
            ...shot,
            fireAt: startedAt + index * BULLET.salvoInterval,
            launchTime:
              clockTime.current + index * BULLET.salvoInterval,
          }));
          scheduleSalvo(shots);
          lastShot.current = now;
        },
      ),
    [subscribe, scene],
  );

  return null;
}