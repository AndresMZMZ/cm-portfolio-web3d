# ⛵ Portafolio interactivo 3D

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast-purple?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js)](https://threejs.org/)
[![Status](https://img.shields.io/badge/Status-Sprint%201-yellow)]()

Portafolio web personal desarrollado con React y Three.js. El visitante navega por un océano en un barco y, al acercarse a islas específicas, puede abrir un panel con información que aporta al portafolio personal del autor.

<p align="center">
  <img src="docs/preview.gif" alt="Vista previa del portafolio" width="700">
  <br>
  <em>Vista previa: navegando el barco hasta la isla</em>
</p>

<p align="center">
  <a href="https://cm-portfolio-web3d.vercel.app">
    <img src="https://img.shields.io/badge/🚀_Demo_en_producción-Vercel-black?style=for-the-badge&logo=vercel" alt="Demo en producción en Vercel">
  </a>
</p>

---

## 📑 Tabla de Contenidos

- [Funcionalidades](#-funcionalidades)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación y ejecución local](#-instalación-y-ejecución-local)
- [Controles](#-controles)
- [Comandos](#-comandos)
- [Estructura del proyecto](#-estructura-del-proyecto--sprint-1)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Créditos y Licencias](#-créditos-y-licencias)
- [Autor](#-autor)

---

## ✨ Funcionalidades

- Escena 3D con océano animado e islas.
- Navegación del barco con teclado y reducción gradual de velocidad cerca de las islas.
- Título 3D y botón de interacción cuando el barco entra en el radio de las islas.
- Panel con información del perfil.
- Pantalla de carga con progreso y botón para iniciar la experiencia.
- Cámara libre de depuración, disponible en desarrollo con el parámetro `?debug`.

## 🛠️ Tecnologías

- **React 19** y **Vite** — Entorno de desarrollo rápido.
- **Three.js**, **React Three Fiber** y **Drei** — Renderizado de la escena 3D.
- **Zustand** — Gestión del estado global de navegación e interacción.

## 📋 Requisitos

- Node.js `20.19` o superior.
- npm.

## 🚀 Instalación y ejecución local

1. Clona el repositorio:

```bash
git clone https://github.com/AndresMZMZ/cm-portfolio-web3d.git
cd cm-portfolio-web3d
```

2. Instala las dependencias y ejecuta el servidor de desarrollo:

```bash
npm ci
npm run dev
```

3. Abre en el navegador la dirección que indique Vite; normalmente es `http://localhost:5173/`.

## 🎮 Controles

| Teclas                     | Acción                                                 |
| -------------------------- | ------------------------------------------------------ |
| Flecha arriba / abajo      | Avanzar / retroceder con el barco                      |
| Flecha izquierda / derecha | Girar el barco                                         |
| Enter                      | Abrir el panel cuando el barco está cerca de las islas |
| Escape                     | Cerrar el panel o volver a la navegación               |

### 🐛 Cámara de depuración

Durante el desarrollo, añade `?debug` a la dirección para inspeccionar la escena con controles de cámara:

```text
http://localhost:5173/?debug
```

## 💻 Comandos

| Comando              | Función                                     |
| -------------------- | ------------------------------------------- |
| 🟢 `npm run dev`     | Inicia el servidor de desarrollo.           |
| 🏗️ `npm run build`   | Genera la versión de producción en `dist/`. |
| 🚀 `npm run preview` | Sirve localmente la versión de producción.  |
| 🧹 `npm run lint`    | Ejecuta Oxlint.                             |

## 📂 Estructura del proyecto — Sprint 1

<details>
<summary>Ver estructura de carpetas</summary>

```text
cm-portfolio-web3d/
├── 📁 .github/                       # Configuración de GitHub
│   └── 📁 workflows/                 # Flujos de trabajo (CI/CD)
│       └── ⚙ ci.yml                  # Integración continua
├── 📁 docs/                          # Documentación y créditos
│   └── 📄 CREDITOS.md                # Atribuciones y licencias de recursos
├── 📁 public/                        # Recursos estáticos públicos
│   ├── 🌐 favicon.svg                # Icono del sitio
│   ├── 📁 fonts/                     # Tipografías personalizadas
│   │   └── 📄 PirataOne-Regular.ttf  # Fuente principal (Pirata One)
│   ├── 📁 images/                    # Recursos gráficos
│   │   └── 🖼 rosaDeLosVientos.webp  # Imagen decorativa
│   └── 📁 models/                    # Archivos 3D (.glb) estáticos
│       ├── 📦 barco-prueba.glb       # Modelo 3D del barco
│       └── 📦 lighthouse.glb         # Modelo 3D del faro
├── 📁 src/                           # Código fuente de la app
│   ├── 📁 components/                # Componentes de React
│   │   ├── 📁 canvas/                # Componentes de la escena 3D
│   │   │   ├── 📁 models/            # Componentes de modelos 3D
│   │   │   │   └── ◈ BarcoPrueba.jsx # Mallas del modelo del barco
│   │   │   ├── ◈ Atmosphere.jsx      # Cielo e iluminación
│   │   │   ├── ◈ FollowCamera.jsx    # Cámara que sigue al barco
│   │   │   ├── ◈ Island.jsx          # Modelo de la isla
│   │   │   ├── ◈ IslandTitle.jsx     # Título 3D de la isla
│   │   │   ├── ◈ LighthouseBeam.jsx  # Haz giratorio del faro
│   │   │   ├── ◈ Ocean.jsx           # Océano animado
│   │   │   └── ◈ Ship.jsx            # Movimiento del barco
│   │   └── 📁 ui/                    # Interfaz HTML y estilos
│   │       ├── ◈ IslandPrompt.jsx    # Botón para abrir la isla cercana
│   │       ├── ▤ LoadingScreen.css   # Estilos de la pantalla de carga
│   │       ├── ◈ LoadingScreen.jsx   # Pantalla inicial y progreso
│   │       ├── ▤ ProjectPanel.css    # Estilos del panel de proyectos
│   │       └── ◈ ProjectPanel.jsx    # Panel de proyectos y trayectoria
│   ├── 📁 config/                    # Parámetros ajustables de la escena
│   │   ├── ⌨ camera.js               # Configuración de la cámara
│   │   ├── ⌨ environment.js          # Luz y posición del sol
│   │   ├── ⌨ islands.js              # Datos y posiciones de las islas
│   │   ├── ⌨ keyboardMap.js          # Controles de teclado
│   │   ├── ⌨ lighthouse.js           # Ajustes del faro
│   │   └── ⌨ ship.js                 # Físicas y movimiento del barco
│   ├── 📁 data/                      # Datos y contenido
│   │   └── ⌨ portfolio.js            # Perfil, prácticas y enlaces
│   ├── 📁 hooks/                     # Hooks personalizados
│   │   └── ⟲ useModeKeys.js          # Acciones de teclado y cambios de modo
│   ├── 📁 store/                     # Estado global (Zustand)
│   │   └── ⊞ useGameStore.js         # Estado de navegación e interfaz
│   ├── 📁 utils/                     # Funciones de utilidad
│   │   └── ⌨ islandProximity.js      # Proximidad y frenado en islas
│   ├── ▤ App.css                     # Estilos globales de la App
│   ├── ◈ App.jsx                     # Composición de la app y escena
│   ├── ▤ index.css                   # Estilos base
│   └── ◈ main.jsx                    # Punto de entrada de React
├── ⚙ .gitignore                      # Archivos ignorados por Git
├── ⚙ .oxlintrc.json                  # Configuración del linter
├── 🌐 index.html                     # Documento HTML principal
├── ⚙ jsconfig.json                   # Configuración de JavaScript
├── 🔒 package-lock.json              # Bloqueo de dependencias
├── 📦 package.json                   # Manifiesto del proyecto
├── 📄 README.md                      # Documentación principal
└── ⚡ vite.config.js                 # Configuración de Vite
```

</details>

## 🚧 Estado del Proyecto

Este proyecto se encuentra en desarrollo activo.

<!--
Para agregar un sprint nuevo, añade filas con el entregable real, por ejemplo:
| 2 | Descripción del entregable | 🔄 |
-->

| Sprint | Entregable                        | Estado |
| :----: | --------------------------------- | :----: |
|   1    | Escena 3D y navegación básica     |   ✅   |
|   1    | Panel de proyectos interactivo    |   ✅   |
|   1    | Pantalla de carga con progreso    |   ✅   |
|   1    | Despliegue en producción (Vercel) |   ✅   |

> ✅ Completado · 🔄 En progreso · ⏳ Pendiente

## 📜 Créditos y Licencias

Los modelos 3D, tipografías e imágenes utilizadas tienen sus respectivas atribuciones. Consulta el archivo [CREDITOS.md](docs/CREDITOS.md) para más detalles.

El código de este proyecto se distribuye bajo la licencia [MIT](LICENSE).

## 👤 Autor

Desarrollado por **Andrés** · [GitHub](https://github.com/AndresMZMZ)
