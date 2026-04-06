/** Shared Framer Motion variants for scroll + 3D entrance. */

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
} as const

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 32,
    rotateX: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 95,
      damping: 20,
    },
  },
} as const

export const sectionHeader = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 22 },
  },
} as const
