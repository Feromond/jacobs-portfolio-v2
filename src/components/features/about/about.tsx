import { Headings } from '../../core/headings/headings'
import { contactLinks, skillGroups, ventra } from '../../../library'
import './style.css'

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <Headings title="About" lede="Hi, I'm Jacob." id="about-title" />

      <div className="about-copy" data-reveal>
        <p>
          I&apos;m a software engineer with a background in geophysics.{' '}
          <strong>
            That training taught me to stay curious and work through complex
            problems with care.
          </strong>
        </p>
        <p>
          I work across the stack, leaning toward backend systems and large
          projects that need careful structure and design.{' '}
          <strong>
            I&apos;ve built data pipelines, ML models, internal tools, and
            native apps,
          </strong>{' '}
          and I enjoy the places where those worlds meet.
        </p>
        <p>
          Outside of work I run{' '}
          <a href={ventra.url} target="_blank" rel="noopener">
            Ventra Software
          </a>
          , where I build my own desktop and mobile apps, terminal tools, and
          the occasional library, mostly in Rust.
        </p>
        <p>
          I care about collaboration, continuous learning, and software that
          feels thoughtful. Say hi on{' '}
          <a href={contactLinks.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
          .
        </p>
      </div>

      <div className="toolkit" data-reveal>
        <h3>Toolkit</h3>
        <div className="toolkit-grid">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="toolkit-label">{group.label}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
