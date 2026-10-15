import { KeyboardControls, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import './App.css'
import Atmosphere from '@/components/canvas/Atmosphere'
import FollowCamera from '@/components/canvas/FollowCamera'
import Island from '@/components/canvas/Island'
import IslandTitle from '@/components/canvas/IslandTitle'
import LighthouseBeam from '@/components/canvas/LighthouseBeam'
import Ocean from '@/components/canvas/Ocean'
import Ship from '@/components/canvas/Ship'
import IslandPrompt from '@/components/ui/IslandPrompt'
import LoadingScreen from '@/components/ui/LoadingScreen'
import ProjectPanel from '@/components/ui/ProjectPanel'
import { ISLANDS } from '@/config/islands'
import { useGameKeyboardMap } from '@/config/keyboardMap'
import { useModeKeys } from '@/hooks/useModeKeys'

// La cámara libre solo existe en desarrollo y con http://localhost:5173/?debug
const DEBUG_CAMERA = import.meta.env.DEV && new URLSearchParams(window.location.search).has('debug')

function GameInputs() {
  useModeKeys()
  return null
}

function App() {
  const keyboardMap = useGameKeyboardMap()
  const [island] = ISLANDS

  return (
    <KeyboardControls map={keyboardMap}>
      <GameInputs />
      <IslandPrompt />
      <ProjectPanel />
      {/* INICIO línea modificada: la pantalla de carga lee el modo del store; ya no recibe props ni usa gameStarted */}
      <LoadingScreen />
      {/* FIN línea modificada */}
      {/* INICIO líneas modificadas: el Canvas está montado desde el principio, detrás de la pantalla de carga.
          Así los modelos, texturas y shaders ya están listos cuando se pulsa el botón y no hay tirón. */}
      <Canvas shadows camera={{ position: [0, 22, 22], fov: 50 }}>
        {/* FIN líneas modificadas */}
        <Atmosphere />
        <Ocean />
        <LighthouseBeam />
        <Suspense fallback={null}>
          <Island position={[island.position[0], island.modelY, island.position[2]]} scale={island.modelScale} />
        </Suspense>
        <Suspense fallback={null}>
          <Ship />
        </Suspense>
        {/* Text carga su fuente de forma asíncrona, por eso va dentro de un Suspense */}
        <Suspense fallback={null}>
          {ISLANDS.map((i) => (
            <IslandTitle key={i.id} island={i} />
          ))}
        </Suspense>
        {DEBUG_CAMERA ? <OrbitControls /> : <FollowCamera />}
      </Canvas>
    </KeyboardControls>
  )
}

export default App