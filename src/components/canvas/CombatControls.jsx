import { BULLET } from "@/config/bullets";
import { useBulletStore } from "@/store/useBulletStore";
import { MODES, useGameStore } from "@/store/useGameStore";
import { getMuzzle } from "@/utils/cannons";
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
  const lastShot = useRef(-Infinity); // Instante del último disparo, en segundos

  // Mira: W/S cambian la elevación y A/D giran el tiro. Se usa delta para que la rapidez no dependa de los FPS (clase 4).
  useFrame((_, delta) => {
    const { mode, combatSide } = useGameStore.getState();
    if (mode !== MODES.COMBAT || !combatSide) return;
    const { targetUp, targetDown, targetLeft, targetRight } = get();
    const lift = (targetUp ? 1 : 0) - (targetDown ? 1 : 0);
    const turn = (targetRight ? 1 : 0) - (targetLeft ? 1 : 0);
    if (!lift && !turn) return;

    const { aim, setAim } = useBulletStore.getState();
    // Con la cámara mirando hacia el lado activo, la derecha de la pantalla es la popa en estribor y la proa en babor.
    const yawSign = combatSide === "right" ? -1 : 1;
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

  // Disparo con Espacio: solo en combate y respetando el tiempo de recarga.
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
          const { aim, fireBullet } = useBulletStore.getState();
          const { position, direction } = getMuzzle(ship, combatSide, aim.elevation, aim.yaw);
          fireBullet(position.toArray(), direction.toArray());
          lastShot.current = now;
        },
      ),
    [subscribe, scene],
  );

  return null;
}