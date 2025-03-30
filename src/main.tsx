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

function appendLog(message: string) {
  log.textContent = message + '\n' + log.textContent
}

let lastFrame = self.performance.now()
const callback: FrameRequestCallback = () => {
  const now = self.performance.now()
  const dt = now - lastFrame
  lastFrame = now
  if (dt > 18) {
    appendLog(`frame: ${dt.toFixed(2)}ms`)
  }
  self.requestAnimationFrame(callback)
}
self.requestAnimationFrame(callback)

// document.addEventListener(
//   'pointerdown',
//   (ev) => {
//     ev.preventDefault()
//     appendLog(`pointerdown: ${ev.clientX}, ${ev.clientY}`)
//   },
//   { passive: false },
// )

document.addEventListener(
  'touchstart',
  (ev) => {
    ev.preventDefault()
    if (ev.touches.length !== 1) {
      return
    }
    const touch = ev.touches[0]
    invariant(touch)
    appendLog(
      `touchstart: ${touch.clientX}, ${touch.clientY}`,
    )
  },
  { passive: false },
)
