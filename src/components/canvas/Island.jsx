import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export function Model({ rotationY = 0, ...props }) {
  const { nodes, materials } = useGLTF("/models/lighthouse.glb");
  const instancedMeshes = useMemo(() => {
    const cloneInstancedMesh = (mesh) => {
      const clone = mesh.clone();
      clone.castShadow = true;
      clone.receiveShadow = true;
      clone.frustumCulled = false;
      return clone;
    };

    const treeLeaves = cloneInstancedMesh(
      nodes.OptimizedTree_Optimized_Leaf_Material_0,
    );
    const leafMaterial = materials.Optimized_Leaf_Material.clone();
    leafMaterial.side = THREE.DoubleSide;
    leafMaterial.alphaTest = 0.5;
    leafMaterial.transparent = false;
    leafMaterial.depthWrite = true;
    treeLeaves.material = leafMaterial;

    return {
      lamp: cloneInstancedMesh(nodes.Cube_lamp_0),
      treeBark: cloneInstancedMesh(
        nodes.OptimizedTree_Optimized_Bark_Material_0,
      ),
      treeLeaves,
    };
  }, [nodes, materials]);

  return (
    <group {...props} rotation={[0, rotationY, 0]} dispose={null}>
      {/* Aquí se manipula la escala y posición de la isla */}
      <group>
        <primitive object={instancedMeshes.lamp} />
        <primitive object={instancedMeshes.treeBark} />
        <primitive object={instancedMeshes.treeLeaves} />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.flag_props_0.geometry}
          material={materials.props}
          position={[-7.518, 64.526, 103.698]}
          rotation={[-3.127, 0.47, 2.081]}
          scale={[3.411, 3.206, 5.514]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.flagpole_lambert1_0.geometry}
          material={materials.lambert1}
          position={[-5.611, 48.736, 101.025]}
          rotation={[-Math.PI, 0.62, -Math.PI]}
          scale={[0.373, 17.928, 0.373]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.House_house_0.geometry}
          material={materials.house}
          position={[34, 27.446, 19.04]}
          rotation={[0, -0.21, 0]}
          scale={0.526}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Island_Island_0.geometry}
          material={materials.Island}
          position={[100.5, -112.954, -107.46]}
          scale={[5.264, 5.658, 5.658]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder__1__lamp_0.geometry}
          material={materials.lamp}
          position={[21.606, 131.628, 66.769]}
          scale={[0.108, 0.049, 0.108]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.group2_pCylinder13_lighthouse_0.geometry}
          material={materials.lighthouse}
          position={[21.359, 127.425, 67.061]}
          rotation={[Math.PI, -1.191, Math.PI]}
          scale={[4.031, 1.862, 4.031]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.dock_walkway_0.geometry}
          material={materials.walkway}
          position={[154.693, -162.415, -88.95]}
          rotation={[0, -0.031, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.down_facing_base_waterbase_0.geometry}
          material={materials.waterbase}
          position={[-99, -212.926, 48.04]}
          rotation={[0, 0, -Math.PI]}
          scale={[14, 15, 14]}
          visible={false} // Oculta la base de agua para que no interfiera con la vista del barco y la isla.
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.water_1_ocean_0.geometry}
          material={materials.ocean}
          position={[104.106, -142.954, 44.513]}
          scale={[15, 0.1, 15]} // Amplía la base de agua para cubrir toda el área de la isla y el barco.
          visible={false}
        />
      </group>
    </group>
  );
}

export default Model;
useGLTF.preload("/models/lighthouse.glb");
