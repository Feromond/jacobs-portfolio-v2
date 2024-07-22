import React from 'react'
import { Headings } from '../../core/headings/headings'
import Experience from '../experience/experience'
import { experiences } from '../../../library'
import './style.css'

const About = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="about-section">
      <Headings title="About" subtitle="Hi, I'm Jacob." />{' '}
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
      <div className="resume-download">
        <a href="src/library/Jacob_Mish_Resume.pdf" download>
          <button className="download-button">Download Resume</button>
        </a>
      </div>
      <div className="experiences">
        <Headings title="Experiences" subtitle="My Past Experiences" />{' '}
        {experiences.map((exp, index) => (
          <Experience key={index} {...exp} isAlternate={index % 2 !== 0} />
        ))}
      </div>
    </div>
  )
})

About.displayName = 'About'

export { About }
