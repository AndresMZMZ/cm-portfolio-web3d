// Configuración de las islas del portafolio: ubicación, aspecto e interacción y colisiones con el barco (HU09).
export const ISLANDS = [
  {
    id: 'proyectos', // Identificador para reconocer esta isla en la escena.
    name: 'Isla de Proyectos', 
    title: 'EL FARO DE LOS PROYECTOS', // Letrero 3D que aparece al acercarse el barco.
    position: [0, 0, -80], // Centro de la isla en el mundo: [X, Y, Z].

    // Aquí manipulas la altura (eje Y) de la isla respecto al nivel del mar (SHIP.waterline = 5).
    modelY: 107.068,
    // Aquí manipulas la escala de la isla respecto al barco.
    modelScale: 0.7, // Escala uniforme de todo el modelo; modifica el tamaño general.
    titleOffset: [18, 129, 77], // Desplazamiento del letrero [X, Y, Z] respecto al centro de la isla.
    interactRadius: 280, // Radio desde el centro: al entrar, aparece el botón y empieza el frenado.
    minSpeed: 0.35, // Velocidad mínima permitida dentro del radio, como fracción de SHIP.speed (0.35 = 35%).
    description: 'Isla principal del portafolio con proyectos de desarrollo web y diseño 3D.',

    // Collider continuo para la roca y el muelle; evita juntas y solapes entre cajas.
    // Los bordes son relativos al centro de la isla; los límites del mundo están en config/world.js.
    colliders: [
      {
        label: 'isla',
        left: -75,   // borde izquierdo (-X)
        right: 121.52, // borde derecho (+X)
        back: -167,  // borde trasero (-Z, hacia el fondo)
        front: 35,   // borde delantero (+Z, hacia donde nace el barco)
        bottom: -65, // borde inferior (-Y,sumergido bajo el agua)
        top: 7, // borde superior (+Y)
      },
    ],
  },
];