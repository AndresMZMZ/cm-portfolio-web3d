// Ciclo de día y noche (HU20). Todo lo que se puede ajustar del ciclo está en este archivo.
// Nombres en inglés: startTime (hora inicial), fixedTimes (horas fijas), fixedSpeed (rapidez al fijar),
// keyframes (fotogramas clave), sunElevation (elevación del sol en grados), turbidity (turbidez), rayleigh (dispersión del cielo),
// sunIntensity/moonIntensity (intensidad del sol/la luna), hemiSky/hemiGround (color del cielo/suelo de la luz hemisférica), night (0 = día, 1 = noche).
export const DAY_CYCLE = {
  duration: 90, // Segundos que dura un ciclo completo (mañana, tarde, noche)
  startTime: 0, // Hora al iniciar, de 0 a 1 (0 = mañana)

  // Hora que se fija cuando el visitante elige Día o Noche en configuración (paso 4).
  fixedTimes: { day: 0.25, night: 0.76 },
  fixedSpeed: 8, // Qué tan rápido avanza el reloj hasta esa hora (8 = ocho veces la rapidez normal)

  moonColor: "#9db8ff", // Color de la luz lunar

  // Hora del ciclo de 0 a 1. El primero debe ser t: 0 y los siguientes van en orden creciente.
  // Para alargar la noche, separa más los fotogramas de t: 0.64 y t: 0.88; para acortarla, júntalos.
  // Con sunIntensity en 0 el sol deja de iluminar (debe ser 0 cuando sunElevation <= 0).
  keyframes: [
    {
      t: 0, // Mañana (se parece al ambiente actual del proyecto)
      sunElevation: 14, turbidity: 8, rayleigh: 1,
      sunColor: "#ffb877", sunIntensity: 2.2, moonIntensity: 0,
      hemiSky: "#ffe2c2", hemiGround: "#2a5578", hemiIntensity: 1.3,
      night: 0,
    },
    {
      t: 0.25, // Mediodía
      sunElevation: 60, turbidity: 6, rayleigh: 2,
      sunColor: "#fff4e0", sunIntensity: 2.6, moonIntensity: 0,
      hemiSky: "#cfe6ff", hemiGround: "#2a5578", hemiIntensity: 1.4,
      night: 0,
    },
    {
      t: 0.5, // Atardecer
      sunElevation: 8, turbidity: 10, rayleigh: 0.6,
      sunColor: "#ff9a55", sunIntensity: 1.8, moonIntensity: 0,
      hemiSky: "#ffc89a", hemiGround: "#2a4a6e", hemiIntensity: 1.1,
      night: 0.1,
    },
    {
      t: 0.56, // El sol toca el horizonte
      sunElevation: 0, turbidity: 10, rayleigh: 0.5,
      sunColor: "#ff7a3d", sunIntensity: 0, moonIntensity: 0.3,
      hemiSky: "#8a6a8f", hemiGround: "#1c3552", hemiIntensity: 0.8,
      night: 0.5,
    },
    {
      t: 0.64, // Empieza la noche
      sunElevation: -25, turbidity: 4, rayleigh: 0.3,
      sunColor: "#ff7a3d", sunIntensity: 0, moonIntensity: 0.9,
      hemiSky: "#27407a", hemiGround: "#0b1b30", hemiIntensity: 0.55,
      night: 1,
    },
    {
      t: 0.88, // Termina la noche profunda
      sunElevation: -25, turbidity: 4, rayleigh: 0.3,
      sunColor: "#ff7a3d", sunIntensity: 0, moonIntensity: 0.9,
      hemiSky: "#27407a", hemiGround: "#0b1b30", hemiIntensity: 0.55,
      night: 1,
    },
    {
      t: 0.95, // Alba
      sunElevation: -2, turbidity: 8, rayleigh: 0.8,
      sunColor: "#ff9a55", sunIntensity: 0, moonIntensity: 0.3,
      hemiSky: "#8a7a9a", hemiGround: "#1c3552", hemiIntensity: 0.8,
      night: 0.4,
    },
  ],
};