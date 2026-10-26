import { useMemo } from 'react'

/**
 * Hook personalizado del mapeo del teclado para Drei.
 * Se encarga de asociar una acción lógica (name) con las teclas físicas correspondientes (keys).
 */
export function useGameKeyboardMap() {
  // 'useMemo' memoriza este arreglo para que no se vuelva a calcular ni recrear en la memoria 
  return useMemo(() => [
    
    // MOVIMIENTO DEL BARCO (Exclusivo con Flechas del teclado):
    // Controlan la navegación libre por el océano en el modo de navegación base.
    { name: 'forward', keys: ['ArrowUp'] },    // Avanzar hacia el frente con la Flecha Arriba
    { name: 'back', keys: ['ArrowDown'] },    // Retroceder o frenar con la Flecha Abajo
    { name: 'left', keys: ['ArrowLeft'] },    // Girar a la izquierda con la Flecha Izquierda
    { name: 'right', keys: ['ArrowRight'] },  // Girar a la derecha con la Flecha Derecha    
    
    // CONTROL DE LA RETÍCULA DE CAÑONES (Teclas W, A, S, D):
    // Mueven la mira/puntero de disparo de forma independiente a hacia dónde navega el barco.
    { name: 'targetUp', keys: ['KeyW'] },     // Mover la mira hacia arriba (elevar el cañón)
    { name: 'targetDown', keys: ['KeyS'] },   // Mover la mira hacia abajo (bajar el cañón)
    { name: 'targetLeft', keys: ['KeyA'] },   // Desplazar la mira hacia la izquierda
    { name: 'targetRight', keys: ['KeyD'] },  // Desplazar la mira hacia la derecha
    
    // MODOS DE COMBATE Y ACTIVACIÓN DE FLANCOS:
    // Lógica para apuntar con los cañones laterales del barco y abrir fuego.
    { name: 'aimLeft', keys: ['KeyQ'] },      // Activar los cañones del lado izquierdo (babor) al presionar la Q
    { name: 'aimRight', keys: ['KeyE'] },     // Activar los cañones del lado derecho (estribor) al presionar la E
    { name: 'fire', keys: ['Space'] },        // Disparar las balas de cañón con la Barra Espaciadora
    { name: 'cancel', keys: ['Escape'] },     // Salir del modo apuntar, cerrar menús o paneles con la tecla Escape    
    
    // AUTO-NAVEGACIÓN (Piloto automático):
    // Activa un modo para que el barco mantenga una marcha constante hacia adelante sin presionar nada.
    { name: 'autoSail', keys: ['KeyZ'] },     // Activar / Desactivar piloto automático presionando la Z    
    
    // INTERACTUAR CON UNA ISLA CERCANA:
    // Permite abrir el panel de proyectos cuando el barco está dentro del radio de proximidad.
    { name: 'interact', keys: ['Enter', 'KeyF'] },
    
  ], []) // El arreglo vacío [] asegura que esto solo se ejecute una sola vez al cargar el juego.
}
