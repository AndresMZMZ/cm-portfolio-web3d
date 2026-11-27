import * as THREE from 'three'

// Disco para el océano (retroalimentación del docente: un océano redondo, no cuadrado).
// Es una malla radial: 'rings' anillos concéntricos con 'segments' vértices cada uno, en el plano XY (como PlaneGeometry).
// El radio de cada anillo crece con una potencia (power 2 = cuadrática), así hay más detalle cerca del centro,
// donde están las islas y el barco, y menos en el horizonte, donde las olas no se distinguen.
// Nombres en inglés: radius (radio), rings (anillos), segments (segmentos), power (potencia), vertexCount (cantidad de vértices).
// Puedes renombrarlos a tu gusto.
export function createOceanDiscGeometry(radius, rings, segments, power = 2) {
  const vertexCount = (rings + 1) * segments
  const positions = new Float32Array(vertexCount * 3)
  const normals = new Float32Array(vertexCount * 3)

  for (let i = 0; i <= rings; i++) {
    const ringRadius = radius * Math.pow(i / rings, power)
    for (let j = 0; j < segments; j++) {
      const angle = (j / segments) * Math.PI * 2
      const index = (i * segments + j) * 3
      positions[index] = Math.cos(angle) * ringRadius
      positions[index + 1] = Math.sin(angle) * ringRadius
      // positions[index + 2] queda en 0: el plano es plano; las olas las eleva el shader (Ocean.jsx).
      normals[index + 2] = 1 // El shader recalcula las normales; esto solo evita un atributo vacío.
    }
  }

  // Dos triángulos por celda, con el frente hacia +Z (el mismo sentido de PlaneGeometry antes de girarlo).
  const indices = new Uint32Array(rings * segments * 6)
  let k = 0
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < segments; j++) {
      const next = (j + 1) % segments // El último segmento se une con el primero y cierra el anillo
      const a = i * segments + j
      const b = (i + 1) * segments + j
      const c = (i + 1) * segments + next
      const d = i * segments + next
      indices[k++] = a
      indices[k++] = b
      indices[k++] = d
      indices[k++] = b
      indices[k++] = c
      indices[k++] = d
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.computeBoundingSphere()
  return geometry
}
