import * as THREE from 'three'

// Utilidades para la isla de redes (HU28): preparan el modelo 3D y calculan su calibración.

// Prepara la escena del modelo cargado: oculta objetos no deseados, activa sombras
// y mide las dimensiones usando la playa como nivel base del suelo (retorna null si falta).
export function prepareIslandModel(root, { hidden = [], beach, includeMesh = () => true }) {
  const meshes = []
   // Recorre toda la jerarquía del modelo para configurar visibilidad y sombras
  root.traverse((object) => {
    if (hidden.includes(object.name)) object.visible = false
    if (object.isMesh) {
      object.castShadow = true//Proyecta sombra sobre otros objetos
      object.receiveShadow = true//Recibe sombra de otros objetos
      if (includeMesh(object)) meshes.push(object)
    }
  })
  // Actualiza las transformaciones globales antes de medir
  root.updateMatrixWorld(true)

  // Calcula la caja (box) envolvente total y valida que exista la malla de la playa
  const box = new THREE.Box3()
  meshes.forEach((mesh) => box.expandByObject(mesh))
  const beachNode = root.getObjectByName(beach)
  if (!beachNode?.isMesh || !meshes.includes(beachNode) || box.isEmpty()) return null

  // Extrae medidas clave y radios de la playa para escalar el terreno
  const beachBox = new THREE.Box3().setFromObject(beachNode)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const beachSize = beachBox.getSize(new THREE.Vector3())
  return {
    center,
    top: beachBox.max.y, // Altura máxima de la arena (nivel del suelo)
    size,
    bounds: { min: box.min.clone(), max: box.max.clone() },
    beachSize,
    heightAboveBeach: box.max.y - beachBox.max.y, // Altura de elementos sobre la arena
    radiusX: beachSize.x / 2,
    radiusZ: beachSize.z / 2,
  }
}

// Redondea a un decimal para mantener limpias las coordenadas de configuración
const round = (n) => Math.round(n * 10) / 10

// Calcula los valores para config/islands.js usando una escala que ajuste la arena al radio objetivo.
// La arena se trata como un disco: 3 cuboides (una cruz y un cuadrado inscrito) lo cubren sin salirse mucho.
export function suggestIslandSetup(
  { radiusX, radiusZ, heightAboveBeach },
  { beachY, targetRadius = 333, bottom = -65 },
) {
  // Factor de escala necesario para alcanzar el radio objetivo sin deformar la isla.
  const suggestedScale = Math.round((targetRadius / Math.min(radiusX, radiusZ)) * 1000) / 1000
  const rx = radiusX * suggestedScale
  const rz = radiusZ * suggestedScale
  // Genera una caja de colisión rectangular centrada en el origen
  const box = (label, hx, hz) => ({
    label,
    left: round(-hx), right: round(hx), back: round(-hz), front: round(hz), bottom, top: beachY,
  })

  // Distribuye 3 letreros en arco frontal (-35°, 0°, 35°) al 76% del radio de la playa
  const signRadius = 0.76 * Math.min(rx, rz)
  const signs = [-35, 0, 35].map((degrees) => {
    const angle = (degrees * Math.PI) / 180
    return {
      position: [round(signRadius * Math.sin(angle)), beachY, round(signRadius * Math.cos(angle))],
      rotationY: Math.round(angle * 100) / 100,
    }
  })
  return {
    radius: round(Math.min(rx, rz)),
    modelScale: suggestedScale,
    suggestedScale,
    // Cajas de colisión que cubren el área caminable de la isla
    colliders: [
      box('arena-ancho', rx, 0.45 * rz),
      box('arena-largo', 0.45 * rx, rz),
      box('arena-diagonal', 0.707 * rx, 0.707 * rz),
    ],
    signs,
    titleOffset: [0, round(beachY + heightAboveBeach * suggestedScale + 18), 32],
  }
}
