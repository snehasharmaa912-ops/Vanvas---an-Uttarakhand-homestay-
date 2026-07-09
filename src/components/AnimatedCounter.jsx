import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

export default function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 1200, bounce: 0 })
  const numeric = parseFloat(value)
  const isDecimal = !Number.isInteger(numeric)

  useEffect(() => {
    if (isInView) motionValue.set(numeric)
  }, [isInView, numeric])

  useEffect(() => {
    return springValue.on('change', latest => {
      if (ref.current) {
        ref.current.textContent = isDecimal
          ? latest.toFixed(1) + suffix
          : Math.round(latest) + suffix
      }
    })
  }, [springValue])

  return <span ref={ref}>0{suffix}</span>
}
