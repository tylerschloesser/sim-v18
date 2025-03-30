import { Application, Graphics } from 'pixi.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'
import './index.css'
import { Vec2 } from './vec2'

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

interface DownPointer {
  id: number
  state: 'down'
  position: Vec2
}

interface DragPointer {
  id: number
  state: 'drag'
  origin: Vec2
  position: Vec2
}

const g = app.stage.addChild(
  new Graphics({ visible: false }),
)
g.circle(0, 0, 50)
g.stroke({
  color: 'blue',
  width: 4,
})

type Pointer = DownPointer | DragPointer

let pointer: Pointer | null = null

function onPointerMove(ev: PointerEvent) {
  invariant(pointer?.id === ev.pointerId)
  if (pointer.state === 'down') {
    pointer = {
      id: pointer.id,
      state: 'drag',
      origin: pointer.position,
      position: new Vec2(ev.clientX, ev.clientY),
    }
  } else {
    invariant(pointer.state === 'drag')
    pointer.position = new Vec2(ev.clientX, ev.clientY)
  }
  g.position.set(ev.clientX, ev.clientY)
}

document.addEventListener('pointerdown', (ev) => {
  if (!pointer) {
    pointer = {
      id: ev.pointerId,
      state: 'down',
      position: new Vec2(ev.clientX, ev.clientY),
    }
  } else {
    invariant(pointer.id !== ev.pointerId)
  }

  g.visible = true
  g.position.set(ev.clientX, ev.clientY)

  const controller = new AbortController()
  const { signal } = controller

  signal.addEventListener('abort', () => {
    g.visible = false
    pointer = null
  })

  function filterPointerId(fn: (ev: PointerEvent) => void) {
    return (ev: PointerEvent) => {
      invariant(pointer)
      if (ev.pointerId === pointer.id) {
        fn(ev)
      }
    }
  }

  // prettier-ignore
  {
    document.addEventListener('pointermove', filterPointerId(onPointerMove), { signal })
    document.addEventListener('pointerup', filterPointerId(() => controller.abort()), { signal })
    document.addEventListener('pointercancel', filterPointerId(() => controller.abort()), { signal })
    document.addEventListener('pointerleave', filterPointerId(() => controller.abort()), { signal })
  }
})
