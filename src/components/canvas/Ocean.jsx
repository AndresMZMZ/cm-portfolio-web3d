// INICIO archivo reemplazado
import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

// PARÁMETROS DEL MAR: cámbialos y mira el resultado en pantalla
const SEA = {
  deep: '#0d6ea8',    // color del valle de la ola (azul profundo)
  shallow: '#3fc1e6', // color de la cresta (turquesa claro)
  sky: '#bfe0ff',     // color del cielo que se refleja en el agua
  glow: 0.3,          // luz propia del agua; sube este valor si se ve oscura
  fresnel: 0.9,       // cuánto cielo se refleja al mirar de lado (0 = nada, 1.5 = mucho)
  ripple: 0.35,       // fuerza de las ondas pequeñas que hacen brillar el sol (0 = agua lisa)
  foamFrom: 0.5,      // altura donde empieza la espuma
  foamTo: 0.85,       // altura donde la espuma es máxima
}

const VERTEX_DECLARATIONS = /* glsl */ `
  #include <common>
  uniform float uTime;
  varying float vWave;
  varying vec3 vWorld;

  // Suma una ola: devuelve la altura (h) y la pendiente (g)
  void addWave(vec2 p, vec2 dir, float k, float amp, float speed, inout float h, inout vec2 g) {
    vec2 d = normalize(dir);
    float phase = dot(d, p) * k + uTime * speed;
    h += amp * sin(phase);
    g += amp * k * cos(phase) * d;
  }
  void waveCalc(vec2 p, out float h, out vec2 g) {
    h = 0.0;
    g = vec2(0.0);
    addWave(p, vec2(1.0, 0.4),  0.05, 0.45, 1.0, h, g); // ola grande y lenta
    addWave(p, vec2(-0.3, 1.0), 0.11, 0.25, 1.4, h, g); // ola media
    addWave(p, vec2(0.7, -0.8), 0.23, 0.12, 2.0, h, g); // ola pequeña y rápida
  }
`

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

  // Una onda pequeña: devuelve su pendiente en el plano XZ
  vec2 ripple(vec2 p, vec2 dir, float k, float speed, float amp) {
    vec2 d = normalize(dir);
    float phase = dot(d, p) * k + uTime * speed;
    return d * (k * amp * cos(phase));
  }
  vec2 rippleGrad(vec2 p) {
    vec2 g = vec2(0.0);
    g += ripple(p, vec2(1.0, 0.3),   0.9, 1.7, 0.30);
    g += ripple(p, vec2(-0.6, 1.0),  1.3, 2.1, 0.22);
    g += ripple(p, vec2(0.4, -1.0),  2.1, 2.8, 0.15);
    g += ripple(p, vec2(-1.0, -0.5), 3.4, 3.5, 0.10);
    return g;
  }
`

export default function Ocean() {
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.15, metalness: 0 })
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 }
      shader.uniforms.uDeep = { value: new THREE.Color(SEA.deep) }
      shader.uniforms.uShallow = { value: new THREE.Color(SEA.shallow) }
      shader.uniforms.uSky = { value: new THREE.Color(SEA.sky) }
      shader.uniforms.uGlow = { value: SEA.glow }
      shader.uniforms.uFresnel = { value: SEA.fresnel }
      shader.uniforms.uRipple = { value: SEA.ripple }
      shader.uniforms.uFoamFrom = { value: SEA.foamFrom }
      shader.uniforms.uFoamTo = { value: SEA.foamTo }

      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', VERTEX_DECLARATIONS)
        .replace(
          '#include <beginnormal_vertex>',
          `#include <beginnormal_vertex>
           float wh; vec2 wg;
           waveCalc(position.xy, wh, wg);
           objectNormal = normalize(vec3(-wg, 1.0));`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           transformed.z += wh;
           vWave = wh;
           vWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`
        )

      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', FRAGMENT_DECLARATIONS)
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
           diffuseColor.rgb = mix(uDeep, uShallow, smoothstep(-0.8, 0.8, vWave));
           float foam = smoothstep(uFoamFrom, uFoamTo, vWave);
           diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), foam * 0.7);`
        )
        // Ondas finas: inclinan la normal; se desvanecen con la distancia para que no parpadeen a lo lejos
        .replace(
          '#include <normal_fragment_maps>',
          `#include <normal_fragment_maps>
           float rippleFade = 1.0 - smoothstep(60.0, 300.0, length(vViewPosition));
           vec2 rg = rippleGrad(vWorld.xz) * uRipple * rippleFade;
           normal = normalize(normal - (viewMatrix * vec4(rg.x, 0.0, rg.y, 0.0)).xyz);`
        )
        // Reflejo del cielo (Fresnel), luz propia del agua y espuma blanca
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
           float fres = pow(1.0 - clamp(dot(normalize(vViewPosition), normal), 0.0, 1.0), 4.0);
           totalEmissiveRadiance += uSky * fres * uFresnel;
           totalEmissiveRadiance += diffuseColor.rgb * uGlow;
           totalEmissiveRadiance += vec3(foam) * 0.3;`
        )
      m.userData.shader = shader
    }
    return m
  }, [])

  // El docente anima en la CPU con useFrame (clase 5), pero usamos un shader porque las olas
  // y las ondas finas se calculan en la GPU y mejoran los FPS. useFrame solo actualiza el tiempo.
  useFrame(({ clock }) => {
    const shader = material.userData.shader
    if (shader) shader.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={material}>
      <planeGeometry args={[1000, 1000, 256, 256]} />
    </mesh>
  )
}
// FIN archivo reemplazado