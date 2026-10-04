import { motion, type HTMLMotionProps } from 'framer-motion'

/** Aparece desde abajo cuando entra en pantalla. */
export function Reveal({ delay = 0, y = 28, ...props }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  )
}
