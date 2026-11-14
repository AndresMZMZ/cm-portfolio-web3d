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

    // Colisionadores fijos de la isla (HU09 / IslandColliders.jsx)
    // Bordes independientes de cada caja amarilla relativos al centro de la isla.
    // Modificar una cara mueve ese lado sin estirar las otras cinco. (el límite exterior del mar se ajusta en config/world.js).
    colliders: [
      {
        label: 'roca',
        left: -75,   // borde izquierdo (-X)
        right: 93,   // borde derecho (+X)
        back: -167,  // borde trasero (-Z, hacia el fondo)
        front: 35,   // borde delantero (+Z, hacia donde nace el barco)
        bottom: -65, // borde inferior (-Y,sumergido bajo el agua)
        top: 7, // borde superior (+Y)
      },
      {
        label: 'muelle',
        left: -9.48,
        right: 121.52, 
        back: -135.48,
        front: 5, 
        bottom: -65, 
        top: 7, 
      },
    ],
  },
];