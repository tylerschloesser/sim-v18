import { Container, Graphics } from 'pixi.js'
import { Pointer } from './schema'

export class PointerContainer extends Container {
  private origin = this.addChild(
    new Graphics({ visible: false }),
  )
  private current = this.addChild(
    new Graphics({ visible: false }),
  )

  constructor() {
    super()

    this.current.circle(0, 0, 50)
    this.current.stroke({
      color: 'blue',
      width: 4,
    })

    this.origin.circle(0, 0, 50)
    this.origin.stroke({
      color: 'green',
      width: 4,
    })
  }

  public update(pointer: Pointer | null): void {
    if (pointer === null) {
      this.current.visible = this.origin.visible = false
      return
    }
    this.current.visible = true
    this.current.position.set(
      pointer.current.x,
      pointer.current.y,
    )

    if (pointer.state === 'drag') {
      this.origin.visible = true
      this.origin.position.set(
        pointer.origin.x,
        pointer.origin.y,
      )
    } else {
      this.origin.visible = false
    }
  }
}
