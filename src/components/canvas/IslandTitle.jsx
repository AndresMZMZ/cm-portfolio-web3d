import { useGameStore } from "@/store/useGameStore";
import { Text } from "@react-three/drei";

// Dibuja el nombre de la isla en el mundo 3D cuando el barco está cerca.
// Ajusta titleOffset en la configuración de islas para moverlo; fontSize controla su tamaño.

// Fuente propia en public/fonts: sin ella, Text descarga una fuente de un CDN externo la primera vez
const TITLE_FONT = "/fonts/PirataOne-Regular.ttf";

// Recibe la isla por props (propiedades): sirve para todas las islas, no solo la primera (HU28 la reutiliza)
export default function IslandTitle({ island }) {
  // Booleano: el componente solo se redibuja cuando cambia entre cerca y lejos
  const visible = useGameStore((s) => s.nearIsland === island.id);
  if (!island.title) return null;

  return (
    // El docente (clase 6) usa Text de drei; lo dejamos siempre montado y solo alternamos "visible",
    // porque montar y desmontar el texto en cada acercamiento recrea la malla y puede congelarse
    <group position={island.position} visible={visible}>
        <Text
          font={TITLE_FONT}//tipografía
          position={island.titleOffset}
          fontSize={18}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.27}//grosor del contorno del tex
          outlineColor="#0f172a"//color del borde del tex
        >
          {island.title}
        </Text>
    </group>
  );
}