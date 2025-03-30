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

const g = app.stage.addChild(new Graphics())
g.rect(0, 0, 100, 100)
g.fill('blue')
