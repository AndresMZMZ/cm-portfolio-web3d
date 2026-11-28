import { create } from "zustand";

// Preferencias del visitante sobre el mundo (HU20). El estado que cambia en cada frame NO va aquí, sino en utils/worldState.js.
// Nombres en inglés: cycleMode (modo del ciclo): "auto" = ciclo continuo, "day" = día fijo, "night" = noche fija.
export const useWorldStore = create((set) => ({
  cycleMode: "auto",
  setCycleMode: (cycleMode) => set({ cycleMode }),
}));