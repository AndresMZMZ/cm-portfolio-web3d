import { BULLET } from "@/config/bullets";
import { useBulletStore } from "@/store/useBulletStore";
import { sampleWave } from "@/utils/waves";
import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

// Motor de balas (HT06): cada bala es un cuerpo dinámico de Rapier que cae por gravedad y avisa cuando choca.
// Debe ir dentro de <Physics> (clase 07). HU13 llamará a fireBullet con getMuzzle; HU14 y HU15 leerán los impactos.
// Nombres en inglés: Bullet (bala), ImpactMarker (marcador de impacto), land (aterrizar/impactar), age (edad).
function Bullet({ bullet }) {
  const bodyRef = useRef();
  const age = useRef(0); // Segundos de vida acumulados
  const done = useRef(false); // Evita registrar dos veces el mismo impacto
  const wave = useRef({ height: 0, slopeX: 0, slopeZ: 0 }); // Altura de la ola bajo la bala
  const previousWave = useRef({ height: 0, slopeX: 0, slopeZ: 0 });
  const previousPosition = useRef(null);

  // Registra el impacto en su punto de contacto y retira la bala.
  const land = (kind, target, impactPosition) => {
    const body = bodyRef.current;
    if (!body || done.current) return;
    done.current = true;
    const p = body.translation();
    useBulletStore.getState().addImpact({
      position: impactPosition ?? [p.x, p.y, p.z],
      kind,
      target,
    });
    useBulletStore.getState().removeBullet(bullet.id);
  };

  useFrame((state, delta) => {
    const body = bodyRef.current;
    if (!body || done.current) return;
    age.current += delta;
    const p = body.translation();
    // El océano no tiene collider; se detecta el cruce entre la superficie de dos frames.
    const surface =
      BULLET.seaLevel + sampleWave(p.x, p.z, state.clock.elapsedTime, wave.current).height;
    const previous = previousPosition.current;
    if (!previous) {
      previousPosition.current = {
        x: p.x,
        y: p.y,
        z: p.z,
        time: state.clock.elapsedTime,
      };
      if (p.y <= surface) land("sea", "sea", [p.x, surface, p.z]);
      return;
    }

    const previousSurface =
      BULLET.seaLevel +
      sampleWave(
        previous.x,
        previous.z,
        previous.time,
        previousWave.current,
      ).height;
    const previousClearance = previous.y - previousSurface;
    const currentClearance = p.y - surface;
    if (currentClearance <= 0) {
      if (previousClearance > 0) {
        const fraction =
          previousClearance / (previousClearance - currentClearance);
        land("sea", "sea", [
          previous.x + (p.x - previous.x) * fraction,
          previousSurface + (surface - previousSurface) * fraction,
          previous.z + (p.z - previous.z) * fraction,
        ]);
      } else {
        land("sea", "sea", [p.x, surface, p.z]);
      }
      return;
    }
    if (age.current >= (bullet.ttl ?? BULLET.minimumLifetime)) {
      done.current = true;
      useBulletStore.getState().removeBullet(bullet.id);
      return;
    }

    previous.x = p.x;
    previous.y = p.y;
    previous.z = p.z;
    previous.time = state.clock.elapsedTime;
  });

  // Colisión con otro cuerpo: se ignoran el propio barco y otras balas; lo demás cuenta como impacto.
  const handleCollision = ({ other }) => {
    const name = other.rigidBodyObject?.name ?? "";
    if (name === "ship" || name === "bullet") return;
    if (name.startsWith("island-")) land("island", name);
    else if (name.startsWith("world-")) land("bounds", name);
    else land("object", name);
  };

  // colliders={false} y BallCollider: una esfera exacta, sin colisionadores automáticos (clase 07).
  // linearVelocity y gravityScale también son de la clase 07. La clase advierte que un objeto muy veloz puede atravesar
  // una pared; con speed 300 y radio 3 no ocurre (comprobado hasta 450). Si subes BULLET.speed por encima de eso, agrega ccd.
  return (
    <RigidBody
      ref={bodyRef}
      name="bullet"
      position={bullet.position}
      linearVelocity={bullet.velocity}
      colliders={false}
      gravityScale={BULLET.gravityScale}
      canSleep={false}
      onCollisionEnter={handleCollision}
    >
      <BallCollider args={[BULLET.radius]} restitution={0} />
      <mesh castShadow>
        <sphereGeometry args={[BULLET.radius, 14, 14]} />
        <meshStandardMaterial color="#1c1c1f" metalness={0.8} roughness={0.35} />
      </mesh>
    </RigidBody>
  );
}

// X breve en la posición real de impacto, visible sobre el mar y los objetos.
function ImpactMarker({ impact }) {
  const age = useRef(0);
  const removed = useRef(false);
  const color = impact.kind === "sea" ? "#00e5ff" : "#ff4949";

  useFrame((_, delta) => {
    age.current += delta;
    if (age.current >= BULLET.impactMarkerDuration && !removed.current) {
      removed.current = true;
      useBulletStore.getState().removeImpact(impact.id);
    }
  });

  return (
    <group
      position={[impact.position[0], impact.position[1] + 0.6, impact.position[2]]}
      rotation-x={-Math.PI / 2}
    >
      <mesh rotation-z={Math.PI / 4}>
        <boxGeometry args={[BULLET.impactMarkSize, 0.8, 0.8]} />
        <meshBasicMaterial color={color} depthWrite={false} />
      </mesh>
      <mesh rotation-z={-Math.PI / 4}>
        <boxGeometry args={[BULLET.impactMarkSize, 0.8, 0.8]} />
        <meshBasicMaterial color={color} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function Bullets() {
  const bullets = useBulletStore((s) => s.bullets);
  const impacts = useBulletStore((s) => s.impacts);

  return (
    <>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} bullet={bullet} />
      ))}
      {impacts.map((impact) => (
        <ImpactMarker key={impact.id} impact={impact} />
      ))}
    </>
  );
}
