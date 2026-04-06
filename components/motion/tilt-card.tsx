'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TiltCardProps = {
  children: ReactNode
  className?: string
  /** Max tilt in degrees (lower = subtler). */
  tiltAmount?: number
  /** Disable pointer tilt (e.g. nested WebGL showcase). */
  disableTilt?: boolean
}

export function TiltCard({
  children,
  className,
  tiltAmount = 9,
  disableTilt = false,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [finePointer, setFinePointer] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setFinePointer(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 420, damping: 36, mass: 0.55 }
  const springX = useSpring(x, spring)
  const springY = useSpring(y, spring)
  const rotateX = useTransform(springY, [-0.5, 0.5], [tiltAmount, -tiltAmount])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-tiltAmount, tiltAmount])

  const disabled = disableTilt || reduceMotion || !finePointer

  function handleMove(e: PointerEvent) {
    if (disabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={ref}
      className={cn('perspective-distant', className)}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {disabled ? (
        <div className="h-full">{children}</div>
      ) : (
        <motion.div
          className="h-full will-change-transform"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}
