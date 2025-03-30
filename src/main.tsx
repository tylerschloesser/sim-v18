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

const log = document.createElement('pre')
document.body.appendChild(log)

let lastFrame = self.performance.now()
const callback: FrameRequestCallback = () => {
  const now = self.performance.now()
  const dt = now - lastFrame
  lastFrame = now
  if (dt > 18) {
    log.textContent += `frame: ${dt.toFixed(2)}ms\n`
  }
  self.requestAnimationFrame(callback)
}
self.requestAnimationFrame(callback)

document.addEventListener(
  'pointerdown',
  (ev) => {
    ev.preventDefault()
    log.textContent += `pointerdown: ${ev.clientX}, ${ev.clientY}\n`
  },
  { passive: false },
)
