import type { ReactNode } from 'react'

import './style.css'

type HeadingsProps = {
  title: string
  lede: string
  id?: string
  children?: ReactNode
}

export function Headings({ title, lede, id, children }: HeadingsProps) {
  return (
    <header className="section-head" data-reveal>
      <h2 id={id}>
        {title}. <span>{lede}</span>
      </h2>
      {children && <div className="section-head-actions">{children}</div>}
    </header>
  )
}
