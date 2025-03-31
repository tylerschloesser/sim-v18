import { Container, Graphics } from 'pixi.js'
import { Vec2 } from './vec2'

interface ConstructorArgs {
  viewport: Vec2
  scale: number
}

export class PlayerContainer extends Container {
  constructor({ viewport, scale }: ConstructorArgs) {
    super()

    const g = this.addChild(
      new Graphics({
        position: viewport.div(2),
      }),
    )
    g.circle(0, 0, scale * 0.2)
    g.fill('blue')
    g.stroke({ color: 'gray', width: 2 })
  }
}
