// VECTOR DE ILUMINACIÓN SOLAR A NIVEL GLOBAL:
// Define la posición exacta del disco solar visual en la cúpula celeste [X, Y, Z].
export const SUN_POSITION = [80, 16, 0] // baja sobre el horizonte = atardecer

// AMPLITUD DE LA LUZ DE DIRECCIÓN:
// Distancia matemática (en unidades 3D) a la que se colocará el nodo físico de la luz direccional.
const LIGHT_DISTANCE = 80 

// MAGNITUD DEL VECTOR SOLAR (Hipotenusa):
// Calcula el módulo o longitud real del vector desde el origen [0,0,0] hasta la posición del Sol.
// Utiliza el teorema de Pitágoras generalizado (Math.hypot), que calcula la raíz cuadrada de la suma de los cuadrados
const length = Math.hypot(...SUN_POSITION)

// VECTOR NORMALIZADO Y ESCALADO (Dirección final de la luz):
// Toma las coordenadas del sol visual y las transforma en un "vector unitario" (de longitud 1) dividiendo cada eje entre su longitud total,
export const SUN_OFFSET = SUN_POSITION.map((v) => (v / length) * LIGHT_DISTANCE)
