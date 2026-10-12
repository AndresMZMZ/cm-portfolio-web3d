/*
Generado automáticamente por: https://github.com/pmndrs/gltfjsx
Autor: LakoGibibi (https://sketchfab.com/LakoGibibi)
Licencia: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Fuente: https://sketchfab.com/3d-models/the-black-pearl-997a4cce88564232bd1ff01e2287f2b4
Título: El Perla Negra
*/

import { useGLTF } from '@react-three/drei'

// Este componente solo dibuja el modelo; el movimiento vive en Ship.jsx
export function BarcoPrueba(props) {
  const { nodes, materials } = useGLTF('/models/barco-prueba.glb') //ruta donde esta el modelo 
  
  return (
    
    <group {...props} dispose={null}>

      <group rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <group rotation={[-Math.PI, 0, 0]} scale={0.01}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2246_mat_5_0.geometry}
            material={materials.mat_5}
            position={[-0.279, -422.758, 193.75]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          {/*Las otras mallas que aún quedan */}
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2247_mat_6_0.geometry}
            material={materials.mat_6}
            position={[-0.018, 14.06, 254.74]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2248_mat_7_0.geometry}
            material={materials.mat_7}
            position={[-3.34, -124.543, 247.782]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2249_mat_8_0.geometry}
            material={materials.mat_8}
            position={[0.228, -72.681, 275.837]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2250_mat_9_0.geometry}
            material={materials.mat_9}
            position={[-18.804, 192.733, 291.575]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2251_mat_9_0.geometry}
            material={materials.mat_9}
            position={[-0.164, 162.753, 207.155]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2252_mat_9_0.geometry}
            material={materials.mat_9}
            position={[-0.153, 178.804, 233.251]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2253_mat_10_0.geometry}
            material={materials.mat_10}
            position={[-0.118, -256.822, 320.059]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2254_mat_11_0.geometry}
            material={materials.mat_11}
            position={[-0.204, -472.231, 348.449]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2255_mat_12_0.geometry}
            material={materials.mat_12}
            position={[-0.729, -507.629, 430.637]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2256_mat_13_0.geometry}
            material={materials.mat_13}
            position={[-0.182, 46.331, 211.37]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2257_mat_14_0.geometry}
            material={materials.mat_14}
            position={[-0.229, -438.294, 191.979]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2260_mat_8_0.geometry}
            material={materials.mat_8}
            position={[-0.619, -422.739, 111.997]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2261_mat_5_0.geometry}
            material={materials.mat_5}
            position={[-0.349, -408.379, 64.91]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2262_mat_17_0.geometry}
            material={materials.mat_17}
            position={[-14.245, 153.536, 245.63]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2297_mat_20_0.geometry}
            material={materials.mat_20}
            position={[42.173, 584.755, 281.051]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2297001_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-39.376, 584.578, 280.934]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2297002_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-41.887, -375.757, 172.878]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2297003_mat_20_0.geometry}
            material={materials.mat_20}
            position={[38.813, -375.581, 172.994]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-104.321, 427.659, 164.725]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298001_mat_20_0.geometry}
            material={materials.mat_20}
            position={[104.036, 428.103, 165.024]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298002_mat_20_0.geometry}
            material={materials.mat_20}
            position={[103.929, 375.073, 221.911]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298003_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-104.174, 374.628, 221.612]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298004_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-110.432, 323.374, 157.242]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298005_mat_20_0.geometry}
            material={materials.mat_20}
            position={[110.102, 323.847, 157.559]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298006_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-109.772, 267.324, 215.375]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298007_mat_20_0.geometry}
            material={materials.mat_20}
            position={[109.485, 267.793, 215.69]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298008_mat_20_0.geometry}
            material={materials.mat_20}
            position={[117.054, 214.444, 152.769]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298009_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-117.426, 213.943, 152.432]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298010_mat_20_0.geometry}
            material={materials.mat_20}
            position={[112.223, 162.075, 211.897]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298011_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-112.549, 161.594, 211.575]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298012_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-116.951, 106.937, 150.17]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298013_mat_20_0.geometry}
            material={materials.mat_20}
            position={[116.543, 107.434, 150.505]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298014_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-112.566, 56.423, 211.953]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298015_mat_20_0.geometry}
            material={materials.mat_20}
            position={[112.209, 56.903, 212.275]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298016_mat_20_0.geometry}
            material={materials.mat_20}
            position={[112.681, 2.849, 151.269]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298017_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-113.124, 2.367, 150.944]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298018_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-109.279, -50.037, 216.208]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298019_mat_20_0.geometry}
            material={materials.mat_20}
            position={[108.886, -49.57, 216.521]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298020_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-108.793, -101.82, 157.199]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298021_mat_20_0.geometry}
            material={materials.mat_20}
            position={[108.324, -101.354, 157.512]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298022_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-91.535, -153.976, 228.005]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298023_mat_20_0.geometry}
            material={materials.mat_20}
            position={[91.125, -153.588, 228.267]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298024_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-95.059, -205.284, 166.319]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298025_mat_20_0.geometry}
            material={materials.mat_20}
            position={[94.566, -204.88, 166.591]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298026_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-85.235, -257.118, 240.109]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298027_mat_20_0.geometry}
            material={materials.mat_20}
            position={[84.804, -256.754, 240.353]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298028_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-82.559, -310.9, 182.307]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2298029_mat_20_0.geometry}
            material={materials.mat_20}
            position={[82.045, -310.555, 182.543]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2299_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-66.421, -447.262, 388.267]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2299001_mat_20_0.geometry}
            material={materials.mat_20}
            position={[65.049, -446.99, 388.455]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2299002_mat_20_0.geometry}
            material={materials.mat_20}
            position={[141.133, 105.193, 250.335]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2299003_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-142.478, 104.581, 249.928]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2299004_mat_20_0.geometry}
            material={materials.mat_20}
            position={[117.036, 501.467, 280.081]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2299005_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-118.226, 500.955, 279.744]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2300_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-69.807, -447.154, 391.3]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2300001_mat_20_0.geometry}
            material={materials.mat_20}
            position={[61.663, -446.866, 391.488]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2300002_mat_20_0.geometry}
            material={materials.mat_20}
            position={[137.749, 105.316, 253.368]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2300003_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-145.862, 104.688, 252.96]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2300004_mat_20_0.geometry}
            material={materials.mat_20}
            position={[113.658, 501.594, 283.114]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2300005_mat_20_0.geometry}
            material={materials.mat_20}
            position={[-121.603, 501.08, 282.776]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301_mat_21_0.geometry}
            material={materials.mat_21}
            position={[121.384, -257.492, 268.358]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301001_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-121.797, -257.914, 268.009]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301002_mat_21_0.geometry}
            material={materials.mat_21}
            position={[121.292, -311.138, 203.364]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301003_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-121.801, -311.569, 203.016]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301004_mat_21_0.geometry}
            material={materials.mat_21}
            position={[134.614, -206.718, 190.097]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301005_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-135.102, -207.199, 189.71]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301006_mat_21_0.geometry}
            material={materials.mat_21}
            position={[134.089, -153.905, 258.016]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301007_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-134.483, -154.385, 257.631]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301008_mat_21_0.geometry}
            material={materials.mat_21}
            position={[145.385, -101.483, 181.755]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301009_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-145.841, -102.016, 181.337]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301010_mat_21_0.geometry}
            material={materials.mat_21}
            position={[152.77, 2.526, 173.643]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301011_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-153.188, 1.963, 173.204]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301012_mat_21_0.geometry}
            material={materials.mat_21}
            position={[155.666, 107.011, 172.562]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301013_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-156.057, 106.441, 172.115]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301014_mat_21_0.geometry}
            material={materials.mat_21}
            position={[154.057, 214.637, 175.261]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301015_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-154.403, 214.074, 174.819]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301016_mat_21_0.geometry}
            material={materials.mat_21}
            position={[149.038, 323.868, 180.885]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301017_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-149.338, 323.318, 180.457]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301018_mat_21_0.geometry}
            material={materials.mat_21}
            position={[141.49, 429.231, 188.801]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2301019_mat_21_0.geometry}
            material={materials.mat_21}
            position={[-141.726, 428.714, 188.395]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2302_mat_22_0.geometry}
            material={materials.mat_22}
            position={[0.458, 441.625, 486.101]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2303_mat_23_0.geometry}
            material={materials.mat_23}
            position={[0.734, 510.552, 922.521]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2304_mat_22_0.geometry}
            material={materials.mat_22}
            position={[1.017, 510.454, 928.877]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2305_mat_23_0.geometry}
            material={materials.mat_23}
            position={[-14.473, -286.812, 550.535]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2306_mat_22_0.geometry}
            material={materials.mat_22}
            position={[-8.865, -299.325, 601.203]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2307_mat_23_0.geometry}
            material={materials.mat_23}
            position={[1.918, -257.635, 723.099]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2308_mat_22_0.geometry}
            material={materials.mat_22}
            position={[1.742, -258.444, 812.441]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2309_mat_22_0.geometry}
            material={materials.mat_22}
            position={[0.757, 54.275, 949.05]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2310_mat_23_0.geometry}
            material={materials.mat_23}
            position={[0.494, 54.644, 950.811]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2311_mat_24_0.geometry}
            material={materials.mat_24}
            position={[-0.012, -288.773, 624.383]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2312_mat_24_0.geometry}
            material={materials.mat_24}
            position={[-0.004, -12.005, 556.138]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2313_mat_24_0.geometry}
            material={materials.mat_24}
            position={[0.077, 454.622, 569.034]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2314_mat_22_0.geometry}
            material={materials.mat_22}
            position={[-2.09, -301.759, 531.163]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2315_mat_22_0.geometry}
            material={materials.mat_22}
            position={[2.44, -36.421, 504.239]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2316_mat_22_0.geometry}
            material={materials.mat_22}
            position={[0.434, 407.15, 469.507]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2317_mat_23_0.geometry}
            material={materials.mat_23}
            position={[-0.051, -275.477, 703.816]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2318_mat_23_0.geometry}
            material={materials.mat_23}
            position={[0.765, 30.111, 779.445]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2319_mat_23_0.geometry}
            material={materials.mat_23}
            position={[0.333, 490.822, 732.474]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2320_mat_25_0.geometry}
            material={materials.mat_25}
            position={[11.942, 778.267, 547.396]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2321_mat_25_0.geometry}
            material={materials.mat_25}
            position={[12.148, 648.143, 409.957]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2322_mat_25_0.geometry}
            material={materials.mat_25}
            position={[12.879, -341.339, 501.954]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2323_mat_26_0.geometry}
            material={materials.mat_26}
            position={[3.737, 545.385, 1095.328]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2324_mat_26_0.geometry}
            material={materials.mat_26}
            position={[5.497, 570.057, 772.264]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2325_mat_26_0.geometry}
            material={materials.mat_26}
            position={[5.322, 108.212, 1125.431]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2326_mat_26_0.geometry}
            material={materials.mat_26}
            position={[4.497, 561.157, 447.683]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2327_mat_26_0.geometry}
            material={materials.mat_26}
            position={[4.995, -219.937, 727.841]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2328_mat_26_0.geometry}
            material={materials.mat_26}
            position={[5.95, 125.505, 803.336]}
            rotation={[-0.868, -1.505, -2.462]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_2329_mat_26_0.geometry}
            material={materials.mat_26}
            position={[4.313, 116.546, 437.593]}
            rotation={[-0.868, -1.505, -2.462]}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/barco-prueba.glb')