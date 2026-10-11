import { Center, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { BarcoPrueba } from './components/canvas/models/BarcoPrueba'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0b1329' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        {/* Luces para iluminar el modelo */}
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        {/* Centra automáticamente tu modelo 3D en la escena */}
        <Center>
          <BarcoPrueba />
        </Center>

        {/* Permite rotar y hacer zoom con el mouse */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App