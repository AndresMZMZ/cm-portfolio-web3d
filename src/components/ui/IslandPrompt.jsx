import { ISLANDS } from '@/config/islands'
import { MODES, useGameStore } from '@/store/useGameStore'

// Muestra el botón en pantalla para interactuar con la isla más cercana.
// El rango de activación se ajusta en config/islands.js; el aspecto está definido aquí.
export default function IslandPrompt() {
  // ESTADO GLOBAL:'mode': Obtiene la fase actual (ej. Menú, Navegación, Viendo Panel, etc.).
  const mode = useGameStore((s) => s.mode)
  // 'nearIsland': Almacena el ID de la isla si el barco está dentro de su radio, o 'null' si no lo esta.
  const nearIsland = useGameStore((s) => s.nearIsland)
  // 'openPanel': permite abrir la información detallada de una isla.
  const openPanel = useGameStore((s) => s.openPanel)

  // COMPROBACIONES DE SEGURIDAD (Condiciones de renderizado):
  // Si el usuario no está navegando libremente O no está cerca de ninguna isla, el botón se destruye (no se dibuja nada).
  // El botón solo aparece en modo navegación y dentro del rango de una isla.
  if (mode !== MODES.NAVIGATION || !nearIsland) return null
  // BÚSQUEDA DE DATOS:
  // Busca en la base de datos de configuración (ISLANDS) el objeto que coincida con el ID de la isla cercana.
  const island = ISLANDS.find((i) => i.id === nearIsland)
  // Si por alguna razón el ID guardado en el estado no existe en la configuración, cancela el renderizado.
  if (!island) return null

  return (
    // CONTENEDOR DE LA INTERFAZ:
    // 'position: fixed' para superponerlo encima del canvas.
    // 'bottom: 48' e 'left: 50%' con 'translateX(-50%)' lo centran en la parte inferior de la pantalla.
    // 'zIndex: 10' permite que el botón se dibuje y sea clickeable.
    <div style={{ position: 'fixed', bottom: 48, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
      
      {/* BOTÓN DE INTERACCIÓN:
          'onClick': Al hacer clic con el mouse, ejecuta 'openPanel' pasando el ID de la isla actual para abrir su menú. */}
      <button
        type="button"
        onClick={() => openPanel(island.id)}
        style={{ 
          padding: '12px 22px',          // Espaciado (arriba/abajo, lados) del botón
          fontSize: 18,                  // Tamaño del texto bott
          fontFamily: 'sans-serif',      // Tipo de letra
          cursor: 'pointer',             // Cambia el puntero del mouse a una mano al pasar por encima
          borderRadius: 10,              // Bordes redondeados
          border: '2px solid #fff',      // Línea de borde de 2 píxeles
          background: 'rgba(11,19,41,0.85)', // Fondo oscuro semitransparente
          color: '#fff'                  // Color de la letra
        }}
      >
        {/* Muestra dinámicamente el nombre de la isla actual en el botón */}
        Ver {island.name} <kbd>Enter</kbd>
      </button>
    </div>
  )
}