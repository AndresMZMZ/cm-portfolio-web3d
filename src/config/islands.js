// Configuración de las islas del portafolio: ubicación, aspecto e interacción y colisiones con el barco (HU09).
export const ISLANDS = [
  {
    id: 'proyectos', // Identificador para reconocer esta isla en la escena.
    name: 'Isla de Proyectos', 
    title: 'EL FARO DE LOS PROYECTOS', // Letrero 3D que aparece al acercarse el barco.
    position: [0, 0, -80], // Centro de la isla en el mundo: [X, Y, Z].
    rotationY: 0, // Rotación sobre el eje vertical, en radianes.

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
  // Isla de redes y hv (HU28): modelo se ubica en public/models/isla-redes.glb, dibujado por IslandRedes.jsx.
  // El modelo se centra con las mallas Agua_Exterior/Fortress_* y la arena queda a la altura beachY.
  {
    id: 'redes',
    name: 'Isla de Redes y Hoja de Vida',
    title: 'EL PUERTO DE LAS REDES',
    position: [950, 0, 260], // Centro de la isla en el mundo: [X, Y, Z]; a la derecha del camino hacia la isla del faro.
    beachY: 5, // Altura de la superficie de la arena, alineada con el nivel del océano.
    modelScale: 0.7, // Escala del modelo 3D del fortín.
    rotationY: 0, // Rotación de la isla para que el muelle quede frente al barco.

    titleOffset: [-25, 228, 68], // Posición del título 3D sobre la torre más alta del fortín.
    interactRadius: 500, // Distancia a la que aparece el botón "Ver Isla de Redes y Hoja de Vida".
    minSpeed: 0.35, // Velocidad mínima permitida dentro del radio, como fracción de SHIP.speed.
    description: 'Redes sociales, estudios y gustos del autor, con enlace a su hoja de vida.',
   
    // Cuboide de colisión (IslandColliders.jsx); bordes relativos al centro de la isla.
    colliders: [
      {
        label: 'isla',
        left: -205,   // borde izquierdo (-X)
        right: 245,   // borde derecho (+X)
        back: -264,   // borde trasero (-Z, hacia el fondo)
        front: 245,   // borde delantero (+Z, hacia el frente)
        bottom: -65,  // borde inferior (-Y, sumergido bajo el agua)
        top: 7,       // borde superior (+Y)
      },
    ],
    // Carteles clicables (IslandSigns.jsx). position = [X, Y, Z] relativo al centro de la isla; rotationY = hacia dónde miran.
    signs: [
      {
        id: 'github',
        label: 'GitHub',
        position: [-85, 7, 220], // ubicación en la playa frontal izquierda
        rotationY: -0.45,
        scale: 0.85,
        link: 'github',
      },
      {
        id: 'cv',
        label: 'Hoja de vida',
        position: [0, 7, 145], // ubicación en el centro frente al muelle
        rotationY: -0.45,
        scale: 0.85,
        panel: 'redes',
      },
      {
        id: 'facebook',
        label: 'Facebook',
        position: [115, 7, 130], // ubicación en la playa frontal derecha
        rotationY: -0.45,
        scale: 0.85,
        link: 'facebook',
      },
    ],
  },
]