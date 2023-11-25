export interface Position {
  id: string
  x: number
  y: number
}

export type PositionProps = Omit<Position, 'id'>
