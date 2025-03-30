import { Vec2 } from './vec2'

export interface DownPointer {
  id: number
  state: 'down'
  position: Vec2
}

export interface DragPointer {
  id: number
  state: 'drag'
  origin: Vec2
  position: Vec2
}

export type Pointer = DownPointer | DragPointer
