import Atmosphere from "@/components/canvas/Atmosphere";
import FollowCamera from "@/components/canvas/FollowCamera";
import Island from "@/components/canvas/Island";
import IslandTitle from "@/components/canvas/IslandTitle";
import LighthouseBeam from "@/components/canvas/LighthouseBeam";
import Ocean from "@/components/canvas/Ocean";
import Ship from "@/components/canvas/Ship";
import IslandPrompt from "@/components/ui/IslandPrompt";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ProjectPanel from "@/components/ui/ProjectPanel";
import { CAMERA } from "@/config/camera";
import { ISLANDS } from "@/config/islands";
import { useGameKeyboardMap } from "@/config/keyboardMap";
import { SHIP_SPAWN_POSITION } from "@/config/ship";
import { useModeKeys } from "@/hooks/useModeKeys";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "./App.css"; // Vincula los estilos globales de tamaño y visor dinámico

// DETECTOR DE MODO DESARROLLADOR (DEBUG):
// Evalúa si estás corriendo el proyecto localmente (DEV) Y si la URL del navegador incluye al final '?debug'.
const DEBUG_CAMERA =
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).has("debug");

// CÁLCULO DE CÁMARA LIBRE (Aplica al modo debug la misma posición inicial de la FollowCamera):
const DEBUG_CAMERA_POSITION = [
  SHIP_SPAWN_POSITION[0] + CAMERA.offset[0], // Posición inicial X de la cámara de depuración
  SHIP_SPAWN_POSITION[1] + CAMERA.offset[1], //  Y (Altura) de la cámara de depuración
  SHIP_SPAWN_POSITION[2] + CAMERA.offset[2], // Z positivo: detrás del barco, igual que FollowCamera.
];

// PUNTO DE MIRA DE CÁMARA LIBRE (Hacia dónde apunta el lente en modo debug):
const DEBUG_CAMERA_TARGET = [
  SHIP_SPAWN_POSITION[0], // Mira al centro X del barco
  SHIP_SPAWN_POSITION[1] + CAMERA.lookHeight, // Eleva la mirada para incluir las montañas/faro
  SHIP_SPAWN_POSITION[2] - CAMERA.lookAhead, // El barco avanza hacia -Z; mira hacia delante, hacia la isla.
];

// COMPONENTE PUENTE: Ejecuta el hook de suscripciones de teclado.
// Se separa en una función interna para poder estar dentro del proveedor <KeyboardControls>.
function GameInputs() {
  useModeKeys(); // Escucha la Q, E, Esc, Enter y F para cambiar los modos globales del juego
  return null;
}

function App() {
  const keyboardMap = useGameKeyboardMap(); // Carga la lista indexada de teclas (flechas, WASD, etc.)
  const [island] = ISLANDS; // Extrae los datos de la primera isla (isla de proyectos) para renderizarla

  return (
    /* PROVEEDOR DE TECLADO: Envuelve toda la app para que cualquier componente pueda capturar pulsaciones */
    <KeyboardControls map={keyboardMap}>
      {/* CAPTAS DE ENTRADA Y COMPONENTES DE INTERFAZ HTML (Viven fuera del Canvas 3D) */}
      <GameInputs />
      <IslandPrompt /> {/* Botón flotante de "Ver Isla" cuando estás cerca */}
      <ProjectPanel /> {/* Modal del portafolio con la lista de proyectos */}
      <LoadingScreen />{" "}
      {/* Pantalla negra inicial con la brújula dorada de carga */}
      {/* LIENZO GRÁFICO PRINCIPAL (CANVAS DE THREE.JS) Todo lo que esté dentro de esta etiqueta se procesará mediante WebGL / Tarjeta Gráfica.*/}
      <Canvas
        shadows // Activa el cálculo dinámico de sombras en el motor gráfico
        camera={{
          position: DEBUG_CAMERA ? DEBUG_CAMERA_POSITION : [0, 22, 22],
          fov: 50, // Campo de visión (Field of View): Ángulo de apertura del lente de la cámara
          far: 15000, // Distancia de corte lejana: Límite máximo del horizonte visible antes de recortar objetos
        }}
      >
        {/* ENTORNO, OCÉANO Y EFECTOS VISUALES */}
        <Atmosphere />{" "}
        {/* Luces solares, ambientales y color del domo del cielo */}
        <Ocean /> /* El agua con movimiento de olas */
        <LighthouseBeam /> {/* El cono volumétrico de luz rotativo del faro */}
        {/* CONTENEDORES DE ESPERA (Suspense): 
            Evitan que el juego se rompa o se congele mientras los archivos pesados (.glb / fuentes) se descargan */}
        <Suspense fallback={null}>
          {/* Renderiza el terreno de la isla pasándole sus coordenadas y su escala */}
          <Island
            position={[island.position[0], island.modelY, island.position[2]]}
            scale={island.modelScale}
          />
        </Suspense>
        <Suspense fallback={null}>
          <Ship />{" "}
          {/* Renderiza el modelo 3D del barco y activa sus controles físicos de movimiento */}
        </Suspense>
        <Suspense fallback={null}>
          {/* Recorre el arreglo de islas y dibuja sobre cada una su letrero de texto flotante en 3D */}
          {ISLANDS.map((i) => (
            <IslandTitle key={i.id} island={i} />
          ))}
        </Suspense>
        {/* GESTIÓN DE CÁMARAS:
            Si entraste en modo debug, monta <OrbitControls> para poder orbitar y arrastrar el mundo con el ratón.
            Si juegas normalmente, monta <FollowCamera />, que persigue cinemáticamente la popa del barco. */}
        {DEBUG_CAMERA ? (
          <OrbitControls target={DEBUG_CAMERA_TARGET} />
        ) : (
          <FollowCamera />
        )}
      </Canvas>
    </KeyboardControls>
  );
}
export default App;
