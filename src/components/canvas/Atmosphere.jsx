import { SUN_OFFSET, SUN_POSITION } from '@/config/environment'
import { Sky } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

export default function Atmosphere() {
  const lightRef = useRef()
  const shipRef = useRef(null)
  const scene = useThree((s) => s.scene)
  // El docente (clase 4) deja la luz en una posición fija con una zona de sombra pequeña, pero hacemos que la luz
  // siga al barco porque si no, al alejarse de esa zona su sombra deja de calcularse
  useFrame(() => {
    const light = lightRef.current
    if (!light) return
    // Buscamos el barco por nombre hasta encontrarlo
    if (!shipRef.current) shipRef.current = scene.getObjectByName('ship') ?? null
    const x = shipRef.current ? shipRef.current.position.x : 0
    const z = shipRef.current ? shipRef.current.position.z : 0
    light.position.set(x + SUN_OFFSET[0], SUN_OFFSET[1], z + SUN_OFFSET[2])
    light.target.position.set(x, 0, z)
    light.target.updateMatrixWorld() // sin esto el objetivo no se actualiza fuera de la escena
  })

  return (
    <>
      {/* Para probar otros ambientes cambia rayleigh entre 0.5 (cálido) y 6 (más azul) */}
      <Sky sunPosition={SUN_POSITION} turbidity={8} rayleigh={1} mieCoefficient={0.005} mieDirectionalG={0.8} />
      {/* El docente usa ambientLight, pero usamos hemisphereLight porque rellena con color de cielo arriba y de mar abajo (más natural) */}
      <hemisphereLight args={['#ffe2c2', '#2a5578', 1.3]} />
      <directionalLight
        ref={lightRef}
        color="#ffb877"
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-normalBias={0.05}
      />
    </>
  )
}