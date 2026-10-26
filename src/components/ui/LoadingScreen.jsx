import { PROFILE } from "@/data/portfolio";
import { MODES, useGameStore } from "@/store/useGameStore";
import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import "./LoadingScreen.css";

// CONFIGURACIÓN MATEMÁTICA Y DE SEGURIDAD PARA EL ANILLO DE CARGA:
const RADIUS = 148; // Radio del círculo en píxeles (desde el centro hasta el borde)
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // Perímetro total de la circunferencia
const MAX_WAIT_MS = 20000; // Sistema contra bloqueos: Fuerza el botón tras 20 segundos si una textura falla

export default function LoadingScreen() {
  // HOOK DE PROGRESO DE DREI:
  // Monitorea la carga asíncrona de geometrías 3D, texturas y shaders del Canvas de Three.js
  // 'progress': Porcentaje numérico actual. 'active': true si sigue descargando. 'errors': Array con fallas de red.
  const { progress, active, errors } = useProgress();

  // SELECTORES DEL ESTADO GLOBAL (Zustand):
  const mode = useGameStore((s) => s.mode); // Modo actual (INTRO, NAVIGATION, etc.)
  const startGame = useGameStore((s) => s.startGame); // Función que cambia el estado  modo de INTRO a NAVIGATION

  // ESTADOS LOCALES DE REACT:
  const [roleIndex, setRoleIndex] = useState(0); // Índice del rol actual que se muestra en pantalla
  const [ready, setReady] = useState(false); // true si se terminó de cargar o venció el temporizador de seguridad
  const [gone, setGone] = useState(false); // true una vez que la pantalla terminó su animación FadeOut y puede ser desmontada por completo del DOM

  const buttonRef = useRef(null); // Referencia al botón HTML para forzar el enfoque del teclado
  const started = mode !== MODES.INTRO; // Bandera booleana: true si el juego ya inició y la pantalla debe ocultarse

  // EFECTO 1: EVALUACIÓN DEL PROGRESO DE TRES.JS
  // Evalúa el estado de descarga. Controla que el progreso avance unidireccionalmente y evita bloqueos permanentes al visitante si una textura secundaria falla.
  useEffect(() => {
    if (ready) return; // Si ya está listo, no vuelve a evaluar nada
    if (progress >= 100 && !active)
      setReady(true); // Carga exitosa: 100% completado y sin descargas activas
    else if (errors.length > 0) setReady(true); // Plan de contingencia: Si hay errores en consola, desbloquea la UI de igual forma
  }, [progress, active, errors, ready]);

  // EFECTO 2: TEMPORIZADOR DE RESPALDO
  // Inicia un reloj de 20 segundos al montar la pantalla. Si algún asset pesado se queda congelado,
  // el setTimeout fuerza el estado 'ready' a true para permitir el acceso al portafolio.
  useEffect(() => {
    const id = setTimeout(() => setReady(true), MAX_WAIT_MS);
    return () => clearTimeout(id); // Limpieza: Si la pantalla se desmonta antes, borra el temporizador para evitar fugas de memoria
  }, []);

  // EFECTO 3: CARRUSEL ROTATIVO DE ROLES (TEXTO)
  // Crea un intervalo cada 2.5 segundos para alternar de forma infinita entre los roles (Desarrollador, Diseñador, etc.).
  // Se apaga inmediatamente si el juego arranca (`started`) para ahorrar ciclos de CPU en segundo plano.
  useEffect(() => {
    if (started) return; // Detiene el bucle si ya empezó la navegación del barco
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % PROFILE.roles.length),
      2500,
    );
    return () => clearInterval(id); // Limpieza: Apaga el intervalo al desmontar o cambiar de estado
  }, [started]);

  // EFECTO 4: ACCESIBILIDAD AUTOMÁTICA DEL BOTÓN
  // Tan pronto como la carga finaliza, mueve el "foco" del navegador al botón principal de inicio.
  // Esto permite que el usuario inicie instantáneamente presionando la tecla 'Enter' o la barra espaciadora.
  useEffect(() => {
    if (ready) buttonRef.current?.focus();
  }, [ready]);

  // DESMONTAJE DEFINITIVO:
  // Si la animación de CSS terminó y 'gone' es true, borra por completo el HTML del árbol del navegador.
  if (gone) return null;

  // CÁLCULO DINÁMICO DE LA BARRA CIRCULAR:
  // Asegura que si está listo muestre 100%, de lo contrario toma el progreso real sin exceder el límite.
  const shown = ready ? 100 : Math.min(progress, 100);
  // Regla de 3 para el offset del trazo SVG: 0 significa anillo completamente dibujado; CIRCUMFERENCE significa anillo vacío.
  const offset = CIRCUMFERENCE * (1 - shown / 100);

  return (
    /* CONTENEDOR PRINCIPAL FLOTANTE:
       Aplica la clase 'ls-hidden' (opacidad 0) cuando 'started' es true.
       'onTransitionEnd' detecta cuándo el CSS de desvanecimiento de 0.6s terminó para activar setGone(true). */
    <div
      className={`ls-overlay ${started ? "ls-hidden" : ""}`}
      onTransitionEnd={(e) => {
        // Asegura que el evento provenga del contenedor principal y no de una animación de un elemento hijo.
        if (started && e.target === e.currentTarget) setGone(true);
      }}
    >
      {/* SECCIÓN VISUAL DE LA imagen de la rosa de los vientos */}
      <div
        className="ls-compass-container"
        role="progressbar"
        aria-label="Progreso de carga"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(shown)}
      >
        {/* Ilustración de fondo optimizada para renderizado prioritario (Next-gen images) */}
        <img
          src="/images/rosaDeLosVientos.webp"
          alt="Rosa de los vientos"
          width={300}
          height={300}
          decoding="async" // Permite al navegador procesar la imagen de forma paralela sin pausar el HTML
          fetchPriority="high" // Le indica al navegador que descargue esta imagen antes que otros scripts o recursos secundarios
          className="ls-compass-bg-img"
        />

        {/* Anillo de carga SVG */}
        <svg
          className="ls-compass-svg"
          viewBox="0 0 320 320"
          aria-hidden="true" // Oculto para lectores de pantalla ya que el contenedor padre maneja la semántica
        >
          {/* Círculo base (Línea guía gris de fondo) */}
          <circle className="ls-circle-bg" cx="160" cy="160" r={RADIUS} />
          {/* Círculo de progreso dinámico (Línea dorada variable) */}
          <circle
            className="ls-circle-progress"
            cx="160"
            cy="160"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE} // Define el patrón de guiones (el tamaño total del anillo)
            strokeDashoffset={offset} // Desfasa el inicio del trazo para "ocultar" la barra proporcionalmente
          />
        </svg>

        {/* Emblema central que muestra las iniciales del perfil (ej: "JD") */}
        <div className="ls-center-badge">
          <span className="ls-initials">{PROFILE.initials}</span>
        </div>
      </div>

      {/* TEXTO DEL PORCENTAJE (Formatea números menores a 10 agregando un cero a la izquierda, ej: 05%) */}
      <div className="ls-percent">
        {String(Math.round(shown)).padStart(2, "0")}
        <span>%</span>
      </div>

      {/* SECCIÓN DE TEXTOS INFORMATIVOS DEL PERFIL */}
      <h2 className="ls-title">{PROFILE.name}</h2>
      <div className="ls-role-container">
        {/* Muestra dinámicamente el rol actual correspondiente al índice del carrusel */}
        <span className="ls-role-text">{PROFILE.roles[roleIndex]}</span>
      </div>

      {/* BOTÓN DE ACCIÓN PRINCIPAL:
          Permanece bloqueado (`disabled={!ready}`) hasta que la carga termine o salte el límite de tiempo.
          Al hacer clic ejecuta 'startGame' para desvanecer la pantalla e iniciar el viaje en el mundo  3D. */}
      <button
        ref={buttonRef}
        type="button"
        className="ls-start-btn"
        disabled={!ready}
        onClick={startGame}
      >
        {ready ? "Inicia tu viaje en aguas misteriosas" : "Cargando aguas..."}
      </button>
    </div>
  );
}
