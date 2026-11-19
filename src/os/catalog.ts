import type { Link } from '../library'
import { GITHUB_USER, featuredProjects, projects, slugify } from '../library'

export interface OsProject {
  slug: string
  title: string
  summary: string
  description: string
  image: string
  icon?: string
  stack: string
  links: Link[]
  repo?: string
  featured: boolean
}

const dedupe = (links: Link[]) =>
  links.filter((l, i) => links.findIndex((o) => o.href === l.href) === i)

export const catalog: OsProject[] = [
  ...featuredProjects.map((p) => ({
    slug: slugify(p.title),
    title: p.title,
    summary: p.headline,
    description: p.description,
    image: p.image,
    icon: p.icon,
    stack: p.stack,
    links: p.links,
    repo: p.repo,
    featured: true,
  })),
  ...projects.map((p) => ({
    slug: slugify(p.title),
    title: p.title,
    summary: p.description,
    description: p.description,
    image: p.image,
    icon: p.icon,
    stack: p.stack,
    links: dedupe([
      {
        label: p.href.includes('github.com') ? 'GitHub' : 'Project page',
        href: p.href,
      },
      ...(p.repo
        ? [
            {
              label: 'GitHub',
              href: `https://github.com/${GITHUB_USER}/${p.repo}`,
            },
          ]
        : []),
      ...p.links,
    ]),
    repo: p.repo,
    featured: false,
  })),
]

export const findProject = (slug: string) =>
  catalog.find((p) => p.slug === slug || p.slug.startsWith(slug))
