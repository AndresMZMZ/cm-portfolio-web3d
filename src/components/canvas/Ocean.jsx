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
      <planeGeometry args={[1000, 1000, 128, 128]} />
      <meshPhysicalMaterial
        color="#65d6f2"
        roughness={0.15}
        metalness={0.02}
        transmission={0.30}
        thickness={5.0}
        ior={1.333}          
        transparent={true}
        opacity={0.80}
        depthWrite={true}    
        side={THREE.DoubleSide}
        // Añadimos propiedades reflectivas y de brillo alto para simular la espuma blanca en las crestas
        clearcoat={7.0}
        clearcoatRoughness={0.1}
        sheen={1.0}
        sheenColor={new THREE.Color('#27d0f1')}
      />
    </mesh>
  )
}