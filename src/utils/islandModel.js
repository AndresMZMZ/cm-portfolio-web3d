import * as THREE from 'three'

// Utilidades para la isla de redes (HU28): preparan el modelo cargado y calculan valores de calibración.

// Prepara el modelo de una isla cargado con useGLTF:
// - Activa sombras (emitir y recibir) en todas las mallas, igual que Island.jsx.
// - Oculta únicamente los nodos indicados.
// - Mide las mallas incluidas y usa la playa como referencia de altura.
// Devuelve las dimensiones visibles y la referencia de playa, o null si faltan.
export function prepareIslandModel(root, { hidden = [], beach, includeMesh = () => true }) {
  const meshes = []
  root.traverse((object) => {
    if (hidden.includes(object.name)) object.visible = false
    if (object.isMesh) {
      object.castShadow = true
      object.receiveShadow = true
      if (includeMesh(object)) meshes.push(object)
    }
  })
  root.updateMatrixWorld(true)

  const box = new THREE.Box3()
  meshes.forEach((mesh) => box.expandByObject(mesh))
  const beachNode = root.getObjectByName(beach)
  if (!beachNode?.isMesh || !meshes.includes(beachNode) || box.isEmpty()) return null

  const beachBox = new THREE.Box3().setFromObject(beachNode)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const beachSize = beachBox.getSize(new THREE.Vector3())
  return {
    center,
    top: beachBox.max.y,
    size,
    bounds: { min: box.min.clone(), max: box.max.clone() },
    beachSize,
    heightAboveBeach: box.max.y - beachBox.max.y,
    radiusX: beachSize.x / 2,
    radiusZ: beachSize.z / 2,
  }
}

const round = (n) => Math.round(n * 10) / 10

// Calcula los valores para config/islands.js usando una escala que ajuste la arena al radio objetivo.
// La arena se trata como un disco: 3 cuboides (una cruz y un cuadrado inscrito) lo cubren sin salirse mucho.
export function suggestIslandSetup(
  { radiusX, radiusZ, heightAboveBeach },
  { beachY, targetRadius = 333, bottom = -65 },
) {
  const suggestedScale = Math.round((targetRadius / Math.min(radiusX, radiusZ)) * 1000) / 1000
  const rx = radiusX * suggestedScale
  const rz = radiusZ * suggestedScale
  const box = (label, hx, hz) => ({
    label,
    left: round(-hx), right: round(hx), back: round(-hz), front: round(hz), bottom, top: beachY,
  })
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
    colliders: [
      box('arena-ancho', rx, 0.45 * rz),
      box('arena-largo', 0.45 * rx, rz),
      box('arena-diagonal', 0.707 * rx, 0.707 * rz),
    ],
    signs,
    titleOffset: [0, round(beachY + heightAboveBeach * suggestedScale + 18), 32],
  }
}
