import { Arrow, contactLinks, ventra } from '../../../library'
import './style.css'

export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact-inner" data-reveal>
        <h2 id="contact-title">Let&apos;s talk.</h2>
        <p className="contact-text">
          Email and LinkedIn are the easiest ways to reach me.
        </p>
        <div className="contact-actions">
          <a className="btn btn-primary" href={contactLinks.email}>
            Email me
          </a>
          <a
            className="btn btn-secondary"
            href={contactLinks.linkedin}
            target="_blank"
            rel="noopener"
          >
            LinkedIn
          </a>
        </div>
        <div className="contact-links">
          <a
            className="link"
            href={contactLinks.github}
            target="_blank"
            rel="noopener"
          >
            GitHub <Arrow aria-hidden="true" />
          </a>
          <a className="link" href={ventra.url} target="_blank" rel="noopener">
            Ventra Software <Arrow aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
