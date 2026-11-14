import { BarcoPrueba } from "@/components/canvas/models/BarcoPrueba";
import { SHIP, SHIP_SPAWN_POSITION } from "@/config/ship";
import { MODES, useGameStore } from "@/store/useGameStore";
import { updateIslandProximity } from "@/utils/islandProximity";
import { Center, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

// Controla el barco en la escena: movimiento, giros, posición inicial y altura sobre el agua.
// Sus valores ajustables se encuentran en config/ship.js.

// Si el barco avanza "de lado", cambia este valor a 0, Math.PI / 2, Math.PI o -Math.PI / 2
const MODEL_YAW_OFFSET = Math.PI / 2;

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

  // BUCLE DE ANIMACIÓN (useFrame): Se ejecuta en cada fotograma
  useFrame((state, delta) => {
    const body = shipRef.current;
    // Si el barco aún no se ha montado en la escena, detiene la ejecución para evitar errores.
    if (!body) return;
    // FILTRO DE ESTADO: El barco solo se mueve en modo navegación si el jugador está en un menú,(estado único de la HT04)
    if (useGameStore.getState().mode !== MODES.NAVIGATION) {
      body.setLinvel({ x: 0, y: 0, z: 0 }, true); // Detiene el movimiento lineal del barco
      return;
    }
    // Lee las teclas configuradas para generar el movimiento de navegación.
    const { forward, back, left, right } = get();
    // CÁLCULO DE VELOCIDAD CON FRENADO AUTOMÁTICO:
    // Entre más cerca esté de una isla, el barco se vera obligando a desacelerar.
    const speed = SHIP.speed * updateIslandProximity(body.translation());
    const direction = (forward ? 1 : 0) - (back ? 1 : 0); // dirección de avance: 1 = adelante, -1 = atrás, 0 = detenido
    const turn = (left ? 1 : 0) - (right ? 1 : 0);

    // Actualiza la rotación y velocidad lineal del barco según las teclas presionadas y el tiempo transcurrido (delta).
    const v = vectors.current;
    yaw.current += SHIP.turnSpeed * turn * delta;
    v.quaternion.setFromEuler(v.euler.set(0, yaw.current, 0));
    v.forward.set(0, 0, -1).applyQuaternion(v.quaternion);
    body.setRotation(v.quaternion, true); // Actualiza la rotación del barco en Rapier
    
    body.setLinvel(
      {
        x: v.forward.x * speed * direction,
        y: 0,
        z: v.forward.z * speed * direction,
      },
      true,
    );
  });

  return (
    // Cuerpo rígido del barco: name="ship" permite que FollowCamera y Atmosphere lo rastreen.
    // colliders={false} desactiva mallas automáticas para usar una sola cápsula de casco.
    // gravityScale={0} y lockRotations bloquean caída y vuelcos; useFrame controla el giro.
    //enabledTranslations: controla qu ejes del espacio puede desplazarse el barco (X y Z, pero no Y).
    <RigidBody
      ref={shipRef}
      name="ship"
      position={SHIP_SPAWN_POSITION}
      colliders={false}
      gravityScale={0}
      lockRotations
      enabledTranslations={[true, false, true]}
    >
      {/* Cápsula vertical (eje Y); rotation X de 90 grados la acuesta a lo largo del barco (eje Z).
          friction 0: al chocar en diagonal con una isla el barco resbala en vez de frenarse en seco. */}
      <CapsuleCollider
        args={[SHIP.colliderHalfLength, SHIP.colliderRadius]}
        rotation={[Math.PI / 2, 0, 0]}
        position={SHIP.colliderOffset}
        friction={0}
      />
      {/* CONTENEDOR CORRECCIÓN VISUAL:
          Aplica el desfase de rotación (MODEL_YAW_OFFSET) para que mire al frente 
          y le resta la altura 'waterline' en el eje Y para hundirlo ligeramente en el agua. */}
      <group rotation={[0, MODEL_YAW_OFFSET, 0]} position-y={-SHIP.waterline}>
        {/* ENCAPSULADOR DE CENTRADO DE DREI:
            El atributo 'top' alinea la parte inferior del modelo 3D exactamente en el punto Y=0.
          */}
        <Center top>
          {/* El archivo 3D de la malla/geometría del barco */}
          <BarcoPrueba />
        </Center>
      </group>
    </RigidBody>
  );
}