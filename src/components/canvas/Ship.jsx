import { BarcoPrueba } from '@/components/canvas/models/BarcoPrueba'
import { MODES, useGameStore } from '@/store/useGameStore'
import { Center, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

const SPEED = 5          // unidades por segundo
const TURN_SPEED = 1.5   // radianes por segundo
// Si el barco avanza "de lado", cambia este valor a 0, Math.PI / 2, Math.PI o -Math.PI / 2
const MODEL_YAW_OFFSET = Math.PI / 2

// usamos un componente separado porque gltfjsx regenera el archivo del modelo y borraría la lógica
export default function Ship() {
  const shipRef = useRef()
  const [, get] = useKeyboardControls()

  useFrame((state, delta) => {
    if (!shipRef.current) return
    // El barco solo se mueve en modo navegación (estado único de la HT04)
    if (useGameStore.getState().mode !== MODES.NAVIGATION) return

    const { forward, back, left, right } = get()
    // translateZ mueve el barco hacia donde mira; con position.z siempre iría por el eje Z global
    if (forward) shipRef.current.translateZ(-SPEED * delta)
    if (back) shipRef.current.translateZ(SPEED * delta)
    if (left) shipRef.current.rotation.y += TURN_SPEED * delta
    if (right) shipRef.current.rotation.y -= TURN_SPEED * delta
  })

  return (
    <group ref={shipRef}>
      <group rotation={[0, MODEL_YAW_OFFSET, 0]}>
        {/* Center va DENTRO del grupo que se mueve: así el barco gira sobre su propio centro */}
        <Center>
          <BarcoPrueba />
        </Center>
      </group>
    </group>
  )
}