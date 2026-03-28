export const MOTION_EASE = [0.22, 1, 0.36, 1];

export const pageTransition = {
  initial: { opacity: 0, y: 18, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: MOTION_EASE },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: 'blur(8px)',
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
};

export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.45, delay, ease: MOTION_EASE },
  },
});

export const fadeUp = (delay = 0, distance = 28) => ({
  initial: { opacity: 0, y: distance },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: MOTION_EASE },
  },
});

export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, delay, ease: MOTION_EASE },
  },
});

export const presenceFade = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: MOTION_EASE },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

export const cardHover = {
  y: -8,
  scale: 1.01,
  transition: { duration: 0.22, ease: MOTION_EASE },
};

export const buttonHover = {
  y: -3,
  scale: 1.01,
  transition: { duration: 0.18, ease: MOTION_EASE },
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.14, ease: MOTION_EASE },
};
