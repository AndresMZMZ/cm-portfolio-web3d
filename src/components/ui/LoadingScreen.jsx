// INICIO archivo reemplazado
import { useProgress } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { PROFILE } from '@/data/portfolio'
import { MODES, useGameStore } from '@/store/useGameStore'
import './LoadingScreen.css'

const RADIUS = 148
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const MAX_WAIT_MS = 20000 // si algo no termina de cargar, el botón se habilita igual

export default function LoadingScreen() {
  // useProgress cuenta lo que carga Three.js (modelos y texturas); el Canvas debe estar montado detrás para que cargue
  const { progress, active, errors } = useProgress()
  const mode = useGameStore((s) => s.mode)
  const startGame = useGameStore((s) => s.startGame)
  const [roleIndex, setRoleIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const [gone, setGone] = useState(false)
  const buttonRef = useRef(null)
  const started = mode !== MODES.INTRO

  // El docente usa el progreso directo (clase 6), pero lo "enganchamos" porque useProgress puede llegar a 100
  // y volver a bajar cuando otro Suspense empieza a cargar, y el botón se bloquearía de nuevo
  useEffect(() => {
    if (ready) return
    if (progress >= 100 && !active) setReady(true)
    // Si falló un archivo, no dejamos al visitante bloqueado
    else if (errors.length > 0) setReady(true)
  }, [progress, active, errors, ready])

  // Plan B: si por cualquier razón el progreso no termina, se habilita a los 20 s
  useEffect(() => {
    const id = setTimeout(() => setReady(true), MAX_WAIT_MS)
    return () => clearTimeout(id)
  }, [])

  // Rotación de roles; se detiene al empezar para no gastar CPU con la pantalla oculta
  useEffect(() => {
    if (started) return
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % PROFILE.roles.length), 2500)
    return () => clearInterval(id)
  }, [started])

  // Al estar lista, el foco pasa al botón: Enter o espacio inician el viaje
  useEffect(() => {
    if (ready) buttonRef.current?.focus()
  }, [ready])

  // Al terminar el desvanecimiento se desmonta: ya no queda un temporizador ni una suscripción activa
  if (gone) return null

  const shown = ready ? 100 : Math.min(progress, 100)
  const offset = CIRCUMFERENCE * (1 - shown / 100)

  return (
    <div
      className={`ls-overlay ${started ? 'ls-hidden' : ''}`}
      onTransitionEnd={(e) => {
        if (started && e.target === e.currentTarget) setGone(true)
      }}
    >
      <div
        className="ls-compass-container"
        role="progressbar"
        aria-label="Progreso de carga"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(shown)}
      >
        {/* alt vacío: la imagen es decorativa; el progreso ya se anuncia en el progressbar */}
        <img
          src="/images/rosaDeLosVientos.webp"
          alt="Rosa de los vientos"
          width={300}
          height={300}
          decoding="async"
          fetchPriority="high"
          className="ls-compass-bg-img"
        />
        <svg className="ls-compass-svg" viewBox="0 0 320 320" aria-hidden="true">
          <circle className="ls-circle-bg" cx="160" cy="160" r={RADIUS} />
          <circle
            className="ls-circle-progress"
            cx="160"
            cy="160"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        {/* Insignia con las iniciales: el CSS ya existía, faltaba en el JSX */}
        <div className="ls-center-badge">
          <span className="ls-initials">{PROFILE.initials}</span>
        </div>
      </div>

      <div className="ls-percent">
        {String(Math.round(shown)).padStart(2, '0')}
        <span>%</span>
      </div>

      <h2 className="ls-title">{PROFILE.name}</h2>
      <div className="ls-role-container">
        <span className="ls-role-text">{PROFILE.roles[roleIndex]}</span>
      </div>

      <button ref={buttonRef} type="button" className="ls-start-btn" disabled={!ready} onClick={startGame}>
        {ready ? 'Inicia tu viaje en aguas misteriosas' : 'Cargando aguas...'}
      </button>
    </div>
  )
}
// FIN archivo reemplazado