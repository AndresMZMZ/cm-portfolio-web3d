import { DAY_CYCLE } from "@/config/dayCycle";
import { MODES, useGameStore } from "@/store/useGameStore";
import { useWorldStore } from "@/store/useWorldStore";
import { getDayState } from "@/utils/dayCycle";
import { worldState } from "@/utils/worldState";
import { useFrame } from "@react-three/fiber";

// Reloj del mundo (HU20): avanza la hora del ciclo y calcula la paleta del momento. No dibuja nada.
// Nombres en inglés: step (avance por frame), remaining (lo que falta para la hora fija), advance (avance permitido).
export default function WorldClock() {
  useFrame((_, delta) => {
    // Se limita delta para que al volver a la pestaña no se salte medio ciclo de golpe.
    const step = Math.min(delta, 0.1) / DAY_CYCLE.duration;
    const { cycleMode } = useWorldStore.getState();

    if (cycleMode === "auto") {
      const { mode } = useGameStore.getState();
      if (mode !== MODES.INTRO && mode !== MODES.SETTINGS) {
        worldState.time = (worldState.time + step) % 1;
      }
    } else {
      // Día o noche fijos: el reloj avanza (nunca retrocede) hasta la hora elegida y se queda ahí.
      const target = DAY_CYCLE.fixedTimes[cycleMode];
      const remaining = (target - worldState.time + 1) % 1;
      const advance = step * DAY_CYCLE.fixedSpeed;
      worldState.time = remaining <= advance ? target : worldState.time + advance;
    }

    getDayState(worldState.time, worldState.day);
  });

  return null;
}