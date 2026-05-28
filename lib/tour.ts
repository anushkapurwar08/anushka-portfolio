// Shared room metadata for both the 3D dreamhouse and the 2D fallback tour.
export type RoomId = 'library' | 'kitchen' | 'studio' | 'sunroom'
export type ViewId = 'exterior' | 'hall' | RoomId | 'farewell'

export type Room = {
  id: RoomId
  name: string
  subtitle: string
  emoji: string
  accent: string // hex, drives 3D + 2D accents
}

export const ROOMS: Room[] = [
  { id: 'library', name: 'The Library', subtitle: 'quotes & a shelf I love', emoji: '📚', accent: '#D8B4F8' },
  { id: 'kitchen', name: 'The Kitchen', subtitle: 'here’s what I’ve cooked', emoji: '🍳', accent: '#F8E8EE' },
  { id: 'studio', name: 'The Studio', subtitle: 'where the work gets made', emoji: '🛠️', accent: '#C9DABF' },
  { id: 'sunroom', name: 'The Sunroom', subtitle: 'the fun stuff', emoji: '🌿', accent: '#FCD34D' },
]

export const ROOM_ORDER: ViewId[] = ['library', 'kitchen', 'studio', 'sunroom']
