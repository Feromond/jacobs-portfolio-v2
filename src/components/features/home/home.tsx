import React from 'react'
import { motion } from 'framer-motion'
import './style.css'

interface MotionBlockProps {
  as?: keyof JSX.IntrinsicElements
  className: string
  delay: number
  children?: React.ReactNode
}

const variants = {
  hidden: { translateX: '100px', opacity: 0 },
  visible: (delay: number) => ({
    translateX: '0px',
    opacity: 1,
    transition: {
      delay,
      type: 'spring',
      duration: 0.6,
    },
  }),
}

const MotionBlock = ({ className, delay, children }: MotionBlockProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={variants}
    className={className}
    custom={delay}
  >
    {children}
  </motion.div>
)

const Home = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="wrapper">
      <MotionBlock className="arrow" delay={0.2} />
      <div className="bundle">
        <MotionBlock className="chunck" delay={0.2}>
          <MotionBlock className="three-line-primary-V1" delay={0.6} />
          <MotionBlock className="three-line-secondary-V1" delay={0.8} />
          <MotionBlock className="three-line-tertiary-V1" delay={1} />
        </MotionBlock>
        <MotionBlock className="one-line-primary" delay={0.4} />
        <MotionBlock className="chunck" delay={0.2}>
          <MotionBlock className="four-line-primary-V1" delay={0.6} />
          <MotionBlock className="four-line-secondary-V1" delay={0.8} />
          <MotionBlock className="four-line-tertiary-V1" delay={1} />
          <MotionBlock className="four-line-prevention-V1" delay={1.2} />
        </MotionBlock>

        <MotionBlock className="chunck" delay={0.2}>
          <MotionBlock className="four-line-primary-V2" delay={0.6} />
          <MotionBlock className="four-line-secondary-V2" delay={0.8} />
          <MotionBlock className="four-line-tertiary-V2" delay={1} />
          <MotionBlock className="four-line-prevention-V2" delay={1.2} />
        </MotionBlock>
        <MotionBlock className="distance-left-chunck" delay={0.2}>
          <MotionBlock className="four-line-primary-V3" delay={0.6} />
          <MotionBlock className="four-line-secondary-V3" delay={0.8} />
          <MotionBlock className="four-line-tertiary-V3" delay={1} />
          <MotionBlock className="four-line-prevention-V3" delay={1.2} />
        </MotionBlock>
        <MotionBlock className="name" delay={0.4}>
          <MotionBlock as="h1" className="title" delay={0.8}>
            Jacob Mish
          </MotionBlock>
          <MotionBlock as="h2" className="subtitle" delay={0.8}>
            Software Engineer / Data & ML Engineer{' '}
          </MotionBlock>
        </MotionBlock>
        <MotionBlock className="chunck" delay={0.2}>
          <MotionBlock className="two-line-primary-V1" delay={0.6} />
          <MotionBlock className="two-line-secondary-V1" delay={0.8} />
        </MotionBlock>
        <MotionBlock className="chunck" delay={0.2}>
          <MotionBlock className="three-line-primary-V2" delay={0.6} />
          <MotionBlock className="three-line-secondary-V2" delay={0.8} />
          <MotionBlock className="three-line-tertiary-V2" delay={1} />
        </MotionBlock>
        <MotionBlock className="chunck" delay={0.2}>
          <MotionBlock className="two-line-primary-V2" delay={0.8} />
          <MotionBlock className="two-line-secondary-V2" delay={1} />
        </MotionBlock>
        <MotionBlock className="one-line-secondary" delay={0.4} />
        <MotionBlock className="chunck" delay={0.2}>
          <MotionBlock className="four-line-primary-V4" delay={0.6} />
          <MotionBlock className="four-line-secondary-V4" delay={0.8} />
          <MotionBlock className="four-line-tertiary-V4" delay={1} />
          <MotionBlock className="four-line-prevention-V4" delay={1.2} />
        </MotionBlock>
      </div>
    </div>
  )
})

Home.displayName = 'Home'

export { Home }
