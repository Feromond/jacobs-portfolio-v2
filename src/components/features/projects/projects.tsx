import React from 'react'
import { Github, Link, projects } from '../../../library'
import { Headings } from '../../core/headings/headings'
import './style.css'

const Projects = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="projects">
      <Headings title="Projects" subtitle="Stuff I’ve Worked On" />
      <div className="projects-grid">
        {projects.map((project) => (
          <a
            className="projects-card"
            href={project.githubUrl}
            target="_blank"
            key={project.title}
            rel="noreferrer"
          >
            <div className="project-link">
              <a
                target={'_blank'}
                href={project.githubUrl}
                rel="noreferrer"
                aria-label="github"
              >
                <Github />
              </a>
              <a
                target={'_blank'}
                href={project.externalUrl}
                rel="noreferrer"
                aria-label="live"
              >
                <Link />
              </a>
            </div>
            <p className="project-name">{project.title}</p>
            <div className="project-language">
              {project.languages.map((language) => (
                <span key={language}>{language}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
})

Projects.displayName = 'Projects'

export { Projects }
