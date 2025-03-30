import { Application } from 'pixi.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'
import { GridContainer } from './grid-container'
import './index.css'
import { PointerContainer } from './pointer-container'
import { Pointer } from './schema'
import { Vec2 } from './vec2'

async function main() {
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

  const camera = new Vec2(0, 0)
  const viewport = new Vec2(
    window.innerWidth,
    window.innerHeight,
  )
  const scale = 50

  interface Player {
    current: Vec2
    velocity: Vec2
  }

  // @ts-expect-error
  const player: Player = {
    current: new Vec2(0, 0),
    velocity: new Vec2(0, 0),
  }

  const app = new Application()

  await app.init({
    antialias: true,
    eventMode: 'none',
    canvas,
    resizeTo: window,
  })

  // @ts-expect-error
  const gridContainer = app.stage.addChild(
    new GridContainer({ camera, viewport, scale }),
  )

  const pointerContainer = app.stage.addChild(
    new PointerContainer(),
  )

  let pointer: Pointer | null = null

  function onPointerMove(ev: PointerEvent) {
    invariant(pointer?.id === ev.pointerId)
    if (pointer.state === 'down') {
      pointer = {
        id: pointer.id,
        state: 'drag',
        origin: pointer.current,
        current: new Vec2(ev.clientX, ev.clientY),
      }
    } else {
      invariant(pointer.state === 'drag')
      pointer.current = new Vec2(ev.clientX, ev.clientY)
    }
    pointerContainer.update(pointer)
  }

  document.addEventListener('pointerdown', (ev) => {
    if (pointer) {
      invariant(pointer.id !== ev.pointerId)
      return
    }

    pointer = {
      id: ev.pointerId,
      state: 'down',
      current: new Vec2(ev.clientX, ev.clientY),
    }

    pointerContainer.update(pointer)

    const controller = new AbortController()
    const { signal } = controller

    signal.addEventListener('abort', () => {
      pointer = null
      pointerContainer.update(pointer)
    })

    function filterPointerId(
      fn: (ev: PointerEvent) => void,
    ) {
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

  let lastFrame = performance.now()
  const callback: FrameRequestCallback = () => {
    const now = performance.now()
    // @ts-expect-error
    const dt = now - lastFrame
    lastFrame = now
    self.requestAnimationFrame(callback)
  }
  self.requestAnimationFrame(callback)
}

main()
