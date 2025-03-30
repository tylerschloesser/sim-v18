import { Application, Graphics } from 'pixi.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'
import './index.css'

const container = document.getElementById('root')
invariant(container)

createRoot(container).render(
  <StrictMode>
    <></>
  </StrictMode>,
)

// prevent swipe forward/backward on iOS
document.addEventListener(
  'touchstart',
  (ev) => {
    ev.preventDefault()
  },
  { passive: false },
)

const canvas = document.querySelector('canvas')
invariant(canvas)

const app = new Application()

app.init({
  antialias: true,
  eventMode: 'none',
  canvas,
  resizeTo: window,
})

const pointerIdToGraphics = new Map<number, Graphics>()

function onPointerMove(ev: PointerEvent) {
  const g = pointerIdToGraphics.get(ev.pointerId)
  invariant(g)
  g.position.set(ev.clientX, ev.clientY)
}

document.addEventListener('pointerdown', (ev) => {
  const g = app.stage.addChild(
    new Graphics({
      position: { x: ev.clientX, y: ev.clientY },
    }),
  )
  g.circle(0, 0, 10)
  g.fill('blue')

  invariant(!pointerIdToGraphics.has(ev.pointerId))
  pointerIdToGraphics.set(ev.pointerId, g)

  const controller = new AbortController()
  const { signal } = controller

  signal.addEventListener('abort', () => {
    invariant(pointerIdToGraphics.has(ev.pointerId))
    pointerIdToGraphics.delete(ev.pointerId)
    g.destroy()
  })

  // prettier-ignore
  {
    document.addEventListener('pointermove', onPointerMove, { signal })
    document.addEventListener('pointerup', () => controller.abort(), { signal })
    document.addEventListener('pointercancel', () => controller.abort(), { signal })
    document.addEventListener('pointerleave', () => controller.abort(), { signal })
  }
})
