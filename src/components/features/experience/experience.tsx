import React, { useState } from 'react'
import './style.css'

interface ExperienceProps {
  title: string
  company: string
  duration: string
  description: string[]
  isAlternate: boolean
}

const Experience: React.FC<ExperienceProps> = ({
  title,
  company,
  duration,
  description,
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
        <div className="dropdown-indicator">{isExpanded ? '▲' : '▼'}</div>
      </div>
      <div className="blob"></div>
    </div>
  )
}

export default Experience
