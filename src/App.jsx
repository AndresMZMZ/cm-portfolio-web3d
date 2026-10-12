import Atmosphere from '@/components/canvas/Atmosphere'
import Ocean from '@/components/canvas/Ocean'
import Ship from '@/components/canvas/Ship'
import { useGameKeyboardMap } from '@/config/keyboardMap'
import { useModeKeys } from '@/hooks/useModeKeys'
import { KeyboardControls, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import './App.css'

function GameInputs() {
  useModeKeys()
  return null
}

function App() {
  const keyboardMap = useGameKeyboardMap()

  return (
    <KeyboardControls map={keyboardMap}>
      <GameInputs />
      {/*shadows activa las sombras en toda la escena */}
      <Canvas shadows camera={{ position: [0, 12, 22], fov: 50 }}> 
        <Atmosphere />
        <Ocean />
        <Ship />
        {/* OrbitControls es solo para inspeccionar: ELIMINAR cuando hagamos la cámara de seguimiento (HU07) */}
        <OrbitControls />
      </Canvas>
    </KeyboardControls>
  )
}

export default App