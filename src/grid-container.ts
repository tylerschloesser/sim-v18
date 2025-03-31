import { Container, Graphics } from 'pixi.js'
import { Vec2 } from './vec2'

interface ConstructorArgs {
  camera: Vec2
  viewport: Vec2
  scale: number
}

export class GridContainer extends Container {
  private g: Graphics

  private __viewport: Vec2
  private __scale: number

  constructor({
    camera,
    viewport,
    scale,
  }: ConstructorArgs) {
    super()
    this.g = this.addChild(new Graphics())

    this.__viewport = viewport
    this.__scale = scale

    this.g.clear()
    const { x: xx, y: yy } = viewport
      .div(scale)
      .ceil()
      .add(1)

    for (let x = 0; x < xx; x++) {
      this.g.moveTo(x * scale, 0)
      this.g.lineTo(x * scale, yy * scale)
    }
    for (let y = 0; y < yy; y++) {
      this.g.moveTo(0, y * scale)
      this.g.lineTo(xx * scale, y * scale)
    }

    this.g.stroke({ width: 2, color: 'hsl(0, 0%, 20%)' })

    this.update(camera)
  }

  update(camera: Vec2): void {
    const viewport = this.__viewport
    const scale = this.__scale

    const { x, y } = camera
      .mul(-1 * scale)
      .add(viewport.div(2))
      .mod(scale)
      .sub(scale)

    this.position.set(x, y)
  }
}
