import { SUN_OFFSET, SUN_POSITION } from "@/config/environment";
import { Sky } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function Atmosphere() {
  const lightRef = useRef();
  const shipRef = useRef(null); // Acceso al modelo 3D del barco
  const scene = useThree((s) => s.scene); // Acceso al mundo 3D (THREE.Scene)
  // Bucle de animación El docente (clase 4) deja la luz en una posición fija con una zona de sombra pequeña, pero hacemos que la luz principal
  // siga al barco porque si no, al alejarse de esa zona su sombra deja de calcularse.
  useFrame(() => {
    const light = lightRef.current;
    if (!light) return;
    // Buscamos el barco por nombre hasta encontrarlo
    if (!shipRef.current)
      shipRef.current = scene.getObjectByName("ship") ?? null;
    // Coordenadas actuales (X, Z) del barco, o usa 0 si no existe
    const x = shipRef.current ? shipRef.current.position.x : 0;
    const z = shipRef.current ? shipRef.current.position.z : 0;
    //luz del sol manteniéndola siempre a una distancia fija (Offset) del barco
    light.position.set(x + SUN_OFFSET[0], SUN_OFFSET[1], z + SUN_OFFSET[2]);
    // Apunta el objetivo (target) de la luz directamente hacia la posición del barco
    light.target.position.set(x, 0, z);
    light.target.updateMatrixWorld(); // sin esto el objetivo no se actualiza fuera de la escena
  });

  return (
    <>
      {/* Para probar otros ambientes, cambia la dispersión de (rayleigh) entre
          0.5 (cálido) y 6 (más azul). La distancia (distance) debe superar el área
          visible; la neblina (turbidity) controla la bruma. */}
      <Sky
        distance={10000}
        sunPosition={SUN_POSITION}
        turbidity={8}
        rayleigh={1}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      {/* El docente usa luz ambiental (ambientLight); aquí usamos luz hemisférica
          (hemisphereLight), que aporta color de cielo arriba y de mar abajo. */}
      {/* Los valores son: color del cielo, color del suelo y fuerza de la luz. */}
      <hemisphereLight args={["#ffe2c2", "#2a5578", 1.3]} />
      {/*  OPTIMIZACIÓN DE SOMBRAS (RENDIMIENTO Y CALIDAD):  
  1. shadow-mapSize: Define la resolución. Valores más altos (2048) 
     dan nitidez pero consumen más GPU; valores más bajos (512) pixelan la sombra.     
  2. shadow-camera: Define la caja invisible de captura para proyectar sombras.
     - left/right/top/bottom (-30 a 30): Si un objeto sale de este rango, su sombra desaparece.
     - near/far (1 a 200): Establecen la distancia mínima y máxima de profundidad del cálculo.     
  3. shadow-normalBias (0.05): Mueve sutilmente la sombra para eliminar el "Shadow Acne" 
     (rayas negras o parpadeos gráficos extraños sobre las superficies).
*/}
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
  );
}
