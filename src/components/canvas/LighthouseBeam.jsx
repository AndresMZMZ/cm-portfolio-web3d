import { LIGHTHOUSE } from "@/config/lighthouse";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// CONTROL CENTRALIZADO DEL FARO:Su posición, alcance, grosor, velocidad, color e intensidad se ajustan en config/lighthouse.js.

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║ SHADERS (sombras) PERSONALIZADAS (GLSL)                                            ║
 * ║ Programas nativos que corren directamente en la tarjeta gráfica (GPU).   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

// 1. Vertex Shader: Transforma la geometría 3D al espacio de pantalla y prepara datos de iluminación
const VERT = /* glsl */ `
  // Datos globales recibidos desde JavaScript
  uniform float uLength; // Longitud total del haz de luz
  varying float vT;      // Factor normalizado (0.0 en el origen, 1.0 en el extremo)
  varying vec3 vN;       // Vector normal de la (dirección de la cara) para cálculos de luz
  varying vec3 vV;       // Vector de dirección desde el vértice hacia la cámara

  void main() {
  // Calcula qué tan lejos está cada vértice del origen (0 a 1) a lo largo del eje Z
    vT = position.z / uLength;
  // Convierte la posición local del vértice al espacio relativo a la cámara
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
  // Orienta y normaliza (longitud = 1) la dirección de la cara hacia la cámara
    vN = normalize(normalMatrix * normal);
  // Obtiene el vector unitario que apunta en la dirección de la cámara en el espacio de vista
    vV = normalize(-mv.xyz);
  // Posición final del vértice en pantalla
    gl_Position = projectionMatrix * mv; 
  }
`;
// Fragment Shader: Define el color y la transparencia de cada píxel del haz
const FRAG = /* glsl */ `
  uniform vec3 uColor;      // Color de la luz
  uniform float uIntensity; // Nivel de brillo

  // Datos recibidos del Vertex Shader
  varying float vT; // Distancia (0 en el foco, 1 al final)
  varying vec3 vN;  // Dirección de la superficie
  varying vec3 vV;  // Dirección hacia la cámara

  void main() {
    // Desvanece la luz a medida que se aleja del origen
    float along = pow(1.0 - clamp(vT, 0.0, 1.0), 1.5);             
    
    // Suaviza los bordes laterales para dar efecto de humo o volumen
    float rim = pow(abs(dot(normalize(vN), normalize(vV))), 2.0);  
    
    // Calcula la opacidad final y aplica el color
    float a = along * rim * uIntensity;
    gl_FragColor = vec4(uColor * a, a); 
    
    // Ajustes de color y brillo de Three.js
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default function LighthouseBeam() {
  const spinRef = useRef();

  // Configuración global del faro
  const {
    lampPosition,
    beamLength,
    beamRadius,
    period,
    color,
    intensity,
    spotIntensity,
    debug,
  } = LIGHTHOUSE;

  //  GENERA Y DA ORIENTACIÓN DE LA GEOMETRÍA:
  // Se memoriza para recalcularse únicamente si cambian las dimensiones del haz.
  const geometry = useMemo(() => {
    // Crea la geometría cónica del haz de luz:
    // - beamRadius: Radio de la base abierta del cono
    // - beamLength: Altura o alcance total del cono
    // - 32: Segmentos radiales (suavidad circular del cono)
    // - 1: Segmentos de altura
    // - true: openEnded (deja la base abierta para que no parezca un objeto sólido)
    const g = new THREE.ConeGeometry(beamRadius, beamLength, 32, 1, true);

    // Transformaciones matemáticas necesarias para alinear el cono de luz:
    g.translate(0, -beamLength / 2, 0); // Mueve el punto de pivote (origen) justo a la punta del cono
    g.rotateX(-Math.PI / 2); // Rota el cono para apuntar horizontalmente hacia el eje +Z (el horizonte)
    return g;
  }, [beamLength, beamRadius]);

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
        transparent: true, // Permite la mezcla de transparencias
        depthWrite: false, // Evita que el cono tape u oculte los objetos que están detrás de él
        side: THREE.DoubleSide, // Renderiza tanto el interior como el exterior del cono
        blending: THREE.AdditiveBlending, // Mezcla aditiva: los rayos duplican su brillo al superponerse
      }),
    [beamLength, color, intensity],
  );

  // BUCLE DE ANIMACIÓN (ROTACIÓN DEL FARO):
  // period define los segundos por vuelta; delta mantiene la misma velocidad en cualquier pantalla (Hz).
  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += ((Math.PI * 2) / period) * delta;
    }
  });

  return (
    <group position={lampPosition}>
      {/* Grupo contenedor que recibe la rotación continua */}
      <group ref={spinRef}>
        {/* Haz de luz principal */}
        <mesh geometry={geometry} material={material} />

        {/* Segundo haz en sentido opuesto (180 grados): Recrea el comportamiento de los faros reales */}
        <mesh
          geometry={geometry}
          material={material}
          rotation={[0, Math.PI, 0]}
        />

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
  );
}
