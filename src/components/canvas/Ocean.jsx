// (versión inicial plana: la HU05 la reemplaza con oleaje)
export default function Ocean() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color="#1e5f8a" roughness={0.35} metalness={0.1} />
    </mesh>
  )
}