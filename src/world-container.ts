import { Container, Graphics } from 'pixi.js'
import { Vec2 } from './vec2'

interface ConstructorArgs {
  camera: Vec2
  viewport: Vec2
  scale: number
}

export class WorldContainer extends Container {
  private __scale: number
  constructor({
    camera,
    viewport,
    scale,
  }: ConstructorArgs) {
    super()
    this.__scale = scale

    const g = this.addChild(new Graphics())

    g.moveTo(0, viewport.y / 2)
    g.lineTo(viewport.x, viewport.y / 2)

    g.stroke({ width: 2, color: 'yellow' })

    this.update(camera)
  }

  update(camera: Vec2): void {
    const scale = this.__scale
    this.position.set(0, -camera.y * scale)
  }
}
