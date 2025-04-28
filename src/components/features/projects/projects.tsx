import React, { memo } from 'react'
import { Github, Link, projects, publications } from '../../../library'
import { Headings } from '../../core/headings/headings'
import Publication from '../publications/publications'
import './style.css'

interface Project {
  title: string
  githubUrl: string
  externalUrl?: string
  screenshotImage?: string
  languages: string[]
}

const ProjectCard = memo(({ project }: { project: Project }) => {
  const hasScreenshot = 'screenshotImage' in project && project.screenshotImage

  return (
    <a
      className="projects-card"
      href={project.githubUrl}
      target="_blank"
      key={project.title}
      rel="noreferrer"
    >
      {hasScreenshot && (
        <div className="project-screenshot">
          <img
            src={project.screenshotImage}
            alt={`${project.title} screenshot`}
            loading="lazy"
          />
        </div>
      )}
      <div className="project-link">
        <a
          target={'_blank'}
          href={project.githubUrl}
          rel="noreferrer"
          aria-label="github"
        >
          <Github />
        </a>
        {project.externalUrl && (
          <a
            target={'_blank'}
            href={project.externalUrl}
            rel="noreferrer"
            aria-label="live"
          >
            <Link />
          </a>
        )}
      </div>
      <p className="project-name">{project.title}</p>
      <div className="project-language">
        {project.languages.map((language: string) => (
          <span key={language}>{language}</span>
        ))}
      </div>
    </a>
  )
})

ProjectCard.displayName = 'ProjectCard'

const Projects = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="projects">
      <Headings title="Projects" subtitle="Stuff I've Worked On" />
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
      <Headings title="Publications" subtitle="Research and Articles" />
      <div className="publications-grid">
        {publications.map((publication, index) => (
          <Publication key={index} {...publication} />
        ))}
      </div>
    </div>
  )
})

Projects.displayName = 'Projects'

export { Projects }
