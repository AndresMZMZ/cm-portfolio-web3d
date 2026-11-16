import { prepareIslandModel, suggestIslandSetup } from "@/utils/islandModel";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";

// Isla de redes y HV (HU28): carga public/models/isla-redes.glb y lo coloca según config/islands.js.
// Aquí se manipula la escala con modelScale en config/islands.js.
const MODEL_URL = "/models/isla-redes.glb";
const HIDDEN_NODES = ["Sea_Sea_0"];
const BEACH_NODE = "Agua_Exterior";
const isIslandMesh = (object) =>
  object.name === "Agua_Exterior" || object.name.startsWith("Fortress_");

const formatVector = (vector) => vector.toArray().map((value) => Number(value.toFixed(2)));

export default function IslandRedes({ island }) {
  const { scene } = useGLTF(MODEL_URL);

  // Se clona para no modificar la escena en caché de useGLTF (geometrías y materiales se comparten).
  const { model, measures } = useMemo(() => {
    const clone = scene.clone(true);
    const measured = prepareIslandModel(clone, {
      hidden: HIDDEN_NODES,
      beach: BEACH_NODE,
      includeMesh: isIslandMesh,
    });
    if (measured) {
      // Centra la isla completa y pone la superficie de arena en y = 0.
      clone.position.set(-measured.center.x, -measured.top, -measured.center.z);
    }
    return { model: clone, measures: measured };
  }, [scene]);

  // Solo en desarrollo: imprime en la consola los valores sugeridos para pegar en config/islands.js. Y  de este modo no tener que medir manualmente la isla en Blender.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!measures) {
      console.warn(`[isla-redes] No se encontraron mallas visibles para medir "${BEACH_NODE}".`);
      return;
    }
    const setup = suggestIslandSetup(measures, {
      beachY: island.beachY,
      targetRadius: 333,
    });
    console.info(
      `[isla-redes] Dimensiones reales (unidades GLB, sin escala): isla visible ${JSON.stringify(formatVector(measures.size))}; ` +
        `arena Sand ${JSON.stringify(formatVector(measures.beachSize))}; ` +
        `caja visible min ${JSON.stringify(formatVector(measures.bounds.min))}, max ${JSON.stringify(formatVector(measures.bounds.max))}.\n` +
        `[isla-redes] Sugerencia para config/islands.js (radio arena ${setup.radius}; modelScale actual ${island.modelScale}):\n` +
        `modelScale: ${setup.modelScale},\n` +
        `colliders: ${JSON.stringify(setup.colliders, null, 2)},\n` +
        `signs: ${JSON.stringify(setup.signs, null, 2)},\n` +
        `titleOffset: ${JSON.stringify(setup.titleOffset)}`,
    );
  }, [measures, island.modelScale, island.beachY]);

  return (
    <group
      position={[island.position[0], island.beachY, island.position[2]]}
      rotation={[0, island?.rotationY ?? 0, 0]}
      scale={island.modelScale}
      dispose={null}
    >
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
