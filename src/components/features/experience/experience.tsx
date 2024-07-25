import React, { useState } from 'react'
import './style.css'
import { Collapse, Dropdown } from '../../../library'

interface ExperienceProps {
  title: string
  company: string
  duration: string
  description: string[]
  logo: string
  isAlternate: boolean
}

const Experience: React.FC<ExperienceProps> = ({
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
    >
      <div className="experience-content">
        <h3>{title}</h3>
        <h4>{company}</h4>
        <p>{duration}</p>
        <div
          className={`experience-description ${isExpanded ? 'expanded' : ''}`}
        >
          <ul>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="dropdown-indicator">
          {isExpanded ? <Collapse /> : <Dropdown />}
        </div>
      </div>
      <img src={logo} alt={`${company} logo`} className="company-logo" />
      <div className="blob"></div>
    </div>
  )
}

export default Experience
