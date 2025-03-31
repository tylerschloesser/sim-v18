import { Line } from './schema'
import { Vec2 } from './vec2'

// Helper function to calculate orientation
function orientation(p: Vec2, q: Vec2, r: Vec2): number {
  const val =
    (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
  if (val === 0) return 0 // colinear
  return val > 0 ? 1 : 2 // clock or counterclockwise
}

// Helper function to check if Vec2 q lies on segment pr
function onSegment(p: Vec2, q: Vec2, r: Vec2): boolean {
  return (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  )
}

export function doIntersect(a: Line, b: Line): boolean {
  const p1 = a.a
  const q1 = a.b
  const p2 = b.a
  const q2 = b.b
  const o1 = orientation(p1, q1, p2)
  const o2 = orientation(p1, q1, q2)
  const o3 = orientation(p2, q2, p1)
  const o4 = orientation(p2, q2, q1)

  // General case
  if (o1 !== o2 && o3 !== o4) return true

  // Special Cases
  if (o1 === 0 && onSegment(p1, p2, q1)) return true
  if (o2 === 0 && onSegment(p1, q2, q1)) return true
  if (o3 === 0 && onSegment(p2, p1, q2)) return true
  if (o4 === 0 && onSegment(p2, q1, q2)) return true

  return false
}

export function doIntersectBbox(a: Line, b: Line): boolean {
  return (
    Math.min(a.a.x, a.b.x) < Math.max(b.a.x, b.b.x) &&
    Math.max(a.a.x, a.b.x) > Math.min(b.a.x, b.b.x) &&
    Math.min(a.a.y, a.b.y) < Math.max(b.a.y, b.b.y) &&
    Math.max(a.a.y, a.b.y) > Math.min(b.a.y, b.b.y)
  )
}
