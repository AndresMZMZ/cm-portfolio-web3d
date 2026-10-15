// src/data/portfolio.js
// Contenido del portafolio. Edita este archivo para cambiar textos, datos personales y enlaces.
// Un enlace vacío ('') se mostrará automáticamente como "Próximamente".

export const PROFILE = {
  name: 'Tu Nombre', // Reemplaza con tu nombre completo
  roles: [
    'Estudiante de Ingeniería de Sistemas', 
    'Full-Stack Developer', 
    'Creative Designer', 
    'Desarrollador Web 3D'
  ],
  summary: 'Apasionado por la creación de experiencias web interactivas y 3D utilizando tecnologías modernas como React Three Fiber y Vite.',
}

// Prácticas del curso por semana
export const PRACTICES = [
  { 
    week: 1, 
    title: 'Cubo interactivo con modo alambre', 
    description: 'Primer Canvas con React Three Fiber: un cubo de seis colores que cambia a malla de alambre con un clic.', 
    url: '' 
  },
  { 
    week: 2, 
    title: 'Anillo, nudo y escena controlada con el rostro', 
    description: 'Geometrías animadas con texto emisivo, un modelo 3D de un lago y la escena movida con la cabeza usando la cámara web.', 
    url: '' 
  },
  { 
    week: 3, 
    title: 'Matcaps y materiales PBR', 
    description: 'Texturas PBR y matcaps aplicados a superficies avanzadas de una escena 3D.', 
    url: '' 
  },
  { 
    week: 4, 
    title: 'Faro, roca y casa con luces y sombras', 
    description: 'Modelos 3D optimizados con iluminación dinámica, sombras y ambientación general de la escena.', 
    url: '' 
  },
  { 
    week: 5, 
    title: 'Abeja animada entre girasoles', 
    description: 'Eventos de interacción por teclado y mouse con cambio de animaciones sobre un modelo 3D con esqueleto.', 
    url: '' 
  },
]

// Repositorios destacados
export const REPOS = [
  { 
    title: 'cm-portfolio-web3d', 
    description: 'Portafolio web interactivo 3D con React, Three.js, R3F, Zustand, navegación por islas y despliegue automatizado.', 
    url: 'https://github.com/AndresMZMZ/cm-portfolio-web3d' 
  },
]