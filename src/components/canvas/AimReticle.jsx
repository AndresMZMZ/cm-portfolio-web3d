import { BULLET } from "@/config/bullets";
import { useBulletStore } from "@/store/useBulletStore";
import { MODES, useGameStore } from "@/store/useGameStore";
import { GRAVITY, getFlightTime } from "@/utils/ballistics";
import { getMuzzle } from "@/utils/cannons";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Retícula del modo cañones (HU13): línea con la trayectoria y anillo donde caería la bala en el agua.
// Solo se ve en combate. Debe ir dentro del <Canvas>.
// Nombres en inglés: reticle (retícula), trajectory (trayectoria), ring (anillo), muzzle (boca del cañón), landing (aterrizaje).
export default function AimReticle() {
  const scene = useThree((state) => state.scene);
  const ringRef = useRef();
  const muzzle = useMemo(() => ({ position: new THREE.Vector3(), direction: new THREE.Vector3() }), []);

  // La línea se crea una vez y se reescribe cada frame; depthTest en false para que se vea sobre las olas.
  const trajectory = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(BULLET.reticlePoints * 3), 3));
    const material = new THREE.LineBasicMaterial({
      color: BULLET.reticleColor,
      transparent: true,
      opacity: 0.8,
      depthTest: false,
    });
    const line = new THREE.Line(geometry, material);
    line.frustumCulled = false; // Sus puntos cambian cada frame, el cálculo de visibilidad inicial no sirve
    line.renderOrder = 10;
    line.visible = false;
    return line;
  }, []);

  useEffect(
    () => () => {
      trajectory.geometry.dispose();
      trajectory.material.dispose();
    },
    [trajectory],
  );

  useFrame(() => {
    const { mode, combatSide } = useGameStore.getState();
    const ship = mode === MODES.COMBAT && combatSide ? scene.getObjectByName("ship") : null;
    trajectory.visible = !!ship;
    if (ringRef.current) ringRef.current.visible = !!ship;
    if (!ship) return;

    const { aim } = useBulletStore.getState();
    const { position, direction } = getMuzzle(ship, combatSide, aim.elevation, aim.yaw, muzzle);
    const vx = direction.x * BULLET.speed;
    const vy = direction.y * BULLET.speed;
    const vz = direction.z * BULLET.speed;
    const flightTime = getFlightTime(vy, position.y);

    // Posición en el instante t: p0 + v*t - 0.5*g*t² (solo cae el eje Y)
    const positions = trajectory.geometry.attributes.position;
    const last = BULLET.reticlePoints - 1;
    for (let i = 0; i <= last; i++) {
      const t = (i / last) * flightTime;
      positions.setXYZ(
        i,
        position.x + vx * t,
        position.y + vy * t - 0.5 * GRAVITY * t * t,
        position.z + vz * t,
      );
    }
    positions.needsUpdate = true;

    if (ringRef.current) {
      ringRef.current.position.set(
        position.x + vx * flightTime,
        BULLET.seaLevel + 0.3, // Un poco sobre el nivel del mar para que no parpadee con el agua
        position.z + vz * flightTime,
      );
    }
  });

  return (
    <>
      <primitive object={trajectory} />
      <mesh ref={ringRef} rotation-x={-Math.PI / 2} renderOrder={10} visible={false}>
        <ringGeometry args={[BULLET.reticleRingInner, BULLET.reticleRingOuter, 32]} />
        <meshBasicMaterial
          color={BULLET.reticleColor}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          depthTest={false}
        />
      </mesh>
    </>
  );
}