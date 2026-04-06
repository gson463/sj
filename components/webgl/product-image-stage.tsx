'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Image as TextureImage } from '@react-three/drei'
import { Suspense, useRef, type MutableRefObject, type PointerEvent } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

function TiltImage({
  src,
  pointerRef,
  scrollRef,
}: {
  src: string
  pointerRef: MutableRefObject<{ x: number; y: number }>
  scrollRef: MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const g = groupRef.current
    if (!g) return

    const px = pointerRef.current.x
    const py = pointerRef.current.y
    const pointerTiltX = py * -0.22
    const pointerTiltY = px * 0.3

    const scroll = scrollRef.current
    const scrollPitch = (scroll - 0.5) * 0.22

    const t = state.clock.elapsedTime
    const pointerActivity = Math.min(1, Math.hypot(px, py) * 1.4)
    const idle = Math.sin(t * 0.82) * 0.028 * (1 - pointerActivity * 0.85)
    const idleZ = Math.cos(t * 0.55) * 0.018 * (1 - pointerActivity * 0.7)

    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointerTiltX + scrollPitch + idle, 0.11)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointerTiltY, 0.11)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, idleZ, 0.1)
  })

  return (
    <group ref={groupRef}>
      <TextureImage url={src} scale={2.2} toneMapped={false} />
    </group>
  )
}

export function ProductImageStage({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  const pointerRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollRef.current = v
  })

  const onPointerMove = (e: PointerEvent) => {
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    pointerRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
    pointerRef.current.y = ((e.clientY - r.top) / r.height) * 2 - 1
  }

  const onPointerLeave = () => {
    pointerRef.current.x = 0
    pointerRef.current.y = 0
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative h-full w-full touch-none', className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <TiltImage src={src} pointerRef={pointerRef} scrollRef={scrollRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
