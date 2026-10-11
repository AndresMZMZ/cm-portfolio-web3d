import { Canvas } from '@react-three/fiber'
import './App.css'

function App() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </Canvas>
  )
}
export default App