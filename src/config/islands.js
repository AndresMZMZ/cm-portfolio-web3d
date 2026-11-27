// Configuración de las islas del portafolio: ubicación, aspecto e interacción y colisiones con el barco (HU09).
export const ISLANDS = [
  {
    id: 'proyectos',
    name: 'Isla de Proyectos', 
    title: 'EL FARO DE LOS PROYECTOS',
    position: [0, 0, -80], // Centro de la isla en el mundo: [X, Y, Z].
    rotationY: 0, // Rotación sobre el eje vertical, en radianes.

    // Aquí manipulas la altura (eje Y) de la isla respecto al nivel del mar (SHIP.waterline = 5).
    modelY: 107.068,
    // Aquí se puede manipular la escala de la isla respecto al barco.
    modelScale: 0.7, // Escala uniforme de todo el modelo; modifica el tamaño general.
    titleOffset: [18, 129, 77], // Desplazamiento del letrero [X, Y, Z].
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
        top: 125, // borde superior (+Y)
      },
    ],
  },
  // Isla de redes y hv (HU28): modelo se ubica en public/models/isla-redes.glb, dibujado por IslandRedes.jsx.
  // El modelo se centra con las mallas Agua_Exterior/Fortress_* y la arena queda a la altura beachY.
  {
    id: 'redes',
    name: 'Isla de Redes y Hoja de Vida',
    title: 'EL PUERTO DE LAS REDES',
    position: [950, 0, 260],
    beachY: 5, // Altura de la superficie de la arena en el eje Y.
    modelScale: 0.7,
    rotationY: 0, // Rotación de la isla sobre el eje vertical, en radianes.

    modelY: 107.068, // Altura del modelo respecto al nivel del mar (SHIP.waterline = 5).
    titleOffset: [-25, 228, 68],
    interactRadius: 500,
    minSpeed: 0.35, 
    description: 'Redes sociales, estudios y gustos del autor, con enlace a su hoja de vida.',
   
    // Cuboide de colisión (IslandColliders.jsx); bordes relativos al centro de la isla.
    colliders: [
      {
        label: 'isla',
        left: -205,  
        right: 245, 
        back: -264,  
        front: 245, 
        bottom: -65, 
        top: 7,
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