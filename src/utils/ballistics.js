import { BULLET } from "@/config/bullets";
import { WAVES } from "@/config/waves";
import { sampleWave } from "@/utils/waves";

// Balística HU13: integra con el mismo paso fijo de Rapier y busca la superficie animada del mar.
// Nombres en inglés: GRAVITY (gravedad efectiva), flight time (tiempo de vuelo), range (alcance).

// ALERTA: GRAVITY supone que <Physics> usa la gravedad por defecto de 9.81. Si la cambiaste, ajusta este valor.
export const GRAVITY = 9.81 * BULLET.gravityScale;
const MAX_WAVE_HEIGHT = WAVES.reduce((total, wave) => total + wave.amplitude, 0);
const impactPointScratch = { x: 0, y: 0, z: 0 };
const impactWaveScratch = { height: 0, slopeX: 0, slopeZ: 0 };

// Posición del proyectil usando la integración semi-implícita de Rapier.
export function getBallisticPoint(position, velocity, time, out = {}) {
  const step = BULLET.physicsTimeStep;
  const completedSteps = Math.floor(time / step);
  const remainder = Math.max(0, time - completedSteps * step);
  const completedTime = completedSteps * step;
  const verticalAtStep =
    position[1] +
    velocity[1] * completedTime -
    0.5 *
      GRAVITY *
      step *
      step *
      completedSteps *
      (completedSteps + 1);
  const verticalVelocity = velocity[1] - GRAVITY * completedTime;
  out.x = position[0] + velocity[0] * time;
  out.y =
    verticalAtStep +
    (verticalVelocity - GRAVITY * step) * remainder;
  out.z = position[2] + velocity[2] * time;
  return out;
}

// Segundos hasta que el paso de física cruza seaLevel, partiendo de y0 con velocidad vy.
export function getFlightTime(vy, y0, seaLevel = BULLET.seaLevel) {
  const discriminant = vy * vy + 2 * GRAVITY * (y0 - seaLevel);
  if (discriminant < 0) return Number.NaN;
  const estimate = (vy + Math.sqrt(discriminant)) / GRAVITY;
  const step = BULLET.physicsTimeStep;
  const maxSteps = Math.ceil(estimate / step) + 2;
  let previousClearance = y0 - seaLevel;
  const position = [0, y0, 0];
  const velocity = [0, vy, 0];

  for (let index = 1; index <= maxSteps; index++) {
    const time = index * step;
    const point = getBallisticPoint(position, velocity, time, impactPointScratch);
    const clearance = point.y - seaLevel;
    if (previousClearance > 0 && clearance <= 0) {
      const fraction = previousClearance / (previousClearance - clearance);
      return (index - 1 + fraction) * step;
    }
    previousClearance = clearance;
  }
  return estimate;
}

function waterClearance(position, velocity, startTime, time) {
  const point = getBallisticPoint(position, velocity, time, impactPointScratch);
  const wave = sampleWave(
    point.x,
    point.z,
    startTime + time,
    impactWaveScratch,
  );
  return point.y - BULLET.seaLevel - wave.height;
}

export function getImpactTime(position, velocity, startTime = 0) {
  const flatTime = getFlightTime(velocity[1], position[1]);
  if (!Number.isFinite(flatTime) || flatTime <= 0) return flatTime;

  const fallingSpeed = Math.max(
    1,
    Math.abs(velocity[1] - GRAVITY * flatTime),
  );
  const margin = Math.max(0.03, (MAX_WAVE_HEIGHT + 0.1) / fallingSpeed + 0.025);
  let low = Math.max(0, flatTime - margin);
  let high = flatTime + margin;
  let lowClearance = waterClearance(position, velocity, startTime, low);
  let highClearance = waterClearance(position, velocity, startTime, high);

  for (let attempt = 0; lowClearance <= 0 && low > 0 && attempt < 8; attempt++) {
    high = low;
    highClearance = lowClearance;
    low = Math.max(0, low - margin);
    lowClearance = waterClearance(position, velocity, startTime, low);
  }
  for (let attempt = 0; highClearance > 0 && attempt < 8; attempt++) {
    low = high;
    lowClearance = highClearance;
    high += margin;
    highClearance = waterClearance(position, velocity, startTime, high);
  }

  if (lowClearance <= 0 || highClearance > 0) return flatTime;
  for (let attempt = 0; attempt < 12; attempt++) {
    const middle = (low + high) / 2;
    if (waterClearance(position, velocity, startTime, middle) > 0) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

// Distancia horizontal desde el cañón hasta el punto de impacto en el agua, según la elevación.
// El giro lateral (yaw) no la cambia: solo rota la dirección sobre el plano horizontal.
export function getRange(elevation) {
  const verticalDirection = Math.sin(elevation);
  const horizontalSpeed = BULLET.speed * Math.cos(elevation);
  const launchHeight =
    BULLET.muzzleHeight + BULLET.spawnClearance * verticalDirection;
  const flightTime = getFlightTime(
    BULLET.speed * verticalDirection,
    launchHeight,
  );
  return (
    BULLET.spawnClearance * Math.cos(elevation) +
    horizontalSpeed * flightTime
  );
}