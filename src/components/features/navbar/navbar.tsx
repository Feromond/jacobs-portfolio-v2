import React, { useState, useEffect } from 'react'
import { navbarData } from '../../../library'
import './style.css'

type NavProps = {
  scrollToSection: (elementRef: React.RefObject<HTMLDivElement>) => void
  homeRef: React.RefObject<HTMLDivElement>
  aboutRef: React.RefObject<HTMLDivElement>
  projectsRef: React.RefObject<HTMLDivElement>
  contactRef: React.RefObject<HTMLDivElement>
}

export function Navbar({
  scrollToSection,
  homeRef,
  aboutRef,
  projectsRef,
  contactRef,
}: NavProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [activeLink, setActiveLink] = useState<number>(0)

  const changeBackground = () => {
    if (window.scrollY >= 40) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', changeBackground)
    return () => {
      window.removeEventListener('scroll', changeBackground)
    }
  }, [])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          switch (entry.target) {
            case homeRef.current:
              setActiveLink(0)
              break
            case aboutRef.current:
              setActiveLink(1)
              break
            case projectsRef.current:
              setActiveLink(2)
              break
            case contactRef.current:
              setActiveLink(3)
              break
            default:
              break
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, options)

    if (homeRef.current) observer.observe(homeRef.current)
    if (aboutRef.current) observer.observe(aboutRef.current)
    if (projectsRef.current) observer.observe(projectsRef.current)
    if (contactRef.current) observer.observe(contactRef.current)

    return () => {
      if (homeRef.current) observer.unobserve(homeRef.current)
      if (aboutRef.current) observer.unobserve(aboutRef.current)
      if (projectsRef.current) observer.unobserve(projectsRef.current)
      if (contactRef.current) observer.unobserve(contactRef.current)
    }
  }, [homeRef, aboutRef, projectsRef, contactRef])

  // Conditionally set CSS classes based on state
  const navBackground = isScrolled ? 'nav-links-filled' : 'nav-links'

  // Handle navigation link clicks to scroll to sections
  const handleLinkClick = (index: number) => {
    setActiveLink(index)
    switch (index) {
      case 0:
        scrollToSection(homeRef)
        break
      case 1:
        scrollToSection(aboutRef)
        break
      case 2:
        scrollToSection(projectsRef)
        break
      case 3:
        scrollToSection(contactRef)
        break
      default:
        break
    }
  }

  return (
    <div className="nav">
      <div className={navBackground}>
        {navbarData.navigator.map((nav, index) => (
          <span
            key={index}
            onClick={() => handleLinkClick(index)}
            className={`nav-links-item ${activeLink === index ? 'active' : ''}`}
          >
            {nav.name}
          </span>
        ))}

        <div
          className={`nav-slider ${
            activeLink === 0
              ? 'Home'
              : activeLink === 1
              ? 'About'
              : activeLink === 2
              ? 'Projects'
              : activeLink === 3 && 'Contact'
          }`}
        />
      </div>
    </div>
  )
}
