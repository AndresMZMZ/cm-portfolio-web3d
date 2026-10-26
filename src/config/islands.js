// Configuración de las islas del portafolio: ubicación, aspecto e interacción con el barco.
export const ISLANDS = [
  {
    id: 'proyectos', // Identificador para reconocer esta isla.
    name: 'Isla de Proyectos', // Nombre 
    title: 'EL FARO DE LOS PROYECTOS', // Letrero 3D que aparece al acercarse el barco.
    position: [0, 0, -80], // Centro de la isla en el mundo: [X, Y, Z].
    modelY: 109, // Altura (Eje Y) del modelo de la isla; aumenta para elevarlo.
    modelScale: 0.7, // Escala uniforme de todo el modelo; modifica el tamaño general.
    titleOffset: [18, 129, 77], // Desplazamiento del letrero [X, Y, Z] respecto al centro de la isla.
    interactRadius: 280, // Radio desde el centro: al entrar, aparece el botón y empieza el frenado.
    minSpeed: 0.35, // Velocidad mínima dentro del radio, como fracción de SHIP.speed (0.35 = 35%).
    description: 'Isla principal del portafolio con proyectos de desarrollo web y diseño 3D.', // Descripción del panel de esta isla.
  },
]