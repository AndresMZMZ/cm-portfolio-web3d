import { BULLET } from "@/config/bullets";
import { useBulletStore } from "@/store/useBulletStore";
import { useFrame } from "@react-three/fiber";

export default function SalvoController() {
  useFrame((state) => {
    const { takeDueShots, fireBullet } = useBulletStore.getState();
    const dueShots = takeDueShots(performance.now() / 1000);
    for (const shot of dueShots) {
      fireBullet(
        shot.position,
        shot.direction,
        BULLET.speed,
        shot.salvoId,
        shot.shotId,
        state.clock.elapsedTime,
      );
    }
  });

  return null;
}
