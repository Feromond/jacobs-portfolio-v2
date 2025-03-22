import React, { useState } from 'react'
import './style.css'
import { Headings } from '../../core/headings/headings'
import { experiences } from '../../../library'

const Experience = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="experience-section">
      <Headings title="Experience" subtitle="My Professional Journey" />
      <div className="experiences">
        {experiences.map((exp, index) => (
          <ExperienceItem key={index} {...exp} isAlternate={index % 2 !== 0} />
        ))}
      </div>
    </div>
  )
})

interface ExperienceItemProps {
  title: string
  company: string
  duration: string
  description: string[]
  logo: string
  isAlternate: boolean
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  title,
  company,
  duration,
  description,
  logo,
  isAlternate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={`experience-entry ${isAlternate ? 'alternate' : ''}`}
      onClick={toggleExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleExpand()
        }
      }}
      aria-expanded={isExpanded}
      aria-label={`${title} at ${company}`}
    >
      <div className="experience-content">
        <h3>{title}</h3>
        <h4>{company}</h4>
        <p className="duration">{duration}</p>
        <div
          className={`experience-description ${isExpanded ? 'expanded' : ''}`}
          aria-hidden={!isExpanded}
        >
          <ul>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="dropdown-indicator" aria-hidden="true"></div>
      </div>
      <img
        src={logo}
        alt={`${company} logo`}
        className="company-logo"
        loading="lazy"
      />
      <div className="blob" aria-hidden="true"></div>
    </div>
  )
}

Experience.displayName = 'Experience'

export default Experience
