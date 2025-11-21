import React from 'react'
import { useRef } from 'react'
import { Navbar } from './components/features/navbar/navbar'
import { ColorBends } from './components/features/background/background'
import { About, Projects, Socials, Contact, Footer } from './components'
import { Home } from './components/features/home/home'
import Experience from './components/features/experience/experience'

export default function App() {
  // Refs for scrolling to specific sections
  const homeRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Function to scroll to a specific section
  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement>) => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop,
        behavior: 'smooth',
      })
    }
  }

  return (
    <>
      <ColorBends
        colors={['#ff5c7a', '#8a5cff', '#00ffd1']}
        rotation={-17}
        speed={0.12}
        scale={1.1}
        frequency={1.0}
        warpStrength={1.0}
        mouseInfluence={0.075}
        parallax={0.1}
        noise={0.05}
        transparent={false}
      />
      <Navbar
        scrollToSection={scrollToSection}
        homeRef={homeRef}
        aboutRef={aboutRef}
        projectsRef={projectsRef}
        experienceRef={experienceRef}
        contactRef={contactRef}
      />
      <main>
        <Home ref={homeRef} />
        <About ref={aboutRef} />
        <Experience ref={experienceRef} />
        <Projects ref={projectsRef} />
        <Socials ref={contactRef} />
        <Contact ref={contactRef} />
        <Footer />
      </main>
    </>
  )
}
