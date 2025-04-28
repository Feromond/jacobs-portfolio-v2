import React, { memo, forwardRef } from 'react'
import { Github, Link, projects, publications } from '../../../library'
import { Headings } from '../../core/headings/headings'
import Publication from '../publications/publications'
import { useProjectPagination } from './useProjectPagination'
import './style.css'

interface Project {
  title: string
  githubUrl: string
  externalUrl?: string
  screenshotImage?: string
  languages: string[]
}

const gradientMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']

const ProjectCard = memo(
  ({
    project,
    gradientClassName,
  }: {
    project: Project
    gradientClassName: string
  }) => {
    const hasScreenshot =
      'screenshotImage' in project && project.screenshotImage

    return (
      <a
        className={`projects-card ${gradientClassName}`}
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
  }
)

ProjectCard.displayName = 'ProjectCard'

const ITEMS_PER_PAGE = 6
const PAGINATION_BREAKPOINT = '(min-width: 1001px)'

const Projects = forwardRef<HTMLDivElement>((props, ref) => {
  const {
    visibleItems: visibleProjects,
    currentPage,
    totalPages,
    isPaginated,
    goToNextPage,
    goToPrevPage,
  } = useProjectPagination({
    items: projects,
    itemsPerPage: ITEMS_PER_PAGE,
    breakpoint: PAGINATION_BREAKPOINT,
  })

  return (
    <div ref={ref} className="projects">
      <Headings title="Projects" subtitle="Stuff I've Worked On" />
      <div className="projects-view-wrapper">
        {isPaginated && currentPage > 0 && (
          <button
            className="pagination-arrow prev-arrow"
            onClick={goToPrevPage}
            aria-label="Previous projects"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        <div className="projects-grid">
          {visibleProjects.map((project) => {
            const proj = project as Project
            const originalIndex = projects.findIndex(
              (p) => p.title === proj.title
            )
            const gradientIndex = originalIndex % gradientMap.length
            const gradientClassName = `gradient-${gradientMap[gradientIndex]}`

            return (
              <ProjectCard
                key={proj.title}
                project={proj}
                gradientClassName={gradientClassName}
              />
            )
          })}
        </div>
        {isPaginated && currentPage < totalPages - 1 && (
          <button
            className="pagination-arrow next-arrow"
            onClick={goToNextPage}
            aria-label="Next projects"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
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
