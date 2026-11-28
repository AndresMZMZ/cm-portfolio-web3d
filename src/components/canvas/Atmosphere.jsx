import { DAY_CYCLE } from "@/config/dayCycle";
import {
  LIGHT_DISTANCE,
  SUN_AZIMUTH,
  SUN_POSITION,
} from "@/config/environment";
import { worldState } from "@/utils/worldState";
import { Sky, useHelper } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// HT07: los helpers de luces y sombras solo aparecen con ?debug en desarrollo.
const DEBUG_LIGHTS =
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).has("debug");
const SUN_DISTANCE = Math.hypot(...SUN_POSITION); // Se conserva la distancia original del sol para el Sky
const sunDirection = new THREE.Vector3(); // Se reutiliza en cada frame para no crear objetos nuevos

export default function Atmosphere() {
  const lightRef = useRef();
  const shipRef = useRef(null); // Acceso al modelo 3D del barco
  const scene = useThree((s) => s.scene); // Acceso al mundo 3D (THREE.Scene)
  const shadowHelperRef = useRef(null);
  const skyRef = useRef(); // Cielo, para mover el sol sin re-renderizar
  const hemiRef = useRef(); // Luz hemisférica, para cambiar su color e intensidad
  const moonRef = useRef(); // Luz de la luna

  useHelper(DEBUG_LIGHTS && lightRef, THREE.DirectionalLightHelper, 5, "red");

  useEffect(() => {
    if (!DEBUG_LIGHTS || !lightRef.current) return;
    const helper = new THREE.CameraHelper(lightRef.current.shadow.camera);
    scene.add(helper);
    shadowHelperRef.current = helper;
    return () => {
      scene.remove(helper);
      helper.dispose();
      shadowHelperRef.current = null;
    };
  }, [scene]);

  // Bucle de animación (clase 4)  el profe deja la luz en una posición fija con una zona de sombra pequeña,
  // pero aca hacemos que la luz principal siga al barco porque si no, al alejarse de esa zona su sombra deja de calcularse.
  useFrame(() => {
    const light = lightRef.current;
    if (!light) return;
    // Buscamos el barco por nombre hasta encontrarlo
    if (!shipRef.current)
      shipRef.current = scene.getObjectByName("ship") ?? null;
    // Coordenadas actuales (X, Z) del barco, o usa 0 si no existe
    const x = shipRef.current ? shipRef.current.position.x : 0;
    const z = shipRef.current ? shipRef.current.position.z : 0;

    // Dirección del sol según la hora del ciclo (HU20). El azimut sale de SUN_POSITION; la elevación cambia con el reloj.
    const day = worldState.day;
    const elevation = THREE.MathUtils.degToRad(day.sunElevation);
    sunDirection.set(
      Math.cos(elevation) * Math.cos(SUN_AZIMUTH),
      Math.sin(elevation),
      Math.cos(elevation) * Math.sin(SUN_AZIMUTH),
    );
    // luz del sol manteniéndola siempre a una distancia fija del barco (como antes, pero con la dirección del ciclo)
    light.position.set(
      x + sunDirection.x * LIGHT_DISTANCE,
      sunDirection.y * LIGHT_DISTANCE,
      z + sunDirection.z * LIGHT_DISTANCE,
    );
    light.color.copy(day.sunColor);
    light.intensity = day.sunIntensity; // Llega a 0 cuando el sol baja del horizonte

    // Apunta el objetivo (target) de la luz directamente hacia la posición del barco
    light.target.position.set(x, 0, z);
    light.target.updateMatrixWorld(); // sin esto el objetivo no se actualiza fuera de la escena

    // La luna está siempre en el lado opuesto al sol; no proyecta sombras, solo ilumina.
    const moon = moonRef.current;
    if (moon) {
      moon.position.set(
        x - sunDirection.x * LIGHT_DISTANCE,
        -sunDirection.y * LIGHT_DISTANCE,
        z - sunDirection.z * LIGHT_DISTANCE,
      );
      moon.target.position.set(x, 0, z);
      moon.target.updateMatrixWorld();
      moon.intensity = day.moonIntensity;
    }
    // El Sky se actualiza por su ref porque sus props solo se aplican cuando cambian en React.
    const sky = skyRef.current;
    if (sky) {
      const uniforms = sky.material.uniforms;
      uniforms.sunPosition.value
        .copy(sunDirection)
        .multiplyScalar(SUN_DISTANCE);
      uniforms.turbidity.value = day.turbidity;
      uniforms.rayleigh.value = day.rayleigh;
    }
    // hemi significa hemisférica: color de cielo arriba, color de suelo abajo, intensidad de la luz. Se actualiza por su ref porque sus props solo se aplican cuando cambian en React.
    const hemi = hemiRef.current;
    if (hemi) {
      hemi.color.copy(day.hemiSky);
      hemi.groundColor.copy(day.hemiGround);
      hemi.intensity = day.hemiIntensity;
    }
    shadowHelperRef.current?.update();
  });

  return (
    <>
      {/* Para probar otros ambientes, cambia la dispersión de (rayleigh) entre
          0.5 (cálido) y 6 (más azul). La distancia mantiene la caja del cielo
          fuera del área navegable; la neblina (turbidity) controla la bruma. */}
      <Sky
        ref={skyRef}
        distance={100000}
        sunPosition={SUN_POSITION}
        turbidity={8}
        rayleigh={1}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      {/* El profe usa luz ambiental (ambientLight); aquí usamos luz hemisférica
          (hemisphereLight), que aporta color de cielo arriba y por debajo del mar. */}
      {/* Los valores son: color del cielo, color del suelo y fuerza de la luz. */}
      <hemisphereLight
        ref={hemiRef}
        args={["#ffe2c2", "#2a5578", 1.3]}
      />
      {/*  OPTIMIZACIÓN DE SOMBRAS:
        1. shadow-mapSize: Define la resolución. Valores más altos,dan nitidez pero consumen más GPU; valores más bajos pixelan la sombra.     
        2. shadow-camera: Define la caja invisible de captura para proyectar sombras.
          - left/right/top/bottom (-30 a 30): Si un objeto sale de este rango, su sombra desaparece.
          - near/far (1 a 200): Establecen la distancia mínima y máxima de profundidad del cálculo.     
        3. shadow-normalBias (0.05): Mueve sutilmente la sombra para eliminar el "Shadow Acne" 
            (rayas negras o parpadeos gráficos extraños sobre las superficies).*/}
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
      {/* Luna (HU20): luz fría sin sombras; su color está en config/dayCycle.js */}
      <directionalLight
        ref={moonRef}
        color={DAY_CYCLE.moonColor}
        intensity={0}
      />
    </>
  );
}
