import { BarcoPrueba } from "@/components/canvas/models/BarcoPrueba";
import { SHIP, SHIP_SPAWN_POSITION } from "@/config/ship";
import { MODES, useGameStore } from "@/store/useGameStore";
import { updateIslandProximity } from "@/utils/islandProximity";
import { Center, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

// Controla el barco en la escena: movimiento, giros, posición inicial y altura sobre el agua.
// Sus valores ajustables se encuentran en config/ship.js.

// Si el barco avanza "de lado", cambia este valor a 0, Math.PI / 2, Math.PI o -Math.PI / 2
const MODEL_YAW_OFFSET = Math.PI / 2;

// Se mantiene separado del archivo generado del modelo para que regenerarlo no borre esta lógica.
export default function Ship() {
  // Referencia que, permite modificar su posición y rotación barco.
  const shipRef = useRef();
  const [, get] = useKeyboardControls(); // Hook de Drei para escuchar las teclas del teclado en tiempo real.

  // BUCLE DE ANIMACIÓN (useFrame): Se ejecuta en cada fotograma
  useFrame((state, delta) => {
    // Si el barco aún no se ha montado en la escena, detiene la ejecución para evitar errores.
    if (!shipRef.current) return;
    // FILTRO DE ESTADO: El barco solo se mueve en modo navegación si el jugador está en un menú,(estado único de la HT04)
    if (useGameStore.getState().mode !== MODES.NAVIGATION) return;
    // Lee las teclas configuradas para generar el movimiento de navegación.
    const { forward, back, left, right } = get();
    // CÁLCULO DE VELOCIDAD CON FRENADO AUTOMÁTICO:
    // Entre más cerca esté de una isla, el barco se vera obligando a desacelerar.
    const speed = SHIP.speed * updateIslandProximity(shipRef.current.position);
    if (forward) shipRef.current.translateZ(-speed * delta); // Avanzar hacia adelante
    // MOVIMIENTO LINEAL:
    // 'translateZ' desplaza el objeto respecto a hacia dónde está mirando el barco en ese instante.
    // 'delta' asegura que el barco se mueva a la misma velocidad real sin importar los FPS de la computadora.
    if (back) shipRef.current.translateZ(speed * delta); // Retroceder
    // ROTACIÓN (Eje Y local):
    // Al presionar izquierda o derecha, rota el barco sobre su eje vertical para cambiar de dirección
    if (left) shipRef.current.rotation.y += SHIP.turnSpeed * delta;
    if (right) shipRef.current.rotation.y -= SHIP.turnSpeed * delta;
  });

  return (
    // CONTENEDOR PRINCIPAL DEL BARCO:
    // 'name="ship"' es clave: el script de la atmósfera usan este string para buscar el objeto y seguirlo.
    // 'position={SHIP_SPAWN_POSITION}' sitúa el barco en el punto inicial calculado al arrancar el mapa.
    <group ref={shipRef} name="ship" position={SHIP_SPAWN_POSITION}>
      {/* CONTENEDOR DE CORRECCIÓN VISUAL:
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
    </group>
  );
}
