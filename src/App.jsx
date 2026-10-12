import Ship from '@/components/canvas/Ship'
import { useGameKeyboardMap } from '@/config/keyboardMap'
import { useModeKeys } from '@/hooks/useModeKeys'
import { KeyboardControls, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import './App.css'

//useKeyboardControls solo funciona dentro de <KeyboardControls>, por eso va en un componente hijo
function GameInputs() {
  useModeKeys()
  return null
}

function App() {
  const keyboardMap = useGameKeyboardMap()

  return (
    <KeyboardControls map={keyboardMap}>    
      {/* Se quitó el div de 100vw/100vh: #root ya ocupa 100dvh (App.css) */}
      <GameInputs />     
      <Canvas camera={{ position: [0, 12, 22], fov: 50 }}>
        {/* El fondo va dentro del Canvas porque ya no hay div contenedor */}
        <color attach="background" args={['#0b1329']} />
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Ship />
        {/* OrbitControls es solo para inspeccionar: ELIMINAR cuando hagamos la cámara de seguimiento (HU07) */}
        <OrbitControls />
      </Canvas>
    </KeyboardControls>
  )
}

export default App