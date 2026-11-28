import { BULLET } from "@/config/bullets";
import { CANNONS } from "@/config/cannons";
import { useBulletStore } from "@/store/useBulletStore";
import { MODES, useGameStore } from "@/store/useGameStore";
import {
  getBallisticPoint,
  getImpactTime,
} from "@/utils/ballistics";
import { getSalvoShots } from "@/utils/cannons";
import { sampleWave } from "@/utils/waves";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const MAX_SALVO_SHOTS = Math.max(
  CANNONS.left.salvoIndices.length,
  CANNONS.right.salvoIndices.length,
  CANNONS.stern.salvoIndices.length,
);
const MAX_IMPACT_MARKS = BULLET.maxActive + MAX_SALVO_SHOTS;

function createTrajectoryTube() {
  const pointCount = BULLET.reticlePoints + 1;
  const radialSegments = 8;
  const ringVertexCount = radialSegments + 1;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array(pointCount * ringVertexCount * 3),
      3,
    ),
  );
  geometry.setAttribute(
    "normal",
    new THREE.BufferAttribute(
      new Float32Array(pointCount * ringVertexCount * 3),
      3,
    ),
  );
  const indices = [];
  for (let point = 0; point < pointCount - 1; point++) {
    for (let segment = 0; segment < radialSegments; segment++) {
      const current = point * ringVertexCount + segment;
      const next = current + ringVertexCount;
      indices.push(
        current,
        next,
        current + 1,
        next,
        next + 1,
        current + 1,
      );
    }
  }
  geometry.setIndex(indices);

  const material = new THREE.MeshBasicMaterial({
    color: BULLET.reticleTubeColor,
    transparent: true,
    opacity: BULLET.reticleTubeOpacity,
    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 10;
  mesh.visible = false;

  return {
    mesh,
    centerline: new Float32Array(pointCount * 3),
    radialSegments,
  };
}

function updateTrajectoryTube(path, vectors) {
  const positions = path.mesh.geometry.attributes.position;
  const normals = path.mesh.geometry.attributes.normal;
  const pointCount = path.centerline.length / 3;
  const ringVertexCount = path.radialSegments + 1;
  const radius = BULLET.reticleTubeDiameter / 2;

  for (let point = 0; point < pointCount; point++) {
    const offset = point * 3;
    vectors.center.set(
      path.centerline[offset],
      path.centerline[offset + 1],
      path.centerline[offset + 2],
    );
    const previousOffset = Math.max(0, point - 1) * 3;
    const nextOffset = Math.min(pointCount - 1, point + 1) * 3;
    vectors.previous.set(
      path.centerline[previousOffset],
      path.centerline[previousOffset + 1],
      path.centerline[previousOffset + 2],
    );
    vectors.next.set(
      path.centerline[nextOffset],
      path.centerline[nextOffset + 1],
      path.centerline[nextOffset + 2],
    );
    vectors.tangent.subVectors(vectors.next, vectors.previous).normalize();
    vectors.axis.set(0, 1, 0);
    if (Math.abs(vectors.tangent.dot(vectors.axis)) > 0.95) {
      vectors.axis.set(1, 0, 0);
    }
    vectors.normal.crossVectors(vectors.tangent, vectors.axis).normalize();
    vectors.binormal.crossVectors(vectors.tangent, vectors.normal).normalize();

    for (let segment = 0; segment <= path.radialSegments; segment++) {
      const angle = (segment / path.radialSegments) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const normalX =
        vectors.normal.x * cos + vectors.binormal.x * sin;
      const normalY =
        vectors.normal.y * cos + vectors.binormal.y * sin;
      const normalZ =
        vectors.normal.z * cos + vectors.binormal.z * sin;
      const vertex = point * ringVertexCount + segment;
      positions.setXYZ(
        vertex,
        vectors.center.x + normalX * radius,
        vectors.center.y + normalY * radius,
        vectors.center.z + normalZ * radius,
      );
      normals.setXYZ(vertex, normalX, normalY, normalZ);
    }
  }

  positions.needsUpdate = true;
  normals.needsUpdate = true;
}

function createReticleObjects() {
  const paths = Array.from(
    { length: MAX_SALVO_SHOTS },
    createTrajectoryTube,
  );
  const flowSpheres = new THREE.InstancedMesh(
    new THREE.SphereGeometry(BULLET.reticleFlowSphereRadius, 10, 8),
    new THREE.MeshBasicMaterial({
      color: BULLET.reticleFlowSphereColor,
      depthTest: false,
      depthWrite: false,
    }),
    MAX_SALVO_SHOTS,
  );
  flowSpheres.count = 0;
  flowSpheres.frustumCulled = false;
  flowSpheres.renderOrder = 12;
  flowSpheres.visible = false;

  const impactGeometry = new THREE.BufferGeometry();
  impactGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(MAX_IMPACT_MARKS * 12), 3),
  );
  impactGeometry.setDrawRange(0, 0);
  const impactMarks = new THREE.LineSegments(
    impactGeometry,
    new THREE.LineBasicMaterial({
      color: BULLET.impactMarkColor,
      transparent: true,
      opacity: BULLET.impactMarkOpacity,
      depthTest: false,
      depthWrite: false,
    }),
  );
  impactMarks.frustumCulled = false;
  impactMarks.renderOrder = 13;
  impactMarks.visible = false;

  const ringGroup = new THREE.Group();
  ringGroup.rotation.x = -Math.PI / 2;
  ringGroup.renderOrder = 10;
  ringGroup.frustumCulled = false;

  const radius = BULLET.reticleOuterRadius;
  const fill = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 96),
    new THREE.MeshBasicMaterial({
      color: BULLET.reticleFillColor,
      transparent: true,
      opacity: BULLET.reticleFillOpacity,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
    }),
  );
  fill.renderOrder = 10;
  ringGroup.add(fill);

  const outerRing = new THREE.Mesh(
    new THREE.RingGeometry(radius - 2.0, radius, 96),
    new THREE.MeshBasicMaterial({
      color: BULLET.reticleOuterRingColor,
      transparent: true,
      opacity: BULLET.reticleOuterRingOpacity,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
    }),
  );
  outerRing.renderOrder = 11;
  ringGroup.add(outerRing);

  const pulseRings = Array.from(
    { length: BULLET.reticlePulseRingCount },
    (_, index) => {
      const pulse = new THREE.Mesh(
        new THREE.RingGeometry(radius - 1.3, radius, 96),
        new THREE.MeshBasicMaterial({
          color:
            index % 2 === 0
              ? BULLET.reticlePulseColor
              : BULLET.reticlePulseAlternateColor,
          transparent: true,
          opacity: BULLET.reticlePulseOpacity,
          side: THREE.DoubleSide,
          depthTest: false,
          depthWrite: false,
        }),
      );
      pulse.renderOrder = 11;
      ringGroup.add(pulse);
      return pulse;
    },
  );

  const core = new THREE.Group();
  const cometSegments = [
    { offset: 0, tube: 1.1, opacity: 1 },
    { offset: -0.75, tube: 0.85, opacity: 0.76 },
    { offset: -1.5, tube: 0.62, opacity: 0.5 },
    { offset: -2.25, tube: 0.42, opacity: 0.28 },
  ];
  for (const segment of cometSegments) {
    const cometArc = new THREE.Mesh(
      new THREE.TorusGeometry(
        BULLET.reticleCoreRadius,
        segment.tube,
        6,
        20,
        0.58,
      ),
      new THREE.MeshBasicMaterial({
        color: BULLET.reticleCoreColor,
        transparent: true,
        opacity: segment.opacity,
        depthTest: false,
        depthWrite: false,
      }),
    );
    cometArc.rotation.z = segment.offset;
    cometArc.renderOrder = 12;
    core.add(cometArc);
  }
  const centerLight = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 8, 8),
    new THREE.MeshBasicMaterial({
      color: BULLET.reticleCenterLightColor,
      depthTest: false,
    }),
  );
  centerLight.renderOrder = 13;
  core.add(centerLight);
  ringGroup.add(core);

  return { paths, flowSpheres, impactMarks, ringGroup, pulseRings, core };
}

export default function AimReticle() {
  const scene = useThree((state) => state.scene);
  const visual = useMemo(() => createReticleObjects(), []);
  const visualRef = useRef(visual);
  const scratch = useRef({
    point: { x: 0, y: 0, z: 0 },
    wave: { height: 0, slopeX: 0, slopeZ: 0 },
    velocity: [0, 0, 0],
    flowTransform: new THREE.Object3D(),
    tubeVectors: {
      center: new THREE.Vector3(),
      previous: new THREE.Vector3(),
      next: new THREE.Vector3(),
      tangent: new THREE.Vector3(),
      axis: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      binormal: new THREE.Vector3(),
    },
  });

  useEffect(
    () => () => {
      for (const path of visual.paths) {
        path.mesh.geometry.dispose();
        path.mesh.material.dispose();
      }
      visual.flowSpheres.geometry.dispose();
      visual.flowSpheres.material.dispose();
      visual.impactMarks.geometry.dispose();
      visual.impactMarks.material.dispose();
      visual.ringGroup.traverse((object) => {
        if (!object.geometry) return;
        object.geometry.dispose();
        object.material?.dispose();
      });
    },
    [visual],
  );

  useFrame(({ clock }) => {
    const objects = visualRef.current;
    const { mode, combatSide } = useGameStore.getState();
    const ship =
      mode === MODES.COMBAT && combatSide
        ? scene.getObjectByName("ship")
        : null;
    const activeSalvos = useBulletStore.getState().activeSalvos;
    const inFlight = activeSalvos.length > 0;
    const shots = inFlight
      ? activeSalvos.flatMap((salvo) => salvo.shots)
      : ship
        ? getSalvoShots(
            ship,
            combatSide,
            useBulletStore.getState().aim.elevation,
            useBulletStore.getState().aim.yaw,
          ).map((shot) => ({ ...shot, launchTime: clock.elapsedTime }))
        : [];
    const showPreview = !!ship && !inFlight;

    objects.ringGroup.visible = !!ship;
    objects.flowSpheres.visible = showPreview;
    objects.impactMarks.visible = !!ship && shots.length > 0;
    for (const path of objects.paths) path.mesh.visible = false;
    if (!ship) {
      objects.flowSpheres.count = 0;
      return;
    }

    const impactPositions = objects.impactMarks.geometry.attributes.position;
    const markHalfSize = BULLET.impactMarkSize / 2;
    const now = clock.elapsedTime;
    let impactCount = 0;
    let centerX = 0;
    let centerZ = 0;
    let centerFlightTime = 0;
    let flowCount = 0;

    for (let index = 0; index < shots.length; index++) {
      const shot = shots[index];
      const velocity = scratch.current.velocity;
      velocity[0] = shot.direction[0] * BULLET.speed;
      velocity[1] = shot.direction[1] * BULLET.speed;
      velocity[2] = shot.direction[2] * BULLET.speed;
      const startTime = shot.launchTime ?? now;
      const flightTime = getImpactTime(shot.position, velocity, startTime);
      if (!Number.isFinite(flightTime) || flightTime <= 0) continue;

      const landing = getBallisticPoint(
        shot.position,
        velocity,
        flightTime,
        scratch.current.point,
      );
      const wave = sampleWave(
        landing.x,
        landing.z,
        startTime + flightTime,
        scratch.current.wave,
      );
      const impactY = BULLET.seaLevel + wave.height;
      const markOffset = impactCount * 4;
      impactPositions.setXYZ(
        markOffset,
        landing.x - markHalfSize,
        impactY + 0.45,
        landing.z - markHalfSize,
      );
      impactPositions.setXYZ(
        markOffset + 1,
        landing.x + markHalfSize,
        impactY + 0.45,
        landing.z + markHalfSize,
      );
      impactPositions.setXYZ(
        markOffset + 2,
        landing.x - markHalfSize,
        impactY + 0.45,
        landing.z + markHalfSize,
      );
      impactPositions.setXYZ(
        markOffset + 3,
        landing.x + markHalfSize,
        impactY + 0.45,
        landing.z - markHalfSize,
      );
      impactCount++;
      centerX += landing.x;
      centerZ += landing.z;
      centerFlightTime += flightTime;

      if (!showPreview || index >= objects.paths.length) continue;
      const path = objects.paths[index];
      const centerline = path.centerline;
      const lastPoint = BULLET.reticlePoints;
      centerline[0] = shot.muzzlePosition[0];
      centerline[1] = shot.muzzlePosition[1];
      centerline[2] = shot.muzzlePosition[2];
      centerline[3] = shot.position[0];
      centerline[4] = shot.position[1];
      centerline[5] = shot.position[2];
      for (let pointIndex = 2; pointIndex <= lastPoint; pointIndex++) {
        const progress = (pointIndex - 1) / (lastPoint - 1);
        const time = progress * flightTime;
        const point = getBallisticPoint(
          shot.position,
          velocity,
          time,
          scratch.current.point,
        );
        if (pointIndex === lastPoint) point.y = impactY;
        const offset = pointIndex * 3;
        centerline[offset] = point.x;
        centerline[offset + 1] = point.y;
        centerline[offset + 2] = point.z;
      }
      path.mesh.visible = true;
      updateTrajectoryTube(path, scratch.current.tubeVectors);

      const flowProgress =
        (now * BULLET.reticleFlowSpeed + index / shots.length) % 1;
      const flowPoint = getBallisticPoint(
        shot.position,
        velocity,
        flightTime * flowProgress,
        scratch.current.point,
      );
      const flowTransform = scratch.current.flowTransform;
      flowTransform.position.set(
        flowPoint.x,
        flowPoint.y + 0.35,
        flowPoint.z,
      );
      flowTransform.updateMatrix();
      objects.flowSpheres.setMatrixAt(flowCount, flowTransform.matrix);
      flowCount++;
    }

    objects.flowSpheres.count = flowCount;
    objects.flowSpheres.instanceMatrix.needsUpdate = true;
    impactPositions.needsUpdate = true;
    objects.impactMarks.geometry.setDrawRange(0, impactCount * 4);
    if (impactCount === 0) {
      objects.ringGroup.visible = false;
      return;
    }

    centerX /= impactCount;
    centerZ /= impactCount;
    centerFlightTime /= impactCount;
    const centerWave = sampleWave(
      centerX,
      centerZ,
      now + centerFlightTime,
      scratch.current.wave,
    );
    objects.ringGroup.position.set(
      centerX,
      BULLET.seaLevel + centerWave.height + 0.55,
      centerZ,
    );

    for (let index = 0; index < objects.pulseRings.length; index++) {
      const pulse = objects.pulseRings[index];
      const progress =
        (now * BULLET.reticlePulseSpeed + index / objects.pulseRings.length) %
        1;
      const scale = Math.max(0.015, 1 - progress);
      pulse.scale.setScalar(scale);
      pulse.material.opacity = BULLET.reticlePulseOpacity * (1 - progress);
    }
    objects.core.rotation.z = now * BULLET.reticleCoreRotationSpeed;
  });

  return (
    <>
      {visual.paths.map((path, index) => (
        <primitive key={`trajectory-${index}`} object={path.mesh} />
      ))}
      <primitive object={visual.flowSpheres} />
      <primitive object={visual.impactMarks} />
      <primitive object={visual.ringGroup} />
    </>
  );
}
