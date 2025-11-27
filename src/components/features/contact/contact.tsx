import React from 'react'
import { Headings } from '../../core/headings/headings'
import './style.css'

const Contact = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="contact">
      <Headings title="Contact" subtitle="How to reach me" />
      <div className="contact-text">
        The fastest way to get in touch with me is to send me a message on{''}
        <a
          href="https://www.linkedin.com/in/jacob-mish/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>{' '}
        or an{''}
        <a href="mailto:jacobpmish@gmail.com" target="_blank" rel="noreferrer">
          Email
        </a>
        . Whether you have a question or just want to say &quot;Hi,&quot;
        I&apos;ll try my best to get back to you.
      </div>
    </div>
  )
})

Contact.displayName = 'Contact'

export { Contact }
