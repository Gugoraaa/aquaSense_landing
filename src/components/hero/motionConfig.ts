export const heroSettleSeconds = 1.64;
export const heroSettleMilliseconds = heroSettleSeconds * 1000;
export const heroEase = [0.16, 1, 0.3, 1] as const;

export function heroSyncTransition(delay = 0) {
  return {
    delay,
    duration: Math.max(0.36, heroSettleSeconds - delay),
    ease: heroEase,
  };
}
