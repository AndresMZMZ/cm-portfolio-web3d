import { ISLANDS } from '@/config/islands'
import { MODES, useGameStore } from '@/store/useGameStore'

export default function IslandPrompt() {
  const mode = useGameStore((s) => s.mode)
  const nearIsland = useGameStore((s) => s.nearIsland)
  const openPanel = useGameStore((s) => s.openPanel)

  // El botón solo existe navegando y dentro del rango de una isla
  if (mode !== MODES.NAVIGATION || !nearIsland) return null
  const island = ISLANDS.find((i) => i.id === nearIsland)

  return (
    <div style={{ position: 'fixed', bottom: 48, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
      <button
        type="button"
        onClick={() => openPanel(island.id)}
        style={{ padding: '12px 22px', fontSize: 18, fontFamily: 'sans-serif', cursor: 'pointer', borderRadius: 10, border: '2px solid #fff', background: 'rgba(11,19,41,0.85)', color: '#fff' }}
      >
        Ver {island.name} <kbd>Enter</kbd>
      </button>
    </div>
  )
}