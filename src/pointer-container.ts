import { Container, Graphics } from 'pixi.js'
import { Pointer } from './schema'

export class PointerContainer extends Container {
  private g = this.addChild(new Graphics())
  constructor() {
    super({ visible: false })

    this.g.circle(0, 0, 50)
    this.g.stroke({
      color: 'blue',
      width: 4,
    })
  }

  public update(pointer: Pointer | null): void {
    if (pointer === null) {
      this.visible = false
      return
    }
    this.visible = true
    this.g.position.set(
      pointer.position.x,
      pointer.position.y,
    )
  }
}
