import React, { useState, useEffect, useCallback, useRef } from 'react'
import { navbarData } from '../../../library'
import * as Icons from '../../../library/icons'
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
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({})
  const navItemsRef = useRef<(HTMLSpanElement | null)[]>([])

  const updateSliderStyle = useCallback((index: number) => {
    const currentItem = navItemsRef.current[index]
    if (currentItem) {
      const rect = currentItem.getBoundingClientRect()
      const parentRect = currentItem.parentElement?.getBoundingClientRect()
      if (parentRect) {
        setSliderStyle({
          width: `${rect.width}px`,
          left: `${rect.left - parentRect.left}px`,
        })
      }
    }
  }, [])

  // Update slider on window resize
  useEffect(() => {
    let resizeTimeout: number

    const handleResize = () => {
      // Debounce the resize event
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        updateSliderStyle(hoveredLink !== null ? hoveredLink : activeLink)
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [updateSliderStyle, hoveredLink, activeLink])

  useEffect(() => {
    updateSliderStyle(activeLink)
  }, [activeLink, updateSliderStyle])

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

  // Debounced version of setActiveLink to prevent rapid updates
  const debouncedSetActiveLink = useCallback((index: number) => {
    const timeoutId = setTimeout(() => {
      setActiveLink(index)
    }, 50) // Small delay to smooth out rapid changes

    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Adjusted for better visibility detection
      threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds to track visibility better
    }

    const sectionToIndex = new Map([
      [homeRef.current, 0],
      [aboutRef.current, 1],
      [projectsRef.current, 2],
      [contactRef.current, 3],
    ])

    let visibleSections = new Map() // Track intersection ratio of each section

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // Store or remove the intersection ratio for each section
        if (entry.isIntersecting) {
          visibleSections.set(entry.target, entry.intersectionRatio)
        } else {
          visibleSections.delete(entry.target)
        }
      })

      // Find the section with the highest visibility ratio
      let maxRatio = 0
      let mostVisibleSection = null

      visibleSections.forEach((ratio, section) => {
        if (ratio > maxRatio) {
          maxRatio = ratio
          mostVisibleSection = section
        }
      })

      // Update active link based on the most visible section
      if (mostVisibleSection && sectionToIndex.has(mostVisibleSection)) {
        debouncedSetActiveLink(sectionToIndex.get(mostVisibleSection)!)
      } else if (visibleSections.size === 0 && window.scrollY === 0) {
        // If no sections are visible and we're at the top, activate Home
        debouncedSetActiveLink(0)
      }
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
  }, [homeRef, aboutRef, projectsRef, contactRef, debouncedSetActiveLink])

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
        {navbarData.navigator.map((nav, index) => {
          const Icon = Icons[nav.icon as keyof typeof Icons]
          const isHovered = hoveredLink === index
          const isActive = activeLink === index
          const showText = isHovered || (isActive && hoveredLink === null)

          return (
            <span
              key={index}
              ref={(el) => (navItemsRef.current[index] = el)}
              onClick={() => handleLinkClick(index)}
              onMouseEnter={() => {
                setHoveredLink(index)
                updateSliderStyle(index)
              }}
              onMouseLeave={() => {
                setHoveredLink(null)
                updateSliderStyle(activeLink)
              }}
              className={`nav-links-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-text-wrapper">
                <Icon className={`nav-icon ${showText ? 'hide' : ''}`} />
                <span className={`nav-text ${showText ? 'show' : ''}`}>
                  {nav.name}
                </span>
              </div>
            </span>
          )
        })}

        <div className="nav-slider" style={sliderStyle} />
      </div>
    </div>
  )
}
