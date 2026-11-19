import './style.css'

export function Footer() {
  return (
    <footer className="footer">
      <p>Copyright © {new Date().getFullYear()} Jacob Mish.</p>
      <p>
        <a
          href="https://github.com/Feromond/jacobs-portfolio-v2"
          target="_blank"
          rel="noopener"
        >
          View source
        </a>
      </p>
    </footer>
  )
}
