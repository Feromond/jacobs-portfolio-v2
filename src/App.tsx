import {
  About,
  ColorBends,
  Contact,
  Experience,
  Footer,
  Home,
  Navbar,
  Projects,
  Publications,
} from './components'
import { useReveal } from './useReveal'

const BACKGROUND_COLORS = ['#ff5c7a', '#8a5cff', '#00ffd1']

export default function App() {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <ColorBends
        colors={BACKGROUND_COLORS}
        rotation={-17}
        speed={0.06}
        scale={1.1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={0.075}
        parallax={0.1}
        noise={0.04}
      />
      <Navbar />
      <main>
        <Home />
        <About />
        <Experience />
        <Projects />
        <Publications />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
