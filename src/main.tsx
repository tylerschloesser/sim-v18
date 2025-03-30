import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'
import './index.css'

const container = document.getElementById('root')
invariant(container)

createRoot(container).render(
  <StrictMode>
    <>TODO</>
  </StrictMode>,
)
