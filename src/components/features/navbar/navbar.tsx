import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  // Track if we're scrolled down enough to show the filled navbar
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  // Track which section is currently active (from scroll detection)
  const [activeSection, setActiveSection] = useState<number>(0)

  // Track if user is currently hovering a nav item
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  // Track if we're in a manual navigation state (prevents scroll updates)
  const isManualNavRef = useRef<boolean>(false)

  // Track the last clicked item (used for manual navigation)
  const [clickedItem, setClickedItem] = useState<number>(-1)

  // Keep references to nav items for measurements
  const navItemsRef = useRef<(HTMLSpanElement | null)[]>([])

  // Store slider position and size
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({})

  // Track scroll position for background change
  useEffect(() => {
    const changeBackground = () => {
      setIsScrolled(window.scrollY >= 40)
    }

    window.addEventListener('scroll', changeBackground)
    return () => window.removeEventListener('scroll', changeBackground)
  }, [])

  // Update slider position based on what's currently showing
  const updateSliderPosition = useCallback((index: number) => {
    const currentItem = navItemsRef.current[index]
    if (!currentItem) return

    const rect = currentItem.getBoundingClientRect()
    const parentRect = currentItem.parentElement?.getBoundingClientRect()
    if (!parentRect) return

    const extraPadding = 16
    setSliderStyle({
      width: `${Math.round(rect.width + extraPadding)}px`,
      left: `${Math.round(rect.left - parentRect.left - extraPadding / 2)}px`,
    })
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Determine which item to show based on state hierarchy:
      // 1. Hovered item takes precedence when present
      // 2. During manual navigation, show the clicked item
      // 3. Otherwise, show the active section from scroll
      const indexToShow =
        hoveredItem !== null
          ? hoveredItem
          : isManualNavRef.current
          ? clickedItem
          : activeSection

      updateSliderPosition(indexToShow)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [hoveredItem, clickedItem, activeSection, updateSliderPosition])

  // Intersection Observer to detect which section is visible
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const options = {
      root: null,
      rootMargin: isMobile ? '-15% 0px -15% 0px' : '-20% 0px -20% 0px',
      threshold: isMobile
        ? [0.05, 0.1, 0.2, 0.3, 0.4, 0.5]
        : [0.1, 0.25, 0.5, 0.75],
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
      // Skip updates during manual navigation
      if (isManualNavRef.current) return

      // On mobile, clear any lingering hover states during scroll
      if (isMobile && hoveredItem !== null) {
        setHoveredItem(null)
      }

      // Process entries
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

        // Only update if different from current active section
        if (mostVisibleSection !== activeSection) {
          setActiveSection(mostVisibleSection)

          // Only update slider if not hovering and not in manual nav
          if (hoveredItem === null && !isManualNavRef.current) {
            updateSliderPosition(mostVisibleSection)
          }
        }
      } else if (window.scrollY === 0) {
        setActiveSection(0)

        // Only update slider if not hovering and not in manual nav
        if (hoveredItem === null && !isManualNavRef.current) {
          updateSliderPosition(0)
        }
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
    updateSliderPosition,
    activeSection,
    hoveredItem,
  ])

  // Function to handle nav item clicks with clear separation from scroll detection
  const handleItemClick = (index: number) => {
    // Skip if already on this section
    if (clickedItem === index && activeSection === index && clickedItem !== -1)
      return

    // Clear any persistent hover state (important for mobile)
    setHoveredItem(null)

    // Set clicked state (styling will follow hover state that's already active)
    setClickedItem(index)

    // Set manual navigation mode - this blocks scroll detection updates
    isManualNavRef.current = true

    // No need to update slider position - it's already positioned by hover

    // Scroll to section - this will trigger scroll events, but we're ignoring them
    const targetRef = [
      homeRef,
      aboutRef,
      experienceRef,
      projectsRef,
      contactRef,
    ][index]
    scrollToSection(targetRef)

    // After scrolling completes, re-enable scroll detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setTimeout(
      () => {
        isManualNavRef.current = false

        // When re-enabling scroll detection, update active section and CLEAR clicked item
        // This ensures we don't have duplicate active items
        setActiveSection(index)
        setClickedItem(index) // Initially set to match current section

        // After a small delay, clear the clicked item to fully transition to scroll-based navigation
        setTimeout(() => {
          if (!isManualNavRef.current) {
            // Only if we're still in scroll mode
            setClickedItem(-1) // Use -1 to indicate no clicked item is active
          }
        }, 500)
      },
      isMobile ? 1200 : 800
    )
  }

  // Determine visual state for rendering
  const navBackground = isScrolled ? 'nav-links-filled' : 'nav-links'

  // Function to determine if text should be shown for an item
  const shouldShowText = (index: number) => {
    return (
      hoveredItem === index ||
      (clickedItem === index && clickedItem !== -1 && hoveredItem === null) ||
      (activeSection === index &&
        hoveredItem === null &&
        (!isManualNavRef.current || clickedItem === -1))
    )
  }

  // Function to determine if icon should show the glow effect
  const shouldShowGlow = (index: number) => {
    return (
      ((activeSection === index && clickedItem === -1) ||
        (clickedItem === index && clickedItem !== -1)) &&
      hoveredItem !== null &&
      hoveredItem !== index
    )
  }

  // Update slider when hover/active/clicked state changes
  useEffect(() => {
    const indexToShow =
      hoveredItem !== null
        ? hoveredItem
        : isManualNavRef.current
        ? clickedItem
        : activeSection

    updateSliderPosition(indexToShow)
  }, [hoveredItem, activeSection, clickedItem, updateSliderPosition])

  // Effect to handle touch events on mobile devices
  useEffect(() => {
    // This handles the case where the user taps elsewhere on the screen
    // to ensure any lingering hover states from previous taps are cleared
    const handleTouchStart = (e: TouchEvent) => {
      // Only clear hover if we're not touching a nav item
      // Check if the touch target is within the navbar
      const navbarEl = document.querySelector('.nav')
      const target = e.target as Node

      // If the touch is outside the navbar, clear hover state
      if (navbarEl && !navbarEl.contains(target)) {
        setHoveredItem(null)
      }
    }

    // Add global touch handler
    document.addEventListener('touchstart', handleTouchStart)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  return (
    <div className="nav">
      <div className={navBackground}>
        {navbarData.navigator.map((nav, index) => {
          const Icon = Icons[nav.icon as keyof typeof Icons]
          const isHovered = hoveredItem === index
          const isActive =
            activeSection === index ||
            (clickedItem === index && clickedItem !== -1)
          const showText = shouldShowText(index)
          const showGlow = shouldShowGlow(index)

          return (
            <span
              key={index}
              ref={(el) => (navItemsRef.current[index] = el)}
              onClick={() => handleItemClick(index)}
              onTouchStart={() => {
                // On mobile, immediately clear any previously active hover states
                // This ensures we don't get stuck in a hover state on touch devices
                if (hoveredItem !== null) {
                  setHoveredItem(null)
                }
              }}
              onMouseEnter={() => {
                setHoveredItem(index)
                updateSliderPosition(index)
              }}
              onMouseLeave={() => {
                setHoveredItem(null)

                // When leaving hover, show either clicked item or active section
                const indexToShow = isManualNavRef.current
                  ? clickedItem
                  : activeSection
                updateSliderPosition(indexToShow)
              }}
              className={`nav-links-item ${isActive ? 'active' : ''} ${
                showGlow ? 'active-glow' : ''
              }`}
            >
              <div className="nav-icon-text-wrapper">
                <Icon
                  className={`nav-icon ${showText ? 'hide' : ''} ${
                    showGlow ? 'glow' : ''
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
