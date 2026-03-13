'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [mounted, setMounted]   = useState(false)
  const [visible, setVisible]   = useState(false)
  const [isHover, setIsHover]   = useState(false)
  const [isPress, setIsPress]   = useState(false)
  const [isTouch, setIsTouch]   = useState(false)

  /* Exact position — dot follows this directly */
  const dotX = useMotionValue(-200)
  const dotY = useMotionValue(-200)

  /* Lagged follower for the ring */
  const ringX = useSpring(dotX, { stiffness: 140, damping: 16 })
  const ringY = useSpring(dotY, { stiffness: 140, damping: 16 })

  useEffect(() => {
    setMounted(true)
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    function onMove(e: MouseEvent) {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      setVisible(true)
    }
    function onDown()  { setIsPress(true) }
    function onUp()    { setIsPress(false) }
    function onLeave() { setVisible(false) }
    function onEnter() { setVisible(true) }

    /* Delegate interactive hover to avoid per-element listeners */
    function onHoverStart(e: MouseEvent) {
      const t = e.target as HTMLElement
      if (t.closest('a, button, [role="button"], input, textarea, select, label')) {
        setIsHover(true)
      }
    }
    function onHoverEnd(e: MouseEvent) {
      const t = e.relatedTarget as HTMLElement | null
      if (!t?.closest('a, button, [role="button"], input, textarea, select, label')) {
        setIsHover(false)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseover',  onHoverStart)
    document.addEventListener('mouseout',   onHoverEnd)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseover',  onHoverStart)
      document.removeEventListener('mouseout',   onHoverEnd)
    }
  }, [dotX, dotY])

  if (!mounted || isTouch) return null

  return (
    <>
      {/* Dot — exact, instant */}
      <motion.span
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width:   isPress ? 7  : 10,
          height:  isPress ? 7  : 10,
          opacity: visible ? (isHover ? 0 : 1) : 0,
          backgroundColor: '#ffffff',
        }}
        transition={{ duration: 0.08 }}
      />

      {/* Ring — springs behind */}
      <motion.span
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%', border: '1.5px solid' }}
        animate={{
          width:   isHover ? 36 : isPress ? 16 : 26,
          height:  isHover ? 36 : isPress ? 16 : 26,
          opacity: visible ? 1 : 0,
          borderColor:     isHover ? 'rgba(99,102,241,0.85)' : 'rgba(255,255,255,0.45)',
          backgroundColor: isHover ? 'rgba(99,102,241,0.08)' : 'transparent',
          scale:   isPress ? 0.85 : 1,
        }}
        transition={{ duration: 0.18 }}
      />
    </>
  )
}
