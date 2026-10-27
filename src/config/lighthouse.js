// CONFIGURACIÓN FÍSICA Y VISUAL DEL FARO (LIGHTHOUSE)
export const LIGHTHOUSE = {
  // UBICACIÓN EXACTA DEL FOCO EN EL ESPACIO 3D:
  lampPosition: [15, 203, -32], 

  // DIMENSIONES DEL HAZ DE LUZ VOLUMÉTRICO:
  beamLength: 420,            // Alcance/Largo del haz: Qué tan lejos se proyecta el cono de luz en el horizonte
  beamRadius: 14,             // Ancho/Grosor del haz

  // VELOCIDAD DE GIRO DE LA LINTERNA:tiempo que tarda la luz en dar una rotación completa de 360 grados sobre el eje Y.
  period: 8,                  

  // ATRIBUTOS LUMÍNICOS:
  color: '#fff1c2',           // Tono de la luz
  intensity: 0.9,             // Opacidad visual:el efecto de niebla/polvo iluminado
  spotIntensity: 3000,        // Intensidad de la luz física (SpotLight) que ilumina dinámicamente el barco y el agua al pasar

  // MODO DE DESARROLLO (DEPURACIÓN):
  // Si está en 'true', dibuja una esfera de guía roja e incandescente en el punto exacto de 'lampPosition'.
  debug: false,                
}
