import React from 'react'
import './style.css'
import ASCIIText from './footer_fancy'

export function Footer() {
  return (
    <footer
      className="footer"
      style={{
        position: 'relative',
        height: '80px',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <ASCIIText
        text="&#169; 2025Jacob Mish"
        enableWaves={false}
        asciiFontSize={3}
      />
    </footer>
  )
}
