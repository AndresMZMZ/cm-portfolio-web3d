// Islas del portafolio. position = [x, y, z] del centro de la isla en el mundo
export const ISLANDS = [
  {
    id: 'proyectos',
    name: 'Isla de Proyectos',
    title: 'EL FARO DE LOS PROYECTOS',
    position: [0, 0, -80],
    // INICIO líneas nuevas: antes estaban escritas dentro de App.jsx y del componente del título
    modelY: 15,                // altura a la que se coloca el modelo de la isla
    modelScale: 0.1,           // escala del modelo
    titleOffset: [0, 15, 9.9], // posición del título [x, y, z] relativa a la isla
    // FIN líneas nuevas
    interactRadius: 45, // distancia a la que el barco frena y aparece el botón
    minSpeed: 0.35,     // factor de velocidad junto a la isla (1 = normal)
    description: 'Isla principal del portafolio con proyectos de desarrollo web y diseño 3D.',
  },
]