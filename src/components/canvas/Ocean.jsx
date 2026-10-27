import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

//  CONFIGURACIÓN DEL ENTORNO DEL OCÉANO:
const OCEAN_SIZE = 8000;     // Extensión (ancho por largo). Reducir el tamaño del plano si va mal en cp sin targeta grafica
const OCEAN_SEGMENTS = 512; // Densidad de la malla (subdivisiones); a mayor valor, más detalle en las olas.

// PARÁMETROS DEL MAR (Variables de control estético y visual):
const SEA = {
  deep: "#0d6ea8",      // Color del (valle) de la ola punto mas bajo.
  shallow: "#3fc1e6",   // Color brillante en el punto más alto (cresta) de la ola.
  sky: "#bfe0ff",       // Color simulado del cielo
  glow: 0.3,            // Luminiscencia propia; evita que el agua luzca completamente negra en zonas oscuras.
  fresnel: 0.9,         // Intensidad del reflejo al mirar el agua
  ripple: 0.35,         // Multiplicador de fuerza para las micro-ondas/ondas pequeñas que brillan con el sol.
  foamFrom: 0.5,        // Altura normalizada (Z local) donde la espuma empieza a generarse.
  foamTo: 0.85,         // Altura máxima donde la espuma blanca
};

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║ VERTEX DECLARATIONS (GLSL)                                               ║
 * ║ Modifica la forma de la malla elevando los vértices para crear olas.     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
const VERTEX_DECLARATIONS = /* glsl */ `
  #include <common>
  uniform float uTime;   // Tiempo transcurrido enviado desde la CPU.
  varying float vWave;   // Pasa la altura calculada de la ola al Fragment Shader.
  varying vec3 vWorld;   // Pasa las coordenadas globales del mundo para calcular las micro-ondas.

  // Algoritmo matemático para acumular ondas sinusoidales independientes:
  void addWave(vec2 p, vec2 dir, float k, float amp, float speed, inout float h, inout vec2 g) {
    vec2 d = normalize(dir);
    float phase = dot(d, p) * k + uTime * speed;
    h += amp * sin(phase);       // Acumula la altura vertical de la ola.
    g += amp * k * cos(phase) * d; // Acumula el vector de pendiente (gradiente) para recalcular las normales.
  }

  // Mezcla de 3 espectros de olas (Grandes, medianas y pequeñas) para romper la simetría artificial:
  void waveCalc(vec2 p, out float h, out vec2 g) {
    h = 0.0;
    g = vec2(0.0);
    addWave(p, vec2(1.0, 0.4),  0.05, 0.45, 1.0, h, g);  // Ola macro (Lenta y masiva)
    addWave(p, vec2(-0.3, 1.0), 0.11, 0.25, 1.4, h, g);  // Ola media (Dirección transversal)
    addWave(p, vec2(0.7, -0.8), 0.23, 0.12, 2.0, h, g);  // Ola micro (Rápida y superficial)
  }
`;

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║ FRAGMENT DECLARATIONS (GLSL)                                             ║
 * ║ Calcula el color píxel a píxel, combinando agua profunda, espuma y sol. ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
const FRAGMENT_DECLARATIONS = /* glsl */ `
  #include <common>
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSky;
  uniform float uGlow;
  uniform float uFresnel;
  uniform float uRipple;
  uniform float uFoamFrom;
  uniform float uFoamTo;
  varying float vWave;
  varying vec3 vWorld;

  // Genera ondas finas de ruido matemático en el plano XZ:
  vec2 ripple(vec2 p, vec2 dir, float k, float speed, float amp) {
    vec2 d = normalize(dir);
    float phase = dot(d, p) * k + uTime * speed;
    return d * (k * amp * cos(phase));
  }

  // Suma de micro-detalles en la superficie marina (Simula rugosidad y viento):
  vec2 rippleGrad(vec2 p) {
    vec2 g = vec2(0.0);
    g += ripple(p, vec2(1.0, 0.3),   0.9, 1.7, 0.30);
    g += ripple(p, vec2(-0.6, 1.0),  1.3, 2.1, 0.22);
    g += ripple(p, vec2(0.4, -1.0),  2.1, 2.8, 0.15);
    g += ripple(p, vec2(-1.0, -0.5), 3.4, 3.5, 0.10);
    return g;
  }
`;

export default function Ocean() {
  
  //  INYECCIÓN DE SHADERS "sombreado" (onBeforeCompile):
  // El material se genera una sola vez. Modificamos el MeshStandardMaterial nativo de Three.js 
  // inyectando nuestro código GLSL personalizado en puntos clave de su ciclo de compilación.
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.15, metalness: 0 });
    
    m.onBeforeCompile = (shader) => {
      // 1. Vinculación de Uniforms (Variables compartidas CPU -> GPU):
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uDeep = { value: new THREE.Color(SEA.deep) };
      shader.uniforms.uShallow = { value: new THREE.Color(SEA.shallow) };
      shader.uniforms.uSky = { value: new THREE.Color(SEA.sky) };
      shader.uniforms.uGlow = { value: SEA.glow };
      shader.uniforms.uFresnel = { value: SEA.fresnel };
      shader.uniforms.uRipple = { value: SEA.ripple };
      shader.uniforms.uFoamFrom = { value: SEA.foamFrom };
      shader.uniforms.uFoamTo = { value: SEA.foamTo };

      // 2. Modificaciones al Vertex Shader (Físicas del oleaje):
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", VERTEX_DECLARATIONS)
        .replace(
          "#include <beginnormal_vertex>",
          `#include <beginnormal_vertex>
           float wh; vec2 wg;
           waveCalc(position.xy, wh, wg);
           objectNormal = normalize(vec3(-wg, 1.0)); // Inclina las normales para reaccionar correctamente a las luces`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           transformed.z += wh; // Desplaza físicamente la altura del vértice hacia arriba/abajo
           vWave = wh;          // Pasa la altura actual al shader de fragmento
           vWorld = (modelMatrix * vec4(transformed, 1.0)).xyz; // Almacena coordenadas de mundo`,
        );

      // 3. Modificaciones al Fragment Shader (Estética y renderizado):
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", FRAGMENT_DECLARATIONS)
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
           // Mezcla los colores profundo y claro basados en la altura de la ola
           diffuseColor.rgb = mix(uDeep, uShallow, smoothstep(-0.8, 0.8, vWave));
           // Genera espuma blanca en los picos más altos de las olas
           float foam = smoothstep(uFoamFrom, uFoamTo, vWave);
           diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), foam * 0.7);`,
        )
        // Difuminado de micro-ondas: Evita el parpadeo por interferencia (Efecto Moiré) a la distancia.
        .replace(
          "#include <normal_fragment_maps>",
          `#include <normal_fragment_maps>
           float rippleFade = 1.0 - smoothstep(60.0, 300.0, length(vViewPosition));
           vec2 rg = rippleGrad(vWorld.xz) * uRipple * rippleFade;
           normal = normalize(normal - (viewMatrix * vec4(rg.x, 0.0, rg.y, 0.0)).xyz); // Deforma las normales para el brillo solar`,
        )
        // Efecto Fresnel (Reflejos dinámicos) e iluminación indirecta:
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
           // Fresnel: Brillo reflectivo que aumenta cuando la cámara mira con un ángulo rasante hacia el horizonte
           float fres = pow(1.0 - clamp(dot(normalize(vViewPosition), normal), 0.0, 1.0), 4.0);
           totalEmissiveRadiance += uSky * fres * uFresnel;  // Reflejo del color celeste del cielo
           totalEmissiveRadiance += diffuseColor.rgb * uGlow; // Luz interna simulada del agua
           totalEmissiveRadiance += vec3(foam) * 0.3;         // Brillo sutil para destacar la espuma`,
        );
      
      // Guarda la referencia del shader compilado para actualizarlo dinámicamente
      m.userData.shader = shader;
    };
    return m;
  }, []);

  // COMPENSACIÓN DE RENDIMIENTO EN GPU:
  // A diferencia del método del docente que calcula olas en la CPU (saturando el hilo principal),
  // aquí los cálculos complejos corren en la tarjeta gráfica a nivel de hardware.
  // useFrame únicamente se encarga de enviar el contador de tiempo global para la animación.
  useFrame(({ clock }) => {
    const shader = material.userData.shader;
    if (shader) shader.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      position-y={5} // Elevación del plano del mar en el eje Y global.
      rotation={[-Math.PI / 2, 0, 0]} // Rota el plano horizontalmente para que actúe como suelo.
      receiveShadow
      material={material}
    >
      <planeGeometry
        args={[OCEAN_SIZE, OCEAN_SIZE, OCEAN_SEGMENTS, OCEAN_SEGMENTS]}
      />
    </mesh>
  );
}
