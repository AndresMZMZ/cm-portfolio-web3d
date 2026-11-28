// VECTOR DE ILUMINACIÓN SOLAR A NIVEL GLOBAL:
// Define la posición exacta del disco solar visual en la cúpula celeste [X, Y, Z].
export const SUN_POSITION = [80, 16, 0] // baja sobre el horizonte = atardecer

// AMPLITUD DE LA LUZ DE DIRECCIÓN:
// Distancia matemática (en unidades 3D) a la que se colocará el nodo físico de la luz direccional.
 export const LIGHT_DISTANCE = 80 

// MAGNITUD DEL VECTOR SOLAR (Hipotenusa):
// Calcula el módulo o longitud real del vector desde el origen [0,0,0] hasta la posición del Sol.
// Utiliza el teorema de Pitágoras generalizado (Math.hypot), que calcula la raíz cuadrada de la suma de los cuadrados
export const SUN_DISTANCE = Math.hypot(...SUN_POSITION);
const length = SUN_DISTANCE;

// VECTOR NORMALIZADO Y ESCALADO (Dirección final de la luz):
// Toma las coordenadas del sol visual y las transforma en un "vector unitario" (de longitud 1) dividiendo cada eje entre su longitud total,
export const SUN_OFFSET = SUN_POSITION.map((v) => (v / length) * LIGHT_DISTANCE)

// Dirección horizontal por la que sale y se pone el sol (azimut, en radianes), tomada de SUN_POSITION.
export const SUN_AZIMUTH = Math.atan2(SUN_POSITION[2], SUN_POSITION[0])
