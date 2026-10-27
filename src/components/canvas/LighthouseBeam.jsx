import { LIGHTHOUSE } from '@/config/lighthouse'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// CONTROL CENTRALIZADO DEL FARO:Su posición, alcance, grosor, velocidad, color e intensidad se ajustan en config/lighthouse.js.

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║ SHADERS PERSONALIZADOS (GLSL)                                            ║
 * ║ Programas nativos que corren directamente en la tarjeta gráfica (GPU).   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

// 1. Vertex Shader: Procesa los vértices de la geometría cónica en el espacio 3D.
const VERT = /* glsl */ `
  uniform float uLength; // Longitud total del haz de luz
  varying float vT;      // Factor de progresión (0.0 en el foco, 1.0 en el extremo)
  varying vec3 vN;       // Vector normal (dirección de la cara) para cálculos de luz
  varying vec3 vV;       // Vector de vista (dirección hacia la cámara)
  void main() {
    vT = position.z / uLength;  // Calcula qué tan lejos está cada vértice del origen
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);     // Dirección de la cámara en el espacio de vista
    gl_Position = projectionMatrix * mv; // Posición final del vértice en pantalla
  }
`

// 2. Fragment Shader: Calcula el color e iluminación píxel por píxel del haz.
const FRAG = /* glsl */ `
  uniform vec3 uColor;      // Color base de la luz
  uniform float uIntensity; // Multiplicador de brillo
  varying float vT;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    // Atenuación longitudinal: La luz es más intensa en el faro y se desvanece a la distancia
    float along = pow(1.0 - clamp(vT, 0.0, 1.0), 1.5);             
    
    // Efecto Fresnel/Rim: Suaviza los bordes del cono para que luzca como gas/bruma translúcida y no como un plástico sólido
    float rim = pow(abs(dot(normalize(vN), normalize(vV))), 2.0);  
    
    float a = along * rim * uIntensity; // Opacidad final combinada
    gl_FragColor = vec4(uColor * a, a); // Aplica color con transparencia premultiplicada
    
    // Inclusiones de Three.js para mapeo de color correcto y compatibilidad con pantallas modernas
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export default function LighthouseBeam() {
  const spinRef = useRef()
  
  // Desestructuración de la configuración global del faro
  const { lampPosition, beamLength, beamRadius, period, color, intensity, spotIntensity, debug } = LIGHTHOUSE

  //  GENERACIÓN Y ORIENTACIÓN DE LA GEOMETRÍA:
  // Se memoriza para recalcularse únicamente si cambian las dimensiones del haz.
  const geometry = useMemo(() => {
    // Parámetros: (Radio de apertura, Alcance/Largo, Caras redondas, Divisiones verticales, Sin tapas fijas)
    const g = new THREE.ConeGeometry(beamRadius, beamLength, 32, 1, true)
    
    // Transformaciones matemáticas necesarias para alinear el cono de luz:
    g.translate(0, -beamLength / 2, 0) // Mueve el punto de pivote (origen) justo a la punta del cono
    g.rotateX(-Math.PI / 2)            // Rota el cono para apuntar horizontalmente hacia el eje +Z (el horizonte)
    return g
  }, [beamLength, beamRadius])

  // CONFIGURACIÓN DEL MATERIAL VOLUMÉTRICO:
  // Usa los Shaders personalizados para lograr un efecto de luz realista y transparente.
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
        transparent: true,         // Permite la mezcla de transparencias
        depthWrite: false,         // Evita que el cono tape u oculte los objetos que están detrás de él
        side: THREE.DoubleSide,     // Renderiza tanto el interior como el exterior del cono
        blending: THREE.AdditiveBlending, // Mezcla aditiva: los rayos duplican su brillo al superponerse
      }),
    [beamLength, color, intensity]
  )

  // BUCLE DE ANIMACIÓN (ROTACIÓN DEL FARO):
  // period define los segundos por vuelta; delta mantiene la misma velocidad en cualquier pantalla (Hz).
  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += ((Math.PI * 2) / period) * delta
    }
  })

  return (
    <group position={lampPosition}>
      {/* Grupo contenedor que recibe la rotación continua */}
      <group ref={spinRef}>
        {/* Haz de luz principal */}
        <mesh geometry={geometry} material={material} />
        
        {/* Segundo haz en sentido opuesto (180 grados): Recrea el comportamiento de los faros reales */}
        <mesh geometry={geometry} material={material} rotation={[0, Math.PI, 0]} />
        
        {/* LUZ DE ENFOQUE (SpotLight):
            Luz real de Three.js que gira acoplada al haz y alumbra la superficie del mar.
            Para optimizar rendimiento (FPS), tiene las sombras desactivadas. */}
        <spotLight 
          angle={0.25} 
          penumbra={0.8} 
          intensity={spotIntensity} 
          distance={beamLength} 
          decay={1.5} 
          color={color}
        >
          {/* Objetivo invisible que fuerza a la SpotLight a apuntar hacia el frente del haz */}
          <object3D attach="target" position={[0, -2, beamLength]} />
        </spotLight>
      </group>

      {/* MODO DEPURACIÓN (DEBUG):
          Muestra una esfera roja en el origen exacto de la bombilla para facilitar su posicionamiento. */}
      {debug && (
        <mesh>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </group>
  )
}