import React, { useState, useEffect, useCallback, useRef } from 'react'
import { navbarData } from '../../../library'
import * as Icons from '../../../library/icons'
import './style.css'

type NavProps = {
  scrollToSection: (elementRef: React.RefObject<HTMLDivElement>) => void
  homeRef: React.RefObject<HTMLDivElement>
  aboutRef: React.RefObject<HTMLDivElement>
  projectsRef: React.RefObject<HTMLDivElement>
  experienceRef: React.RefObject<HTMLDivElement>
  contactRef: React.RefObject<HTMLDivElement>
}

export function Navbar({
  scrollToSection,
  homeRef,
  aboutRef,
  projectsRef,
  experienceRef,
  contactRef,
}: NavProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [activeLink, setActiveLink] = useState<number>(0)
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({})
  const navItemsRef = useRef<(HTMLSpanElement | null)[]>([])
  const manualScrollRef = useRef<boolean>(false)
  const observerEnabledRef = useRef<boolean>(true)

  const updateSliderStyle = useCallback((index: number) => {
    const currentItem = navItemsRef.current[index]
    if (currentItem) {
      const rect = currentItem.getBoundingClientRect()
      const parentRect = currentItem.parentElement?.getBoundingClientRect()
      if (parentRect) {
        // Add extra padding to ensure text fits comfortably
        const extraPadding = 16

        // Set the slider style with values rounded to prevent sub-pixel rendering issues
        setSliderStyle({
          width: `${Math.round(rect.width + extraPadding)}px`,
          left: `${Math.round(
            rect.left - parentRect.left - extraPadding / 2
          )}px`,
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

  // Update slider when activeLink changes
  useEffect(() => {
    updateSliderStyle(activeLink)
  }, [activeLink, updateSliderStyle])

  // Handle background change on scroll
  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY >= 40) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', changeBackground)
    return () => {
      window.removeEventListener('scroll', changeBackground)
    }
  }, [])

  // Scroll direction detection to help unfreeze navbar
  useEffect(() => {
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      // If we were in a disabled observer state and direction changed, re-enable
      if (!observerEnabledRef.current) {
        // Direction changed or significant scroll occurred
        if (
          (scrollTop < lastScrollTop && lastScrollTop - scrollTop > 10) ||
          (scrollTop > lastScrollTop && scrollTop - lastScrollTop > 10)
        ) {
          observerEnabledRef.current = true
        }
      }

      lastScrollTop = scrollTop
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for section detection
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0.1, 0.25, 0.5, 0.75],
    }

    const sectionRefs = [
      { ref: homeRef.current, index: 0 },
      { ref: aboutRef.current, index: 1 },
      { ref: experienceRef.current, index: 2 },
      { ref: projectsRef.current, index: 3 },
      { ref: contactRef.current, index: 4 },
    ]

    let visibleSections = new Map()

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Skip updates if manual scrolling just happened
      if (!observerEnabledRef.current) return

      // Process intersection entries
      entries.forEach((entry) => {
        const targetIndex = sectionRefs.find(
          (section) => section.ref === entry.target
        )?.index

        if (targetIndex !== undefined) {
          if (entry.isIntersecting) {
            visibleSections.set(targetIndex, entry.intersectionRatio)
          } else {
            visibleSections.delete(targetIndex)
          }
        }
      })

      // Find most visible section
      if (visibleSections.size > 0) {
        const [mostVisibleSection] = [...visibleSections.entries()].reduce(
          (max, [section, ratio]) => (ratio > max[1] ? [section, ratio] : max),
          [0, 0]
        )

        // Only update if different from current active
        if (mostVisibleSection !== activeLink) {
          setActiveLink(mostVisibleSection)
          updateSliderStyle(mostVisibleSection)
        }
      } else if (window.scrollY === 0) {
        setActiveLink(0)
        updateSliderStyle(0)
      }
    }

    const observer = new IntersectionObserver(handleIntersection, options)

    sectionRefs.forEach((section) => {
      if (section.ref) observer.observe(section.ref)
    })

    return () => {
      sectionRefs.forEach((section) => {
        if (section.ref) observer.unobserve(section.ref)
      })
    }
  }, [
    homeRef,
    aboutRef,
    experienceRef,
    projectsRef,
    contactRef,
    updateSliderStyle,
    activeLink,
  ])

  // Handle navigation link clicks
  const handleLinkClick = (index: number) => {
    // If we're already on this section, avoid unnecessary updates to prevent glitches
    if (activeLink === index) {
      return
    }

    setActiveLink(index)

    // Temporarily disable observer when clicking
    observerEnabledRef.current = false

    // Re-enable observer after scroll animation completes
    // and add a backup to make sure it eventually gets re-enabled
    const timeoutDuration = 800
    setTimeout(() => {
      observerEnabledRef.current = true
    }, timeoutDuration)

    // Create a persistent check to re-enable if still disabled after longer period
    setTimeout(() => {
      if (!observerEnabledRef.current) {
        observerEnabledRef.current = true
      }
    }, timeoutDuration * 2)

    switch (index) {
      case 0:
        scrollToSection(homeRef)
        break
      case 1:
        scrollToSection(aboutRef)
        break
      case 2:
        scrollToSection(experienceRef)
        break
      case 3:
        scrollToSection(projectsRef)
        break
      case 4:
        scrollToSection(contactRef)
        break
      default:
        break
    }
  }

  // Conditionally set CSS classes
  const navBackground = isScrolled ? 'nav-links-filled' : 'nav-links'

  return (
    <div className="nav">
      <div className={navBackground}>
        {navbarData.navigator.map((nav, index) => {
          const Icon = Icons[nav.icon as keyof typeof Icons]
          const isHovered = hoveredLink === index
          const isActive = activeLink === index
          const showText = isHovered || (isActive && hoveredLink === null)

          // Determine if we should show the active glow
          // Only show the glow on the active item when hovering over a different item
          const showActiveGlow =
            isActive && hoveredLink !== null && hoveredLink !== index

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
              className={`nav-links-item ${isActive ? 'active' : ''} ${
                showActiveGlow ? 'active-glow' : ''
              }`}
            >
              <div className="nav-icon-text-wrapper">
                <Icon
                  className={`nav-icon ${showText ? 'hide' : ''} ${
                    showActiveGlow ? 'glow' : ''
                  }`}
                />
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
