export const MOTION_DURATION = {
  fast: 150,
  base: 200,
  slow: 250,
  modal: 180
} as const;

export const MOTION_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
export const MOTION_EASE_GSAP = 'power1.inOut';

export const MOTION_DISTANCE = {
  page: 10,
  reveal: 12,
  drawer: 10
} as const;

export function motion(duration: number = MOTION_DURATION.base): string {
  return `${duration}ms ${MOTION_EASE}`;
}
