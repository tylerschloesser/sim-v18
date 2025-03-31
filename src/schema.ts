import { Vec2 } from './vec2'

export interface DownPointer {
  id: number
  state: 'down'
  current: Vec2
}

export interface DragPointer {
  id: number
  state: 'drag'
  origin: Vec2
  current: Vec2
}

export type Pointer = DownPointer | DragPointer

export interface Line {
  id: string
  a: Vec2
  b: Vec2
}
