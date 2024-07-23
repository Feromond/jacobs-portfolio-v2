import React from 'react'
import './style.css'
import { Download } from '../../../library'

interface PublicationProps {
  title: string
  authors: string
  conference: string
  year: number
  link: string
  additional: string
  pdf: string
}

const Publication: React.FC<PublicationProps> = ({
  title,
  authors,
  conference,
  year,
  link,
  additional,
  pdf,
}) => {
  return (
    <div className="publication-entry">
      <a href={link} target="_blank" rel="noreferrer">
        <h3>{title}</h3>
      </a>
      <p className="authors">{authors}</p>
      <p className="conference">{conference}</p>
      <p className="year">{year}</p>
      {additional && <p className="additional">{additional}</p>}
      {pdf && (
        <a href={pdf} download className="pdf-link" title="Download PDF">
          <Download />
        </a>
      )}
    </div>
  )
}

export default Publication
