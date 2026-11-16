import { BarcoPrueba } from "@/components/canvas/models/BarcoPrueba";
import { SHIP, SHIP_SPAWN_POSITION } from "@/config/ship";
import { WORLD } from "@/config/world";
import { MODES, useGameStore } from "@/store/useGameStore";
import { updateIslandProximity } from "@/utils/islandProximity";
import { sampleWave } from "@/utils/waves";
import { Center, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

// Controla el barco en la escena: movimiento, giros, posición inicial y altura sobre el agua.
// Sus valores ajustables se encuentran en config/ship.js.

// Si el barco avanza "de lado", cambia este valor a 0, Math.PI / 2, Math.PI o -Math.PI / 2
const MODEL_YAW_OFFSET = Math.PI / 2;

function isValidPosition({ x, y, z }) {
  const { left, right, back, front, bottom, top } = WORLD.bounds;
  return (
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    Number.isFinite(z) &&
    x >= left &&
    x <= right &&
    y >= bottom &&
    y <= top &&
    z >= back &&
    z <= front
  );
}

// Se mantiene separado del archivo generado del modelo para que regenerarlo no borre esta lógica.
export default function Ship() {
  // Referencia que, permite modificar su posición y rotación barco.
  const shipRef = useRef();
  const [, get] = useKeyboardControls(); // Hook de Drei para escuchar las teclas del teclado en tiempo real.

  const vectors = useRef({
    forward: new THREE.Vector3(), // Vector de avance hacia adelante (-Z)
    quaternion: new THREE.Quaternion(), // Orientación del barco (valores: x, y, z, w). Evita bloqueos de giro y conecta la rotación con Rapier.
    euler: new THREE.Euler(), // rotación del barco en los 3 ángulos (X, Y, Z en radianes)
  });
  // Rumbo o (yaw) del barco: giro horizontal IZ/DR sobre el eje Y en radianes (0 = mirando al frente).
  const yaw = useRef(0);
  const swayRef = useRef(); // Grupo visual que sube, baja y se inclina; el cuerpo físico de Rapier no se mueve.
  const wave = useRef({ height: 0, slopeX: 0, slopeZ: 0 }); // Altura y pendiente de la ola en la posición del barco
  const lastSafePosition = useRef(new THREE.Vector3(...SHIP_SPAWN_POSITION));
  const contactNormals = useRef(new Map());

  // BUCLE DE ANIMACIÓN (useFrame): Se ejecuta en cada fotograma
  useFrame((state, delta) => {
    const body = shipRef.current;
    // Si el barco aún no se ha montado en la escena, detiene la ejecución para evitar errores.
    if (!body) return;
    const position = body.translation();
    const restoreSafePosition = () => {
      body.setTranslation(lastSafePosition.current, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      if (!Number.isFinite(yaw.current)) yaw.current = 0;
      const { quaternion, euler } = vectors.current;
      quaternion.setFromEuler(euler.set(0, yaw.current, 0));
      body.setRotation(quaternion, true);
      contactNormals.current.clear();
    };

    if (!isValidPosition(position)) {
      restoreSafePosition();
      return;
    }
    lastSafePosition.current.set(position.x, position.y, position.z);

    const elapsedTime = state.clock.elapsedTime;
    if (!Number.isFinite(elapsedTime)) {
      restoreSafePosition();
      return;
    }
    // VAIVÉN CON EL OLEAJE (HU08): sincroniza la altura y pendiente con el shader de Ocean.jsx.
    const w = sampleWave(position.x, position.z, elapsedTime, wave.current);
    if (
      !Number.isFinite(w.height) ||
      !Number.isFinite(w.slopeX) ||
      !Number.isFinite(w.slopeZ)
    ) {
      restoreSafePosition();
      return;
    }
    const sway = swayRef.current;
    if (sway) {
      const forwardX = -Math.sin(yaw.current);
      const forwardZ = -Math.cos(yaw.current);
      const starboardX = Math.cos(yaw.current);
      const starboardZ = -Math.sin(yaw.current);
      sway.position.y = w.height * SHIP.swayHeave;
      sway.rotation.x =
        (w.slopeX * forwardX + w.slopeZ * forwardZ) * SHIP.swayPitch;
      sway.rotation.z =
        (w.slopeX * starboardX + w.slopeZ * starboardZ) * SHIP.swayRoll;
    }
    // FILTRO DE ESTADO: El barco solo se mueve en modo navegación si el jugador está en un menú,(estado único de la HT04)
    if (useGameStore.getState().mode !== MODES.NAVIGATION) {
      body.setLinvel({ x: 0, y: 0, z: 0 }, true); // Detiene el movimiento lineal del barco
      return;
    }
    if (!Number.isFinite(delta)) {
      restoreSafePosition();
      return;
    }
    // Lee las teclas configuradas para generar el movimiento de navegación.
    const { forward, back, left, right } = get();
    // CÁLCULO DE VELOCIDAD CON FRENADO AUTOMÁTICO:
    // Entre más cerca esté de una isla, el barco se vera obligando a desacelerar.
    const speed = SHIP.speed * updateIslandProximity(position);
    const direction = (forward ? 1 : 0) - (back ? 1 : 0); // dirección de avance: 1 = adelante, -1 = atrás, 0 = detenido
    const turn = (left ? 1 : 0) - (right ? 1 : 0);

    // No teletransporta la cápsula en plena colisión; espera a que el solver libere el contacto.
    const v = vectors.current;
    if (contactNormals.current.size === 0) {
      yaw.current += SHIP.turnSpeed * turn * delta;
      v.quaternion.setFromEuler(v.euler.set(0, yaw.current, 0));
      body.setRotation(v.quaternion, true);
    }
    v.quaternion.setFromEuler(v.euler.set(0, yaw.current, 0));
    v.forward.set(0, 0, -1).applyQuaternion(v.quaternion);
    const velocity = {
      x: v.forward.x * speed * direction,
      y: 0,
      z: v.forward.z * speed * direction,
    };
    for (const normal of contactNormals.current.values()) {
      const intoContact = velocity.x * normal.x + velocity.z * normal.z;
      if (intoContact < 0) {
        velocity.x -= intoContact * normal.x;
        velocity.z -= intoContact * normal.z;
      }
    }
    body.setLinvel(velocity, true);
  });

  const handleCollisionEnter = ({ manifold, other }) => {
    const normal = manifold.normal();
    const outward = new THREE.Vector3(normal.x, 0, normal.z);
    if (!Number.isFinite(outward.x) || !Number.isFinite(outward.z)) return;
    if (outward.lengthSq() === 0) return;

    const body = shipRef.current;
    const position = body?.translation();
    const point =
      manifold.numSolverContacts() > 0
        ? manifold.solverContactPoint(0)
        : position;
    if (!position || !point) return;

    if (
      outward.x * (position.x - point.x) +
        outward.z * (position.z - point.z) <
      0
    ) {
      outward.negate();
    }
    outward.normalize();
    contactNormals.current.set(other.collider.handle, outward);
  };

  const handleCollisionExit = ({ other }) => {
    contactNormals.current.delete(other.collider.handle);
  };

  return (
    // Cuerpo rígido del barco: name="ship" permite que FollowCamera y Atmosphere lo rastreen.
    // colliders={false} desactiva mallas automáticas para usar la cápsula definida en config/ship.js.
    // gravityScale={0} y lockRotations bloquean caída y vuelcos; useFrame controla el giro.
    //enabledTranslations: controla qu ejes del espacio puede desplazarse el barco (X y Z, pero no Y).
    <RigidBody
      ref={shipRef}
      name="ship"
      position={SHIP_SPAWN_POSITION}
      colliders={false}
      canSleep={false}
      linearDamping={4}
      angularDamping={4}
      ccd
      gravityScale={0}
      lockRotations
      enabledTranslations={[true, false, true]}
      onCollisionEnter={handleCollisionEnter}
      onCollisionExit={handleCollisionExit}
    >
      {SHIP.colliders.map((c, index) => {
        const radius = Math.min(
          (c.right - c.left) / 2,
          (c.top - c.bottom) / 2,
        );
        const halfHeight = Math.max(
          0.1,
          (c.front - c.back) / 2 - radius,
        );

        return (
          <CapsuleCollider
            key={`${c.label ?? index}:${c.left},${c.right},${c.back},${c.front},${c.bottom},${c.top}`}
            args={[halfHeight, radius]}
            rotation={[Math.PI / 2, 0, 0]}
            position={[
              (c.left + c.right) / 2,
              (c.bottom + c.top) / 2,
              (c.back + c.front) / 2,
            ]}
            friction={0}
            restitution={0}
          />
        );
      })}
      {/* CONTENEDOR DE VAIVÉN Y CORRECCIÓN VISUAL:
          swayRef aplica el baiben  y balanceo de las olas (HU08).
          El grupo interno aplica el desfase de rotación (MODEL_YAW_OFFSET) y la altura 'waterline'. */}
        <group ref={swayRef}>
          <group rotation={[0, MODEL_YAW_OFFSET, 0]} position-y={-SHIP.waterline}>
        {/* ENCAPSULADOR DE CENTRADO DE DREI:
            El atributo 'top' alinea la parte inferior del modelo 3D exactamente en el punto Y=0.
          */}
        <Center top>
          {/* El archivo 3D de la malla/geometría del barco */}
          <BarcoPrueba />
        </Center>
      </group>
      </group>
    </RigidBody>
  );
}
