import { Application, Container, Graphics } from 'pixi.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'
import {
  ASCENDING_GRAVITY_SCALE,
  DESCENDING_GRAVITY_SCALE,
  DRAG_VELOCITY_SCALE,
} from './const'
import { GridContainer } from './grid-container'
import './index.css'
import { PlayerContainer } from './player-container'
import { PointerContainer } from './pointer-container'
import { Body, Pointer } from './schema'
import { Vec2 } from './vec2'
import { WorldContainer } from './world-container'

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

  let camera = new Vec2(0, 0)
  const viewport = new Vec2(
    window.innerWidth,
    window.innerHeight,
  )
  const scale = 50

  interface Player {
    current: Vec2
    velocity: Vec2
  }

  const player: Player = {
    current: Vec2.ZERO,
    velocity: Vec2.ZERO,
  }

  const app = new Application()

  const bodies: Body[] = [
    { current: new Vec2(0, -10), radius: 4 },
  ]

  await app.init({
    antialias: true,
    eventMode: 'none',
    canvas,
    resizeTo: window,
    resolution: window.devicePixelRatio,
    autoDensity: true,
  })

  const gridContainer = app.stage.addChild(
    new GridContainer({ camera, viewport, scale }),
  )

  const worldContainer = app.stage.addChild(
    new WorldContainer({ camera, viewport, scale }),
  )

  const bodyContainer = app.stage.addChild(new Container())
  for (const body of bodies) {
    const g = bodyContainer.addChild(new Graphics())
    g.circle(
      body.current.x * scale,
      body.current.y * scale,
      body.radius * scale,
    )
    g.fill('red')
  }
  function updateBodyContainer() {
    const { x, y } = camera.mul(-scale).add(viewport.div(2))
    bodyContainer.position.set(x, y)
  }
  updateBodyContainer()

  const pointerContainer = app.stage.addChild(
    new PointerContainer(),
  )

  // @ts-expect-error
  const playerContainer = app.stage.addChild(
    new PlayerContainer({ viewport, scale }),
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
      if (pointer?.state === 'drag') {
        const d = pointer.current
          .sub(pointer.origin)
          .map((v) => new Vec2(v.x * 0.1, v.y))
        player.velocity = player.velocity.add(
          d.div(scale).mul(-1).mul(DRAG_VELOCITY_SCALE),
        )
      }
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

    // add pointer listeners
    {
      document.addEventListener(
        'pointermove',
        filterPointerId(onPointerMove),
        { signal },
      )
      document.addEventListener(
        'pointerup',
        filterPointerId(() => controller.abort()),
        { signal },
      )
      document.addEventListener(
        'pointercancel',
        filterPointerId(() => controller.abort()),
        { signal },
      )
      document.addEventListener(
        'pointerleave',
        filterPointerId(() => controller.abort()),
        { signal },
      )
    }
  })

  let lastFrame = performance.now()
  const callback: FrameRequestCallback = () => {
    const now = performance.now()
    const dt = Math.min(now - lastFrame, (1 / 30) * 1000)
    lastFrame = now

    let timeScale = 1

    let acceleration = Vec2.ZERO
    if (player.current.y < 0) {
      const scale =
        player.velocity.y < 0
          ? ASCENDING_GRAVITY_SCALE
          : DESCENDING_GRAVITY_SCALE
      acceleration = new Vec2(0, 1).mul(scale)
    } else if (player.current.y > 0) {
      const scale =
        player.velocity.y < 0
          ? DESCENDING_GRAVITY_SCALE
          : ASCENDING_GRAVITY_SCALE
      acceleration = new Vec2(0, -1).mul(scale)
    }

    if (pointer?.state === 'drag') {
      const d = pointer.current
        .sub(pointer.origin)
        .div(scale)
      timeScale = Math.min(1 / Math.pow(d.length(), 0.8), 1)
    }

    if (acceleration.isNonZero()) {
      player.velocity = player.velocity.add(
        acceleration.mul((dt * timeScale) / 1000),
      )
    }

    if (player.velocity.isNonZero()) {
      player.current = player.current.add(
        player.velocity.mul((dt * timeScale) / 1000),
      )
      camera = player.current
      gridContainer.update(camera)
      worldContainer.update(camera)
      updateBodyContainer()
    }

    self.requestAnimationFrame(callback)
  }
  self.requestAnimationFrame(callback)
}

main()
