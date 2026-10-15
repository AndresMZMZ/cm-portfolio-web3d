// INICIO archivo reemplazado
import { useGameStore } from "@/store/useGameStore";
import { Float, Text } from "@react-three/drei";

// Fuente propia en public/fonts: sin ella, Text descarga una fuente de un CDN externo la primera vez
const TITLE_FONT = "/fonts/PirataOne-Regular.ttf";

// Recibe la isla por props: sirve para todas las islas, no solo la primera (HU28 la reutiliza)
export default function IslandTitle({ island }) {
  // Booleano: el componente solo se redibuja cuando cambia entre cerca y lejos
  const visible = useGameStore((s) => s.nearIsland === island.id);
  if (!island.title) return null;

  return (
    // El docente (clase 6) usa Text de drei; lo dejamos siempre montado y solo alternamos "visible",
    // porque montar y desmontar el texto en cada acercamiento recrea la malla y puede congelar un instante
    <group position={island.position} visible={visible}>
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.3}>
        <Text
          font={TITLE_FONT}
          position={island.titleOffset}
          fontSize={3}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.12}
          outlineColor="#0f172a"
        >
          {island.title}
        </Text>
      </Float>
    </group>
  );
}
// FIN archivo reemplazado
