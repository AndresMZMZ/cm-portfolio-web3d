import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function Ocean() {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const time = clock.getElapsedTime()
    const positionAttribute = meshRef.current.geometry.attributes.position

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i)
      const y = positionAttribute.getY(i)

      // Oleaje suave y controlado
      const wave1 = Math.sin(x * 0.05 + time * 1.2) * 0.15 
      const wave2 = Math.cos(y * 0.05 + time * 0.7) * 0.15 
      const wave3 = Math.sin((x + y) * 0.02 + time * 3.5) * 0.05 

      const z = wave1 + wave2 + wave3
      positionAttribute.setZ(i, z)
    }

    meshRef.current.geometry.computeVertexNormals()
    positionAttribute.needsUpdate = true
  })

  return (
    
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow >
      <planeGeometry args={[1000, 1000, 80, 80]} />
      <meshPhysicalMaterial
        color="#17b8df"
        roughness={0.08}
        metalness={0.05}
        transmission={0.30}
        thickness={2.0}
        ior={1.333}          
        transparent={true}
        opacity={0.70}
        depthWrite={false}    
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}