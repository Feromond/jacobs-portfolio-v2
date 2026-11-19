import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './global.css'

const JacobOS = lazy(() => import('./os/JacobOS'))
const isOS = /^\/os\/?$/.test(window.location.pathname)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {isOS ? (
      <Suspense fallback={null}>
        <JacobOS />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
)
