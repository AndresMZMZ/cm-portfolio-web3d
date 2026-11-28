import { BULLET } from "@/config/bullets";

// Balística simple (HU13). Ignora olas, islas y viento: supone un mar plano a la altura BULLET.seaLevel.
// Nombres en inglés: GRAVITY (gravedad efectiva), flight time (tiempo de vuelo), range (alcance).

// ALERTA: GRAVITY supone que <Physics> usa la gravedad por defecto de 9.81. Si la cambiaste, ajusta este valor.
export const GRAVITY = 9.81 * BULLET.gravityScale;

// Segundos hasta que la bala baja a seaLevel, partiendo de la altura y0 con velocidad vertical vy.
export function getFlightTime(vy, y0) {
  const drop = y0 - BULLET.seaLevel;
  return (vy + Math.sqrt(vy * vy + 2 * GRAVITY * drop)) / GRAVITY;
}

// Distancia horizontal desde el cañón hasta el punto de impacto en el agua, según la elevación.
// El giro lateral (yaw) no la cambia: solo rota la dirección sobre el plano horizontal.
export function getRange(elevation) {
  const vy = BULLET.speed * Math.sin(elevation);
  const horizontalSpeed = BULLET.speed * Math.cos(elevation);
  return horizontalSpeed * getFlightTime(vy, BULLET.muzzleHeight);
}