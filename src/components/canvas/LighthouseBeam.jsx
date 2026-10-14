// INICIO archivo nuevo
import { LIGHTHOUSE } from '@/config/lighthouse'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const VERT = /* glsl */ `
  uniform float uLength;
  varying float vT;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vT = position.z / uLength;  // 0 en el foco, 1 en el extremo lejano
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying float vT;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float along = pow(1.0 - clamp(vT, 0.0, 1.0), 1.5);             // más fuerte cerca del foco
    float rim = pow(abs(dot(normalize(vN), normalize(vV))), 2.0);  // bordes suaves
    float a = along * rim * uIntensity;
    gl_FragColor = vec4(uColor * a, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export default function LighthouseBeam() {
  const spinRef = useRef()
  const { lampPosition, beamLength, beamRadius, period, color, intensity, spotIntensity, debug } = LIGHTHOUSE

  const geometry = useMemo(() => {
    // Cono abierto: la punta queda en el foco y la base se abre hacia +Z
    const g = new THREE.ConeGeometry(beamRadius, beamLength, 32, 1, true)
    g.translate(0, -beamLength / 2, 0) // punta en el origen, base hacia -Y
    g.rotateX(-Math.PI / 2)            // base hacia +Z
    return g
  }, [beamLength, beamRadius])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uLength: { value: beamLength },
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    [beamLength, color, intensity]
  )

  // delta hace que la vuelta dure lo mismo en pantallas de 60 y de 144 Hz
  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += ((Math.PI * 2) / period) * delta
  })

  return (
    <group position={lampPosition}>
      <group ref={spinRef}>
        <mesh geometry={geometry} material={material} />
        {/* Segundo haz en sentido contrario: muchos faros reales tienen dos */}
        <mesh geometry={geometry} material={material} rotation={[0, Math.PI, 0]} />
        {/* Luz de foco que gira con el haz y alumbra el mar (sin sombras, para no gastar FPS) */}
        <spotLight angle={0.25} penumbra={0.8} intensity={spotIntensity} distance={beamLength} decay={1.5} color={color}>
          <object3D attach="target" position={[0, -2, beamLength]} />
        </spotLight>
      </group>
      {/* DEPURACIÓN: ELIMINAR este bloque cuando el foco esté bien ubicado */}
      {debug && (
        <mesh>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </group>
  )
}
