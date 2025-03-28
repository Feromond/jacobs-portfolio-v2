import React from 'react'
import { Headings } from '../../core/headings/headings'
import resumePDF from '../../../assets/Jacob_Mish_Resume.pdf'
import { skills } from '../../../library/data'
import './style.css'

const About = React.forwardRef<HTMLDivElement>((props, ref) => {
  // Create a doubled array of skills for seamless looping
  const duplicatedSkills = [...skills, ...skills]

  return (
    <div ref={ref} className="about-section">
      <Headings title="About" subtitle="Hi, I'm Jacob." />
      <p className="about-text">
        <p>
          I&apos;m a professional in the field of data and machine learning with
          a genuine passion for discovering how technology can simplify and
          solve complex problems. My background in Geophysics has instilled in
          me a strong analytical mindset and a keen attention to detail,
          qualities that I bring to every project I undertake.{' '}
        </p>
        <p>
          In my career, I&apos;ve had the opportunity to engage with a variety
          of programming languages and data science tools, constantly learning
          and adapting to meet the needs of each new challenge. While I&apos;ve
          enjoyed the process of developing solutions and automating tasks to
          drive efficiency, I believe the true reward comes from working
          collaboratively, sharing insights, and learning from the diverse
          perspectives of team members.
        </p>
        <p>
          Outside of my professional roles, I dedicate time to personal projects
          and keeping up with the latest trends in technology. This not only
          fuels my creativity but also ensures that I remain connected with the
          ever-evolving tech landscape.
        </p>
        <p>
          I approach my work with a balanced mix of curiosity, diligence, and a
          humble attitude, always ready to roll up my sleeves and tackle the
          next challenge. To me, success is not just about achieving personal
          goals, but also about contributing to a larger purpose and making a
          positive impact through my work.{' '}
        </p>
        <p>
          Feel free to message me on
          <a
            className="about-link"
            href="https://www.linkedin.com/in/jacob-mish-25915722a/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>{' '}
          to chat!
        </p>
      </p>

      {/* Skills Carousel - Horizontal Flow */}
      <div className="skills-carousel-container">
        <h3 className="skills-heading">Technical Skills</h3>
        <div className="skills-flow">
          <div className="skills-track">
            {duplicatedSkills.map((skill, index) => (
              <div className="skill-item" key={`top-${index}`}>
                <div className="skill-name">{skill.name}</div>
                <div className="skill-category">{skill.category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Second track going in reverse direction */}
        <div className="skills-flow">
          <div className="skills-track">
            {/* Shuffle the skills array for visual variety */}
            {[...duplicatedSkills].reverse().map((skill, index) => (
              <div className="skill-item" key={`bottom-${index}`}>
                <div className="skill-name">{skill.name}</div>
                <div className="skill-category">{skill.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="resume-download">
        <a href={resumePDF} download>
          <button className="download-button">Download Resume</button>
        </a>
      </div>
    </div>
  )
})

About.displayName = 'About'

export { About }
