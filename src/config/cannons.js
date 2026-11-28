import { BULLET } from "@/config/bullets";

const BROADSIDE_Z_OFFSETS = [-49, -35, -21, -7, 7, 21, 35, 49];
const BROADSIDE_DECK_OFFSETS = [0, 4];
const BROADSIDE_SALVO_INDICES = [0, 2, 4, 6, 9, 11, 13, 15];

function createBroadsideMuzzles(sign) {
  return BROADSIDE_DECK_OFFSETS.flatMap((deckOffset) =>
    BROADSIDE_Z_OFFSETS.map((zOffset) => [
      sign * BULLET.muzzleOffset,
      BULLET.muzzleHeight + deckOffset,
      BULLET.muzzleZ + zOffset,
    ]),
  );
}

function createSternMuzzles() {
  return [-8, 8].flatMap((mountX) =>
    [-2, 0, 2].map((barrelX, index) => [
      mountX + barrelX,
      BULLET.muzzleHeight + (index === 1 ? 2 : -2),
      78,
    ]),
  );
}

export const CANNONS = {
  left: {
    aimMuzzle: [
      -BULLET.muzzleOffset,
      BULLET.muzzleHeight,
      BULLET.muzzleZ,
    ],
    muzzles: createBroadsideMuzzles(-1),
    salvoIndices: BROADSIDE_SALVO_INDICES,
  },
  right: {
    aimMuzzle: [
      BULLET.muzzleOffset,
      BULLET.muzzleHeight,
      BULLET.muzzleZ,
    ],
    muzzles: createBroadsideMuzzles(1),
    salvoIndices: BROADSIDE_SALVO_INDICES,
  },
  stern: {
    aimMuzzle: [-8, BULLET.muzzleHeight, 78],
    muzzles: createSternMuzzles(),
    salvoIndices: [0, 1, 2, 3, 4, 5],
  },
  spreadRadians: BULLET.salvoSpread,
};
