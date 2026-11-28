import { DAY_CYCLE } from "@/config/dayCycle";
import * as THREE from "three";

// Interpola la paleta del ciclo según la hora (de 0 a 1). Es una función pura: no toca la escena.
// Nombres en inglés: frame (fotograma), blend (mezcla), out (salida reutilizable).
const NUMBER_FIELDS = [
  "sunElevation", "turbidity", "rayleigh", "sunIntensity",
  "moonIntensity", "hemiIntensity", "night",
];
const COLOR_FIELDS = ["sunColor", "hemiSky", "hemiGround"];

// Los colores hexadecimales se convierten a THREE.Color una sola vez, al cargar el módulo.
const FRAMES = DAY_CYCLE.keyframes.map((key) => {
  const frame = { t: key.t };
  NUMBER_FIELDS.forEach((field) => (frame[field] = key[field]));
  COLOR_FIELDS.forEach((field) => (frame[field] = new THREE.Color(key[field])));
  return frame;
});

// Crea el objeto donde se guarda la paleta actual (se crea una vez y se reutiliza en cada frame).
export function createDayState() {
  const state = {};
  NUMBER_FIELDS.forEach((field) => (state[field] = 0));
  COLOR_FIELDS.forEach((field) => (state[field] = new THREE.Color()));
  return state;
}

// Calcula la paleta para la hora indicada y la escribe en 'out'. La última franja vuelve al primer fotograma.
export function getDayState(time, out = createDayState()) {
  const last = FRAMES.length - 1;
  let index = last;
  for (let i = 0; i < last; i++) {
    if (time >= FRAMES[i].t && time < FRAMES[i + 1].t) {
      index = i;
      break;
    }
  }
  const from = FRAMES[index];
  const to = FRAMES[(index + 1) % FRAMES.length];
  const toTime = index === last ? 1 : to.t;
  const blend = (time - from.t) / (toTime - from.t);

  NUMBER_FIELDS.forEach((field) => {
    out[field] = THREE.MathUtils.lerp(from[field], to[field], blend);
  });
  COLOR_FIELDS.forEach((field) => {
    out[field].lerpColors(from[field], to[field], blend);
  });
  return out;
}