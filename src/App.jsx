import Atmosphere from "@/components/canvas/Atmosphere";
import FollowCamera from "@/components/canvas/FollowCamera"; //es lo que me permite seguir la cámara del barco
import Island from "@/components/canvas/Island";
import LighthouseBeam from "@/components/canvas/LighthouseBeam";
import Ocean from "@/components/canvas/Ocean";
import Ship from "@/components/canvas/Ship";
import IslandPrompt from "@/components/ui/IslandPrompt";
import { ISLANDS } from "@/config/islands";
import { useGameKeyboardMap } from "@/config/keyboardMap";
import { useModeKeys } from "@/hooks/useModeKeys";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "./App.css";

// Pon true SOLO para inspeccionar la escena con el mouse (esto desactiva el seguimiento del barco)
const DEBUG_CAMERA = false;

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
      <Canvas shadows camera={{ position: [0, 22, 22], fov: 50 }}>
        <Atmosphere />
        <Ocean />
        <LighthouseBeam />

        {/* El docente envuelve todo en un solo Suspense (clase 2), pero usamos uno por modelo porque el mar y el cielo
            aparecen sin esperar a los modelos pesados */}
        <Suspense fallback={null}>
          <Island
            position={[island.position[0], 15, island.position[2]]}
            scale={0.1}
          />
        </Suspense>
        <Suspense fallback={null}>
          <Ship />
        </Suspense>
        {/* Un solo control de cámara activo a la vez */}
        {DEBUG_CAMERA ? <OrbitControls /> : <FollowCamera />}
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
