import { Center, KeyboardControls, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import './App.css';
import { BarcoPrueba } from './components/canvas/models/BarcoPrueba';
import { useGameKeyboardMap } from './config/keyboardMap'; //Importamos el hook del mapeo de teclas

function App() {
  //Instanciamos la matriz híbrida de controles del teclado
  const keyboardMap = useGameKeyboardMap()

  return (
    /* Envolvemos toda la aplicación con KeyboardControls */
    <KeyboardControls map={keyboardMap}>
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
    </KeyboardControls>
  )
}

export default App