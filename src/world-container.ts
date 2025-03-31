import { Container, Graphics } from 'pixi.js'
import { Vec2 } from './vec2'

interface ConstructorArgs {
  camera: Vec2
  viewport: Vec2
  scale: number
}

const LINES = [
  { y: 0, color: 'yellow' },
  { y: 10, color: 'green' },
]

export class WorldContainer extends Container {
  private __scale: number
  constructor({
    camera,
    viewport,
    scale,
  }: ConstructorArgs) {
    super()
    this.__scale = scale

    for (const { y, color } of LINES) {
      const g = this.addChild(new Graphics())
      g.moveTo(0, viewport.y / 2 + -y * scale)
      g.lineTo(viewport.x, viewport.y / 2 + -y * scale)
      g.stroke({ width: 2, color })
    }

    this.update(camera)
  }

  update(camera: Vec2): void {
    const scale = this.__scale
    this.position.set(0, -camera.y * scale)
  }
}
