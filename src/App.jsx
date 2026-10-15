import Atmosphere from "@/components/canvas/Atmosphere";
import FollowCamera from "@/components/canvas/FollowCamera";
import Island from "@/components/canvas/Island";
import IslandTitle from "@/components/canvas/IslandTitle";
import LighthouseBeam from "@/components/canvas/LighthouseBeam";
import Ocean from "@/components/canvas/Ocean";
import Ship from "@/components/canvas/Ship";
import IslandPrompt from "@/components/ui/IslandPrompt";
import ProjectPanel from "@/components/ui/ProjectPanel";
import { ISLANDS } from "@/config/islands";
import { useGameKeyboardMap } from "@/config/keyboardMap";
import { useModeKeys } from "@/hooks/useModeKeys";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "./App.css";

// INICIO líneas modificadas
// Antes: const DEBUG_CAMERA = true (había que acordarse de volver a false antes de cada commit).
// Ahora la cámara libre solo existe en desarrollo y solo si abres http://localhost:5173/?debug,
// así nunca llega a producción por accidente y no editas código para alternar
const DEBUG_CAMERA =
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).has("debug");//lee únicamente lo que está a partir del signo ?
// FIN líneas modificadas

function GameInputs() {
  useModeKeys();
  return null;
}

function App() {
  const keyboardMap = useGameKeyboardMap();
  const [island] = ISLANDS;

  return (
    <KeyboardControls map={keyboardMap}>
      <GameInputs />
      <IslandPrompt />
      <ProjectPanel />
      <Canvas shadows camera={{ position: [0, 22, 22], fov: 50 }}>
        <Atmosphere />
        <Ocean />
        <LighthouseBeam />
        {/* El docente envuelve todo en un solo Suspense (clase 2), pero usamos uno por modelo porque el mar y el cielo
            aparecen sin esperar a los modelos pesados */}
        <Suspense fallback={null}>
          {/* INICIO línea modificada: altura y escala salen de islands.js */}
          <Island
            position={[island.position[0], island.modelY, island.position[2]]}
            scale={island.modelScale}
          />
          {/* FIN línea modificada */}
        </Suspense>
        <Suspense fallback={null}>
          <Ship />
        </Suspense>
        {/* INICIO líneas nuevas: Text carga su fuente de forma asíncrona, por eso va dentro de un Suspense */}
        <Suspense fallback={null}>
          {ISLANDS.map((i) => (
            <IslandTitle key={i.id} island={i} />
          ))}
        </Suspense>
        {/* FIN líneas nuevas */}
        {/* Un solo control de cámara activo a la vez */}
        {DEBUG_CAMERA ? <OrbitControls /> : <FollowCamera />}
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
