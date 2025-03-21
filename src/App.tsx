import React from 'react'
import { useRef } from 'react'
import { Navbar } from './components/features/navbar/navbar'
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
