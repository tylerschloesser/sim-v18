import invariant from 'tiny-invariant'
import { z } from 'zod'

export class Vec2 {
  readonly x: number
  readonly y: number
  constructor(v: number)
  constructor(x: number, y: number)
  constructor(x: ZVec2)
  constructor(x: number | ZVec2, y?: number) {
    if (typeof x === 'number') {
      if (y === undefined) {
        this.x = x
        this.y = x
      } else {
        this.x = x
        this.y = y
      }
    } else {
      this.x = x.x
      this.y = x.y
    }
  }
  add(v: Vec2 | ZVec2 | number): Vec2 {
    if (typeof v === 'number') {
      v = new Vec2(v, v)
    }
    return new Vec2(this.x + v.x, this.y + v.y)
  }
  sub(v: Vec2 | ZVec2 | number): Vec2 {
    if (typeof v === 'number') {
      v = new Vec2(v, v)
    }
    return new Vec2(this.x - v.x, this.y - v.y)
  }
  mul(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s)
  }
  div(s: number): Vec2 {
    invariant(s !== 0)
    return new Vec2(this.x / s, this.y / s)
  }
  floor(): Vec2 {
    return new Vec2(Math.floor(this.x), Math.floor(this.y))
  }
  ceil(): Vec2 {
    return new Vec2(Math.ceil(this.x), Math.ceil(this.y))
  }
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  normalize(): Vec2 {
    const len = this.length()
    invariant(len !== 0)
    return this.div(len)
  }
  mod(m: number): Vec2 {
    return new Vec2(mod(this.x, m), mod(this.y, m))
  }
  angle(): number {
    return Math.atan2(this.y, this.x)
  }
  static fromAngle(angle: number): Vec2 {
    return new Vec2(Math.cos(angle), Math.sin(angle))
  }
  equals(v: Vec2 | ZVec2): boolean {
    if (this === v) {
      return true
    }
    return this.x === v.x && this.y === v.y
  }
  rotate(angle: number): Vec2 {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return new Vec2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
    )
  }
  isZero(): boolean {
    return this.x === 0 && this.y === 0
  }
  isNonZero(): boolean {
    return this.x !== 0 || this.y !== 0
  }

  dot(v: Vec2 | ZVec2): number {
    return this.x * v.x + this.y * v.y
  }
  map(fn: (v: Vec2) => Vec2): Vec2 {
    return fn(this)
  }

  static ZERO = new Vec2(0, 0)

  static isEqual(a: Vec2, b: Vec2): boolean {
    return a.x === b.x && a.y === b.y
  }
}

export const ZVec2 = z.strictObject({
  x: z.number(),
  y: z.number(),
})
export type ZVec2 = z.infer<typeof ZVec2>

// https://stackoverflow.com/a/4467559
export function mod(n: number, m: number) {
  return ((n % m) + m) % m
}
