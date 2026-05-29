// Shared room metadata for both the 3D dreamhouse and the 2D fallback tour.
// Library was dropped — quotes now live only on the entry scroll.
export type RoomId = 'kitchen' | 'studio' | 'sunroom'
export type ViewId = 'exterior' | 'hall' | RoomId | 'farewell'

export type Room = {
  id: RoomId
  name: string
  subtitle: string
  emoji: string
  accent: string // hex, drives 3D + 2D accents
}

export const ROOMS: Room[] = [
  { id: 'studio', name: 'The Studio', subtitle: 'where the work gets made', emoji: '🖋️', accent: '#8B5CC0' },
  { id: 'kitchen', name: 'The Kitchen', subtitle: 'what I’ve cooked', emoji: '🍳', accent: '#C9A86A' },
  { id: 'sunroom', name: 'The Sunroom', subtitle: 'off the clock', emoji: '🌿', accent: '#C9DABF' },
]

export const ROOM_ORDER: ViewId[] = ['studio', 'kitchen', 'sunroom']
