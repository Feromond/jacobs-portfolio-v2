import React from 'react'
import { Line } from '../../../library'
import './style.css'

type HeadingsProps = {
  title: string
  subtitle: string
}

// Headings component: Renders a title and subtitle with a line separator
export function Headings({ title, subtitle }: HeadingsProps) {
  return (
    <div className="headline-wrapper">
      <h2 className="headline">
        {title}
        <Line />
      </h2>
      <h3 className="subline"> {subtitle} </h3>
    </div>
  )
}
