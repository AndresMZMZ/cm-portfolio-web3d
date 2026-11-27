import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

// HT07: imprime estadísticas del renderizado y memoria cada 2 segundos durante el desarrollo.
export default function DevRenderInfo() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const id = setInterval(() => {
      const { render, memory, programs } = gl.info;
      console.info(
        `[HT07] frame: ${render.frame} | draw calls: ${render.calls} | triángulos: ${render.triangles} | líneas: ${render.lines} | puntos: ${render.points} | geometrías: ${memory.geometries} | texturas: ${memory.textures} | programas: ${programs?.length ?? 0}`,
      );
    }, 2000);
    return () => clearInterval(id);
  }, [gl]);

  return null;
}