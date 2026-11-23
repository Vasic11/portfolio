export const easeOut = [0.22, 1, 0.36, 1] as const;

export function rise(distance: number, delay = 0, duration = 0.6) {
  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: easeOut },
  };
}
