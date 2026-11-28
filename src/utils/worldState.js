import { DAY_CYCLE } from "@/config/dayCycle";
import { createDayState, getDayState } from "@/utils/dayCycle";

// Estado compartido del mundo (HU20). Es un objeto mutable a propósito: WorldClock lo escribe en cada frame
// y los demás componentes lo leen dentro de useFrame, sin re-renderizar React 60 veces por segundo.
// Los pasos siguientes agregarán aquí el faro, el clima y los destellos.
// Nombres en inglés: worldState (estado del mundo), time (hora del ciclo, de 0 a 1), day (paleta del momento).
export const worldState = {
  time: DAY_CYCLE.startTime,
  day: getDayState(DAY_CYCLE.startTime, createDayState()),
};