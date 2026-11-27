import { BULLET } from "@/config/bullets";
import { useBulletStore } from "@/store/useBulletStore";
import { getMuzzle } from "@/utils/cannons";
import { sampleWave } from "@/utils/waves";
import { useFrame, useThree } from "@react-three/fiber";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

// Motor de balas (HT06): cada bala es un cuerpo dinámico de Rapier que cae por gravedad y avisa cuando choca.
// Debe ir dentro de <Physics> (clase 07). HU13 llamará a fireBullet con getMuzzle; HU14 y HU15 leerán los impactos.
// Nombres en inglés: Bullet (bala), ImpactMarker (marcador de impacto), land (aterrizar/impactar), age (edad).
const IMPACT_DURATION = 0.6; // Segundos que dura el destello de un impacto

function Bullet({ bullet }) {
  const bodyRef = useRef();
  const age = useRef(0); // Segundos de vida acumulados
  const done = useRef(false); // Evita registrar dos veces el mismo impacto
  const wave = useRef({ height: 0, slopeX: 0, slopeZ: 0 }); // Altura de la ola bajo la bala

  // Registra el impacto en la posición actual de la bala y la retira.
  const land = (kind, target) => {
    const body = bodyRef.current;
    if (!body || done.current) return;
    done.current = true;
    const p = body.translation();
    useBulletStore.getState().addImpact({ position: [p.x, p.y, p.z], kind, target });
    useBulletStore.getState().removeBullet(bullet.id);
  };

  useFrame((state, delta) => {
    const body = bodyRef.current;
    if (!body || done.current) return;
    age.current += delta;
    const p = body.translation();
    // Caída al mar: el océano es un plano de shader sin colisionador, así que se compara la altura con la de la ola.
    const surface =
      BULLET.seaLevel + sampleWave(p.x, p.z, state.clock.elapsedTime, wave.current).height;
    if (p.y <= surface) land("sea", "sea");
    else if (age.current >= BULLET.lifetime) {
      done.current = true;
      useBulletStore.getState().removeBullet(bullet.id);
    }
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

// Destello que se agranda y se desvanece en el punto de impacto: azul claro en el mar, naranja en tierra u objetos.
function ImpactMarker({ impact }) {
  const meshRef = useRef();
  const age = useRef(0);
  const color = impact.kind === "sea" ? "#cfe8ff" : "#ff9a3c";

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    age.current += delta;
    const t = age.current / IMPACT_DURATION;
    if (t >= 1) {
      useBulletStore.getState().removeImpact(impact.id);
      return;
    }
    mesh.scale.setScalar(BULLET.radius * (1 + 5 * t));
    mesh.material.opacity = 0.8 * (1 - t);
  });

  return (
    <mesh ref={meshRef} position={impact.position}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} depthWrite={false} />
    </mesh>
  );
}

export default function Bullets() {
  const bullets = useBulletStore((s) => s.bullets);
  const impacts = useBulletStore((s) => s.impacts);
  const scene = useThree((s) => s.scene);

  // SOLO EN DESARROLLO: prueba de disparo mientras no existe el modo cañones (HU13).
  // B dispara por estribor (derecha) y V por babor (izquierda), con el barco en cualquier modo.
  // Se elimina cuando HU13 conecte la barra espaciadora.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const onKeyDown = (event) => {
      if (event.repeat) return;
      const side = event.code === "KeyB" ? "right" : event.code === "KeyV" ? "left" : null;
      const ship = scene.getObjectByName("ship");
      if (!side || !ship) return;
      const { position, direction } = getMuzzle(ship, side);
      useBulletStore.getState().fireBullet(position.toArray(), direction.toArray());
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scene]);

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
