'use client'
import { useRef } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { RoomId, ViewId } from '@/lib/tour'

// ── Soft-luxe palette - light, cohesive, pastel colour-blocking ─────────
const C = {
  // per-room accent walls (all same softness so they read as a set)
  wallBlush: '#FBEDF0',  // kitchen
  wallSage: '#ECF2EB',   // sunroom
  wallLilac: '#F1EAFA',  // studio + upper niches
  wallHall: '#F5EFE9',   // hall (warm ivory)
  marble: '#FCFAF6',     // bright polished surfaces / floor
  trimWhite: '#FFFFFF',
  gold: '#C9A86A',       // brass
  ink: '#3A3340',        // soft charcoal-plum
  // signature colours
  lilac: '#D8B4F8',
  lilacDeep: '#8B5CC0',
  blush: '#F4B8C8',
  rose: '#E07AA0',       // deeper pink - used where something must pop
  sage: '#9DBE93',
  mustard: '#E7C46A',
  sky: '#BFD7EA',
  glow: '#FFE9C2',
  // exterior - matches the homepage dollhouse
  roof: '#D8B4F8',
  roofDark: '#B893E8',
  cream: '#FFF8F0',
  houseWall: '#FFFDF9',  // bright warm white facade (chosen direction)
  windowGlass: '#F8E8EE',
  ground: '#EFE4F4',     // soft lilac pad
  // landscaping
  grass: '#CDE7B2',
  grassDark: '#B7DC9C',
  stone: '#EFEAE2',
  stoneEdge: '#E1D9CB',
  trunk: '#C8A27C',
  foliage: '#A9D08A',
  foliageDeep: '#8FBF74',
  blossom: '#F6C4D3',
}

// Camera waypoints per view: [position, lookAt]
export const CAMERA: Record<ViewId, { pos: [number, number, number]; tgt: [number, number, number] }> = {
  exterior: { pos: [0, 3.2, 17], tgt: [0, 3.0, 0] },
  hall: { pos: [0, 1.5, 7.4], tgt: [0, 1.4, -0.6] },
  kitchen: { pos: [-3, 1.5, 6.0], tgt: [-3, 1.4, -1] },
  sunroom: { pos: [3, 1.5, 6.0], tgt: [3, 1.4, -1] },
  studio: { pos: [0, 4.7, 6.0], tgt: [0, 4.6, -1] },
  farewell: { pos: [0, 3.2, 15], tgt: [0, 3.0, 0] },
}

// Bay x-centers
const X = { left: -3, mid: 0, right: 3 }
const GROUND_Y = 0
const UPPER_Y = 3.2
const BACK_Z = -1.8
const FRONT_Z = 1.85
const BAY_W = 2.7
const FLOOR_H = 3.0

function cursor(on: boolean) {
  if (typeof document !== 'undefined') document.body.style.cursor = on ? 'pointer' : 'auto'
}

// Brass material helper
function Gold(props: any) {
  return <meshStandardMaterial color={C.gold} metalness={0.85} roughness={0.35} {...props} />
}

// ── Reusable small props ────────────────────────────────────────────────
function Jar({ position, color, h = 0.2, r = 0.06 }: { position: [number, number, number]; color: string; h?: number; r?: number }) {
  return (
    <group position={position}>
      <mesh castShadow><cylinderGeometry args={[r, r, h, 20]} /><meshStandardMaterial color={color} roughness={0.4} /></mesh>
      <mesh position={[0, h / 2 + 0.02, 0]}><cylinderGeometry args={[r * 0.62, r * 0.62, 0.04, 16]} /><Gold /></mesh>
    </group>
  )
}

function Books({ position, rotation = [0, 0, 0], colors, w = 0.06, h = 0.26, d = 0.2 }: { position: [number, number, number]; rotation?: [number, number, number]; colors: string[]; w?: number; h?: number; d?: number }) {
  return (
    <group position={position} rotation={rotation as any}>
      {colors.map((c, i) => (
        <mesh key={i} position={[(i - (colors.length - 1) / 2) * (w + 0.012), 0, 0]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={c} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Vase({ position, branch = true, color }: { position: [number, number, number]; branch?: boolean; color?: string }) {
  return (
    <group position={position}>
      <mesh castShadow><cylinderGeometry args={[0.08, 0.12, 0.42, 20]} /><meshStandardMaterial color={color ?? C.trimWhite} roughness={0.4} /></mesh>
      {branch && (
        <>
          <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.006, 0.01, 0.6, 6]} /><meshStandardMaterial color={C.sage} /></mesh>
          <mesh position={[0.1, 0.66, 0]}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color={C.blush} /></mesh>
          <mesh position={[-0.05, 0.54, 0.04]}><sphereGeometry args={[0.05, 12, 12]} /><meshStandardMaterial color={C.lilac} /></mesh>
          <mesh position={[0.04, 0.6, -0.04]}><sphereGeometry args={[0.045, 12, 12]} /><meshStandardMaterial color={C.rose} /></mesh>
        </>
      )}
    </group>
  )
}

function FloorPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow><cylinderGeometry args={[0.2, 0.16, 0.45, 20]} /><meshStandardMaterial color={C.trimWhite} roughness={0.5} /></mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.2, 0.2, 0.06, 20]} /><Gold /></mesh>
      <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.34, 18, 18]} /><meshStandardMaterial color={C.sage} roughness={0.9} /></mesh>
      <mesh position={[0.18, 0.7, 0.05]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color={C.sage} roughness={0.9} /></mesh>
      <mesh position={[-0.16, 0.66, -0.04]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color={C.sage} roughness={0.9} /></mesh>
    </group>
  )
}

// Framed wall art - colour is configurable so the rooms feel curated
function FramedArt({ position, color = C.lilac, w = 0.72, h = 0.92 }: { position: [number, number, number]; color?: string; w?: number; h?: number }) {
  return (
    <group position={position}>
      <mesh><boxGeometry args={[w, h, 0.04]} /><Gold /></mesh>
      <mesh position={[0, 0, 0.03]}><boxGeometry args={[w - 0.12, h - 0.12, 0.02]} /><meshStandardMaterial color={color} roughness={0.6} /></mesh>
      <mesh position={[0, -0.04, 0.045]}><boxGeometry args={[(w - 0.12) * 0.6, (h - 0.12) * 0.45, 0.01]} /><meshStandardMaterial color={C.trimWhite} /></mesh>
    </group>
  )
}

// Pendant light (cord + brass shade + warm glow)
function Pendant({ position, swing = false }: { position: [number, number, number]; swing?: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((s) => { if (swing && ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.8) * 0.04 })
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.008, 0.008, 0.7, 8]} /><meshStandardMaterial color={C.ink} /></mesh>
      <mesh position={[0, -0.72, 0]}><coneGeometry args={[0.18, 0.24, 24, 1, true]} /><meshStandardMaterial color={C.gold} metalness={0.85} roughness={0.35} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.78, 0]}><sphereGeometry args={[0.07, 16, 16]} /><meshStandardMaterial color={C.glow} emissive={C.glow} emissiveIntensity={1.1} /></mesh>
      <pointLight position={[0, -0.8, 0]} intensity={0.35} distance={4} color={C.glow} />
    </group>
  )
}

// A single room shell: bright floor, pastel back wall, ceiling-less, gold trim
function Shell({ x, y, wall }: { x: number; y: number; wall: string }) {
  return (
    <group>
      {/* floor */}
      <mesh position={[x, y + 0.05, 0]} receiveShadow>
        <boxGeometry args={[BAY_W, 0.1, 3.4]} />
        <meshStandardMaterial color={C.marble} metalness={0.05} roughness={0.5} />
      </mesh>
      {/* back wall (room accent colour) */}
      <mesh position={[x, y + FLOOR_H / 2, BACK_Z]} receiveShadow>
        <boxGeometry args={[BAY_W, FLOOR_H, 0.12]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {/* gold baseboard */}
      <mesh position={[x, y + 0.18, BACK_Z + 0.07]}>
        <boxGeometry args={[BAY_W, 0.08, 0.04]} />
        <Gold />
      </mesh>
      {/* gold cornice */}
      <mesh position={[x, y + FLOOR_H - 0.08, BACK_Z + 0.07]}>
        <boxGeometry args={[BAY_W, 0.05, 0.04]} />
        <Gold />
      </mesh>
      {/* dividers */}
      <mesh position={[x - BAY_W / 2, y + FLOOR_H / 2, 0]}>
        <boxGeometry args={[0.1, FLOOR_H, 3.4]} />
        <meshStandardMaterial color={C.trimWhite} roughness={0.9} />
      </mesh>
      <mesh position={[x + BAY_W / 2, y + FLOOR_H / 2, 0]}>
        <boxGeometry args={[0.1, FLOOR_H, 3.4]} />
        <meshStandardMaterial color={C.trimWhite} roughness={0.9} />
      </mesh>
    </group>
  )
}

function RoomLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <Text position={[x, y + 2.66, BACK_Z + 0.1]} fontSize={0.22} color={C.lilacDeep} anchorX="center" anchorY="middle" maxWidth={BAY_W - 0.2} textAlign="center" letterSpacing={0.14}>
      {text}
    </Text>
  )
}

// Clickable invisible hit-zone covering a room
function RoomHit({ x, y, onClick, active }: { x: number; y: number; onClick: () => void; active: boolean }) {
  return (
    <mesh
      position={[x, y + FLOOR_H / 2, 0.4]}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onClick() }}
      onPointerOver={(e) => { e.stopPropagation(); cursor(true) }}
      onPointerOut={() => cursor(false)}
    >
      <boxGeometry args={[BAY_W - 0.2, FLOOR_H - 0.2, 2.8]} />
      <meshStandardMaterial transparent opacity={active ? 0.0 : 0.02} color={C.lilac} depthWrite={false} />
    </mesh>
  )
}

// ── Rooms ─────────────────────────────────────────────────────────────
function KitchenRoom({ x, y }: { x: number; y: number }) {
  const steam = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (steam.current) {
      steam.current.children.forEach((c, i) => {
        const t = (s.clock.elapsedTime * 0.5 + i * 0.4) % 1
        c.position.y = 0.2 + t * 0.6
        ;(c as THREE.Mesh).scale.setScalar(0.1 * (1 - t) + 0.03)
        const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial
        m.opacity = 0.4 * (1 - t)
      })
    }
  })
  return (
    <group position={[x, y, BACK_Z + 0.6]}>
      {/* island base */}
      <RoundedBox args={[2.1, 0.85, 0.6]} radius={0.04} position={[0, 0.43, 0]} castShadow>
        <meshStandardMaterial color={C.trimWhite} roughness={0.7} />
      </RoundedBox>
      {/* sage lower-cabinet panel for a pop */}
      <mesh position={[0, 0.43, 0.31]}><boxGeometry args={[2.06, 0.78, 0.02]} /><meshStandardMaterial color={C.wallSage} roughness={0.8} /></mesh>
      {/* marble countertop */}
      <RoundedBox args={[2.2, 0.08, 0.66]} radius={0.02} position={[0, 0.89, 0]}>
        <meshStandardMaterial color={C.marble} metalness={0.12} roughness={0.3} />
      </RoundedBox>
      {/* gold toe-kick */}
      <mesh position={[0, 0.06, 0.28]}><boxGeometry args={[2.0, 0.05, 0.04]} /><Gold /></mesh>

      {/* tiled backsplash strip */}
      <mesh position={[0, 1.9, -0.2]}><boxGeometry args={[2.0, 0.5, 0.02]} /><meshStandardMaterial color={C.blush} roughness={0.6} /></mesh>

      {/* open brass shelf with colourful jars + books */}
      <mesh position={[0.55, 1.55, -0.18]}><boxGeometry args={[1.0, 0.04, 0.22]} /><Gold /></mesh>
      <Jar position={[0.25, 1.67, -0.18]} color={C.lilac} h={0.2} />
      <Jar position={[0.45, 1.65, -0.18]} color={C.mustard} h={0.16} r={0.055} />
      <Jar position={[0.66, 1.69, -0.18]} color={C.sage} h={0.22} r={0.058} />
      <Books position={[0.92, 1.63, -0.18]} colors={[C.rose, C.lilacDeep, C.mustard]} h={0.18} d={0.18} rotation={[0, 0, 0.06]} />

      {/* utensil crock with utensils */}
      <mesh position={[-0.78, 1.0, 0.0]}><cylinderGeometry args={[0.1, 0.09, 0.22, 20]} /><meshStandardMaterial color={C.lilacDeep} roughness={0.5} /></mesh>
      <mesh position={[-0.8, 1.18, 0]} rotation={[0, 0, 0.18]}><cylinderGeometry args={[0.008, 0.008, 0.34, 6]} /><Gold /></mesh>
      <mesh position={[-0.74, 1.18, 0.02]} rotation={[0, 0, -0.14]}><cylinderGeometry args={[0.008, 0.008, 0.34, 6]} /><Gold /></mesh>
      <mesh position={[-0.83, 1.16, -0.02]} rotation={[0, 0, 0.05]}><cylinderGeometry args={[0.01, 0.01, 0.3, 6]} /><meshStandardMaterial color={C.ink} /></mesh>

      {/* brass kettle */}
      <mesh position={[-0.35, 1.02, 0.05]} castShadow><sphereGeometry args={[0.13, 20, 20]} /><Gold /></mesh>
      <mesh position={[-0.35, 1.16, 0.05]}><cylinderGeometry args={[0.04, 0.05, 0.06, 16]} /><Gold /></mesh>
      <mesh position={[-0.22, 1.08, 0.05]} rotation={[0, 0, -0.7]}><cylinderGeometry args={[0.012, 0.02, 0.12, 12]} /><Gold /></mesh>

      {/* cutting board + little chopped colour */}
      <mesh position={[0.0, 0.95, 0.16]} rotation={[-Math.PI / 2, 0, 0.2]}><boxGeometry args={[0.34, 0.24, 0.03]} /><meshStandardMaterial color={'#E4C9A0'} roughness={0.8} /></mesh>
      <mesh position={[-0.02, 0.98, 0.16]}><sphereGeometry args={[0.03, 10, 10]} /><meshStandardMaterial color={C.rose} /></mesh>
      <mesh position={[0.05, 0.98, 0.2]}><sphereGeometry args={[0.03, 10, 10]} /><meshStandardMaterial color={C.sage} /></mesh>

      {/* fruit bowl */}
      <mesh position={[0.62, 0.96, 0.0]}><cylinderGeometry args={[0.16, 0.12, 0.1, 20]} /><Gold /></mesh>
      <mesh position={[0.62, 1.04, 0]}><sphereGeometry args={[0.06, 14, 14]} /><meshStandardMaterial color={C.lilacDeep} /></mesh>
      <mesh position={[0.52, 1.03, 0.04]}><sphereGeometry args={[0.05, 14, 14]} /><meshStandardMaterial color={C.sage} /></mesh>
      <mesh position={[0.7, 1.03, -0.03]}><sphereGeometry args={[0.05, 14, 14]} /><meshStandardMaterial color={C.mustard} /></mesh>

      {/* pot + steam */}
      <mesh position={[-0.5, 0.99, -0.1]}><cylinderGeometry args={[0.16, 0.14, 0.16, 20]} /><meshStandardMaterial color={C.ink} metalness={0.5} roughness={0.4} /></mesh>
      <group ref={steam} position={[-0.5, 1.06, -0.1]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}><sphereGeometry args={[0.1, 10, 10]} /><meshStandardMaterial color={'#ffffff'} transparent opacity={0.35} /></mesh>
        ))}
      </group>

      {/* potted herb */}
      <mesh position={[0.95, 0.99, 0.12]}><cylinderGeometry args={[0.07, 0.06, 0.12, 16]} /><meshStandardMaterial color={C.rose} roughness={0.6} /></mesh>
      <mesh position={[0.95, 1.12, 0.12]}><sphereGeometry args={[0.11, 14, 14]} /><meshStandardMaterial color={C.sage} roughness={0.9} /></mesh>

      {/* pendants above island */}
      <Pendant position={[-0.5, FLOOR_H - 0.2, 0]} />
      <Pendant position={[0.5, FLOOR_H - 0.2, 0]} />
    </group>
  )
}

function SunroomRoom({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, y, BACK_Z + 0.5]}>
      {/* warm window - lowered & smaller so the SUNROOM label sits clearly above it */}
      <mesh position={[0, 1.18, -0.05]}><boxGeometry args={[1.5, 1.5, 0.02]} /><meshStandardMaterial color={C.glow} emissive={C.glow} emissiveIntensity={0.55} /></mesh>
      {/* frame */}
      <mesh position={[0, 1.93, 0.0]}><boxGeometry args={[1.56, 0.04, 0.03]} /><Gold /></mesh>
      <mesh position={[0, 0.43, 0.0]}><boxGeometry args={[1.56, 0.04, 0.03]} /><Gold /></mesh>
      <mesh position={[-0.76, 1.18, 0.0]}><boxGeometry args={[0.04, 1.54, 0.03]} /><Gold /></mesh>
      <mesh position={[0.76, 1.18, 0.0]}><boxGeometry args={[0.04, 1.54, 0.03]} /><Gold /></mesh>
      {/* cross mullions */}
      <mesh position={[0, 1.18, 0.01]}><boxGeometry args={[1.5, 0.03, 0.02]} /><Gold /></mesh>
      <mesh position={[0, 1.18, 0.01]}><boxGeometry args={[0.03, 1.5, 0.02]} /><Gold /></mesh>

      {/* lounge chair */}
      <RoundedBox args={[0.9, 0.4, 0.8]} radius={0.1} position={[-0.4, 0.32, 0.5]} castShadow>
        <meshStandardMaterial color={C.trimWhite} roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.9, 0.7, 0.16]} radius={0.1} position={[-0.4, 0.62, 0.14]}>
        <meshStandardMaterial color={C.trimWhite} roughness={0.95} />
      </RoundedBox>
      {/* colourful cushions */}
      <RoundedBox args={[0.34, 0.34, 0.12]} radius={0.06} position={[-0.58, 0.62, 0.45]}><meshStandardMaterial color={C.blush} roughness={0.9} /></RoundedBox>
      <RoundedBox args={[0.3, 0.3, 0.12]} radius={0.06} position={[-0.18, 0.6, 0.45]}><meshStandardMaterial color={C.lilac} roughness={0.9} /></RoundedBox>
      {/* gold legs */}
      <mesh position={[-0.75, 0.1, 0.8]}><cylinderGeometry args={[0.02, 0.02, 0.22, 8]} /><Gold /></mesh>
      <mesh position={[-0.05, 0.1, 0.8]}><cylinderGeometry args={[0.02, 0.02, 0.22, 8]} /><Gold /></mesh>

      {/* round rug under the lounge */}
      <mesh position={[-0.3, 0.115, 0.55]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.75, 40]} /><meshStandardMaterial color={C.wallLilac} roughness={1} /></mesh>

      {/* side table + stacked books + tea */}
      <mesh position={[0.5, 0.45, 0.5]}><cylinderGeometry args={[0.22, 0.22, 0.04, 24]} /><meshStandardMaterial color={C.marble} metalness={0.12} roughness={0.3} /></mesh>
      <mesh position={[0.5, 0.22, 0.5]}><cylinderGeometry args={[0.02, 0.02, 0.45, 8]} /><Gold /></mesh>
      <Books position={[0.5, 0.53, 0.5]} colors={[C.rose, C.sage]} rotation={[Math.PI / 2, 0, 0.3]} w={0.5} h={0.07} d={0.36} />
      <mesh position={[0.55, 0.62, 0.5]}><cylinderGeometry args={[0.05, 0.04, 0.06, 16]} /><meshStandardMaterial color={C.lilacDeep} /></mesh>

      {/* plants */}
      <FloorPlant position={[0.72, 0.05, -0.1]} />
      <mesh position={[-0.05, 0.55, 0.85]}><cylinderGeometry args={[0.06, 0.05, 0.12, 16]} /><meshStandardMaterial color={C.mustard} /></mesh>
      <mesh position={[-0.05, 0.68, 0.85]}><sphereGeometry args={[0.1, 14, 14]} /><meshStandardMaterial color={C.sage} roughness={0.9} /></mesh>
    </group>
  )
}

function StudioRoom({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, y, BACK_Z + 0.6]}>
      {/* rug under the workspace */}
      <mesh position={[0, 0.115, 0.45]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.9, 1.4]} /><meshStandardMaterial color={C.wallBlush} roughness={1} /></mesh>

      {/* desk top */}
      <RoundedBox args={[1.6, 0.08, 0.66]} radius={0.02} position={[0, 0.78, 0]} castShadow>
        <meshStandardMaterial color={C.marble} metalness={0.1} roughness={0.35} />
      </RoundedBox>
      {/* gold legs */}
      <mesh position={[-0.7, 0.39, 0.25]}><boxGeometry args={[0.05, 0.78, 0.05]} /><Gold /></mesh>
      <mesh position={[0.7, 0.39, 0.25]}><boxGeometry args={[0.05, 0.78, 0.05]} /><Gold /></mesh>
      <mesh position={[-0.7, 0.39, -0.25]}><boxGeometry args={[0.05, 0.78, 0.05]} /><Gold /></mesh>
      <mesh position={[0.7, 0.39, -0.25]}><boxGeometry args={[0.05, 0.78, 0.05]} /><Gold /></mesh>

      {/* monitor */}
      <RoundedBox args={[0.72, 0.44, 0.04]} radius={0.02} position={[0, 1.12, -0.12]}>
        <meshStandardMaterial color={C.ink} emissive={C.lilacDeep} emissiveIntensity={0.25} />
      </RoundedBox>
      <mesh position={[0, 0.86, -0.12]}><boxGeometry args={[0.1, 0.16, 0.1]} /><Gold /></mesh>

      {/* desk lamp (brass arc) */}
      <mesh position={[-0.62, 0.84, -0.05]}><cylinderGeometry args={[0.05, 0.06, 0.03, 16]} /><Gold /></mesh>
      <mesh position={[-0.62, 1.02, -0.05]}><cylinderGeometry args={[0.012, 0.012, 0.36, 8]} /><Gold /></mesh>
      <mesh position={[-0.5, 1.2, -0.02]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.012, 0.012, 0.26, 8]} /><Gold /></mesh>
      <mesh position={[-0.4, 1.15, 0.0]} rotation={[0.5, 0, 0]}><coneGeometry args={[0.07, 0.1, 16, 1, true]} /><meshStandardMaterial color={C.lilac} side={THREE.DoubleSide} /></mesh>

      {/* pen cup + notebook */}
      <mesh position={[0.5, 0.86, 0.12]}><cylinderGeometry args={[0.05, 0.045, 0.12, 16]} /><meshStandardMaterial color={C.blush} /></mesh>
      <mesh position={[0.5, 0.94, 0.12]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.006, 0.006, 0.16, 6]} /><meshStandardMaterial color={C.lilacDeep} /></mesh>
      <mesh position={[0.46, 0.94, 0.12]} rotation={[0, 0, -0.1]}><cylinderGeometry args={[0.006, 0.006, 0.16, 6]} /><meshStandardMaterial color={C.rose} /></mesh>
      <mesh position={[0.18, 0.83, 0.18]} rotation={[-Math.PI / 2, 0, 0.1]}><boxGeometry args={[0.3, 0.4, 0.02]} /><meshStandardMaterial color={C.mustard} roughness={0.7} /></mesh>

      {/* small desk plant */}
      <mesh position={[-0.2, 0.86, 0.16]}><cylinderGeometry args={[0.06, 0.05, 0.1, 16]} /><meshStandardMaterial color={C.sage} /></mesh>
      <mesh position={[-0.2, 0.98, 0.16]}><sphereGeometry args={[0.09, 14, 14]} /><meshStandardMaterial color={C.sage} roughness={0.9} /></mesh>

      {/* chair */}
      <RoundedBox args={[0.5, 0.1, 0.5]} radius={0.06} position={[0, 0.45, 0.6]}><meshStandardMaterial color={C.lilac} roughness={0.95} /></RoundedBox>
      <RoundedBox args={[0.5, 0.55, 0.1]} radius={0.06} position={[0, 0.72, 0.84]}><meshStandardMaterial color={C.lilac} roughness={0.95} /></RoundedBox>

      {/* gallery wall - three framed prints in different colours */}
      <FramedArt position={[-0.92, 1.78, -0.55]} color={C.rose} w={0.6} h={0.78} />
      <FramedArt position={[-0.18, 1.9, -0.55]} color={C.lilac} w={0.5} h={0.6} />
      <FramedArt position={[-0.2, 1.3, -0.55]} color={C.mustard} w={0.5} h={0.5} />

      {/* floating shelf with colourful books + object */}
      <mesh position={[0.78, 1.55, -0.5]}><boxGeometry args={[0.95, 0.05, 0.22]} /><Gold /></mesh>
      <Books position={[0.62, 1.71, -0.5]} colors={[C.lilacDeep, C.rose, C.sage, C.mustard]} />
      <mesh position={[1.02, 1.66, -0.5]}><sphereGeometry args={[0.1, 16, 16]} /><Gold /></mesh>
      <mesh position={[0.92, 1.45, -0.5]}><boxGeometry args={[0.95, 0.05, 0.22]} /><Gold /></mesh>
    </group>
  )
}

// Upper-floor decorative niche (flanks the studio): pedestal + sculpture or plant
function Niche({ x, y, kind }: { x: number; y: number; kind: 'art' | 'plant' }) {
  return (
    <group position={[x, y, BACK_Z + 0.5]}>
      {kind === 'art' ? (
        <>
          <FramedArt position={[0, 1.75, -0.02]} color={C.lilac} />
          <FramedArt position={[0, 0.9, -0.02]} color={C.blush} w={0.5} h={0.5} />
        </>
      ) : (
        <>
          <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.4, 1.0, 0.4]} /><meshStandardMaterial color={C.trimWhite} roughness={0.6} /></mesh>
          <Vase position={[0, 1.0, 0]} />
          <FloorPlant position={[0.7, 0.05, 0.1]} />
        </>
      )}
    </group>
  )
}

// Hall: console + clickable magazine + round mirror + pendant + rug + gallery
function Hall({ onOpenAbout }: { onOpenAbout: () => void }) {
  const mag = useRef<THREE.Group>(null)
  useFrame((s) => { if (mag.current) mag.current.position.y = 0.92 + Math.sin(s.clock.elapsedTime * 1.3) * 0.012 })
  const x = X.mid
  const y = GROUND_Y
  return (
    <group>
      {/* layered runner rug - lilac base + blush inset */}
      <mesh position={[x, y + 0.11, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 2.1]} />
        <meshStandardMaterial color={C.wallLilac} roughness={1} />
      </mesh>
      <mesh position={[x, y + 0.115, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 1.7]} />
        <meshStandardMaterial color={C.blush} roughness={1} />
      </mesh>

      {/* round mirror with gold ring */}
      <mesh position={[x, y + 1.95, BACK_Z + 0.07]}><torusGeometry args={[0.42, 0.04, 16, 48]} /><Gold /></mesh>
      <mesh position={[x, y + 1.95, BACK_Z + 0.06]}><circleGeometry args={[0.4, 48]} /><meshStandardMaterial color={C.sky} metalness={0.4} roughness={0.15} /></mesh>
      {/* flanking framed art */}
      <FramedArt position={[x - 0.95, y + 1.95, BACK_Z + 0.07]} color={C.rose} w={0.46} h={0.58} />
      <FramedArt position={[x + 0.95, y + 1.95, BACK_Z + 0.07]} color={C.lilac} w={0.46} h={0.58} />

      {/* console table */}
      <group position={[x, y, BACK_Z + 0.55]}>
        <RoundedBox args={[1.5, 0.07, 0.5]} radius={0.02} position={[0, 0.82, 0]} castShadow>
          <meshStandardMaterial color={C.marble} metalness={0.12} roughness={0.3} />
        </RoundedBox>
        <mesh position={[-0.65, 0.41, 0.18]}><cylinderGeometry args={[0.025, 0.025, 0.82, 8]} /><Gold /></mesh>
        <mesh position={[0.65, 0.41, 0.18]}><cylinderGeometry args={[0.025, 0.025, 0.82, 8]} /><Gold /></mesh>
        <mesh position={[-0.65, 0.41, -0.18]}><cylinderGeometry args={[0.025, 0.025, 0.82, 8]} /><Gold /></mesh>
        <mesh position={[0.65, 0.41, -0.18]}><cylinderGeometry args={[0.025, 0.025, 0.82, 8]} /><Gold /></mesh>
        {/* vase with blooms + a small stack of books */}
        <Vase position={[0.5, 0.85, 0]} />
        <Books position={[-0.55, 0.88, 0]} colors={[C.lilacDeep, C.rose]} w={0.4} h={0.05} d={0.3} rotation={[Math.PI / 2, 0, 0]} />
        {/* clickable magazine */}
        <group
          ref={mag}
          position={[-0.05, 0.92, 0.04]}
          onPointerDown={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onOpenAbout() }}
          onPointerOver={(e) => { e.stopPropagation(); cursor(true) }}
          onPointerOut={() => cursor(false)}
        >
          <RoundedBox args={[0.5, 0.03, 0.66]} radius={0.015}>
            <meshStandardMaterial color={C.trimWhite} roughness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0.018, 0.18]}><boxGeometry args={[0.42, 0.005, 0.12]} /><meshStandardMaterial color={C.lilacDeep} /></mesh>
          <Text position={[0, 0.022, -0.05]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.06} color={C.ink} anchorX="center" anchorY="middle" maxWidth={0.42} textAlign="center" letterSpacing={0.04}>
            ABOUT THE OWNER
          </Text>
        </group>
      </group>

      {/* pouffe / accent stool */}
      <mesh position={[x - 0.95, y + 0.22, 0.7]} castShadow><cylinderGeometry args={[0.26, 0.26, 0.4, 24]} /><meshStandardMaterial color={C.mustard} roughness={0.9} /></mesh>

      {/* pendant lamp */}
      <Pendant position={[x, GROUND_Y + FLOOR_H - 0.15, 0.5]} swing />
    </group>
  )
}

// ── Landscaping ─────────────────────────────────────────────────────────
function Tree({ position, scale = 1, blossom = false }: { position: [number, number, number]; scale?: number; blossom?: boolean }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.16, 0.22, 1.6, 12]} /><meshStandardMaterial color={C.trunk} roughness={0.9} /></mesh>
      <mesh position={[0, 2.0, 0]} castShadow><sphereGeometry args={[0.95, 18, 18]} /><meshStandardMaterial color={blossom ? C.blossom : C.foliage} roughness={0.95} /></mesh>
      <mesh position={[0.62, 1.62, 0.2]} castShadow><sphereGeometry args={[0.62, 16, 16]} /><meshStandardMaterial color={blossom ? C.blush : C.foliageDeep} roughness={0.95} /></mesh>
      <mesh position={[-0.58, 1.74, -0.12]} castShadow><sphereGeometry args={[0.58, 16, 16]} /><meshStandardMaterial color={blossom ? C.blossom : C.foliage} roughness={0.95} /></mesh>
      <mesh position={[0.0, 2.5, 0.15]} castShadow><sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color={blossom ? C.rose : C.foliageDeep} roughness={0.95} /></mesh>
    </group>
  )
}

function Bush({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.25, 0]} castShadow><sphereGeometry args={[0.42, 14, 14]} /><meshStandardMaterial color={C.foliageDeep} roughness={1} /></mesh>
      <mesh position={[0.32, 0.18, 0.1]} castShadow><sphereGeometry args={[0.3, 12, 12]} /><meshStandardMaterial color={C.foliage} roughness={1} /></mesh>
      <mesh position={[-0.3, 0.16, -0.05]} castShadow><sphereGeometry args={[0.28, 12, 12]} /><meshStandardMaterial color={C.foliage} roughness={1} /></mesh>
      {/* flower dots */}
      <mesh position={[0.1, 0.55, 0.32]}><sphereGeometry args={[0.06, 8, 8]} /><meshStandardMaterial color={C.blush} /></mesh>
      <mesh position={[-0.14, 0.48, 0.28]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color={C.mustard} /></mesh>
      <mesh position={[0.28, 0.4, -0.06]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color={C.lilac} /></mesh>
    </group>
  )
}

// Lawn + stone patio + stepping-stone path + trees, bushes and topiaries around the house
function Landscape() {
  const stones: [number, number][] = [[0, 5.0], [0, 6.1], [0, 7.2], [0, 8.3], [0, 9.4]]
  return (
    <group>
      {/* paved patio slab in front of the facade */}
      <mesh position={[0, -0.02, FRONT_Z + 1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.4, 2.8]} />
        <meshStandardMaterial color={C.stone} roughness={1} />
      </mesh>
      {/* stepping-stone path out toward the viewer */}
      {stones.map(([sx, sz], i) => (
        <mesh key={i} position={[sx, 0.0, sz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.62, 28]} />
          <meshStandardMaterial color={C.stoneEdge} roughness={1} />
        </mesh>
      ))}
      {/* trees flanking the house */}
      <Tree position={[-6.8, 0, 1.4]} scale={1.5} />
      <Tree position={[7.4, 0, 0.4]} scale={1.7} blossom />
      <Tree position={[-7.8, 0, -1.6]} scale={1.2} blossom />
      <Tree position={[6.4, 0, -2.2]} scale={1.15} />
      {/* bushes hugging the facade + along the path */}
      <Bush position={[-2.1, 0, FRONT_Z + 0.5]} scale={1.15} />
      <Bush position={[2.1, 0, FRONT_Z + 0.5]} scale={1.15} />
      <Bush position={[-3.6, 0, FRONT_Z + 1.0]} />
      <Bush position={[3.6, 0, FRONT_Z + 1.0]} />
      <Bush position={[-1.4, 0, 6.0]} scale={0.8} />
      <Bush position={[1.4, 0, 6.0]} scale={0.8} />
      <Bush position={[-1.6, 0, 8.6]} scale={0.7} />
      <Bush position={[1.6, 0, 8.6]} scale={0.7} />
      {/* clipped topiaries in brass planters framing the door */}
      {[-1.1, 1.1].map((tx, i) => (
        <group key={i} position={[tx, 0, FRONT_Z + 0.55]}>
          <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.12, 0.15, 0.36, 16]} /><meshStandardMaterial color={C.trimWhite} roughness={0.6} /></mesh>
          <mesh position={[0, 0.37, 0]}><cylinderGeometry args={[0.12, 0.12, 0.04, 16]} /><Gold /></mesh>
          <mesh position={[0, 0.56, 0]} castShadow><sphereGeometry args={[0.22, 16, 16]} /><meshStandardMaterial color={C.foliageDeep} roughness={1} /></mesh>
          <mesh position={[0, 0.84, 0]} castShadow><sphereGeometry args={[0.17, 16, 16]} /><meshStandardMaterial color={C.foliage} roughness={1} /></mesh>
        </group>
      ))}
    </group>
  )
}

// Roof - soft purple, matching the homepage dollhouse
function Roof() {
  return (
    <group>
      <mesh position={[0, 6.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[6.6, 1.9, 4]} />
        <meshStandardMaterial color={C.roof} roughness={0.85} />
      </mesh>
      {/* a touch of shade under the eave */}
      <mesh position={[0, 5.7, 0]}>
        <boxGeometry args={[6.5, 0.1, 6.5]} />
        <meshStandardMaterial color={C.roofDark} roughness={0.9} />
      </mesh>
    </group>
  )
}

// Facade (front wall) - fades out / door swings when entered
function Facade({ entered, onEnterHall }: { entered: boolean; onEnterHall: () => void }) {
  const grp = useRef<THREE.Group>(null)
  const door = useRef<THREE.Group>(null)
  const matRefs = useRef<THREE.MeshStandardMaterial[]>([])
  useFrame(() => {
    const target = entered ? 0 : 1
    matRefs.current.forEach((m) => { if (m) m.opacity = THREE.MathUtils.lerp(m.opacity, target, 0.12) })
    if (grp.current) grp.current.visible = !(entered && (matRefs.current[0]?.opacity ?? 0) < 0.02)
    if (door.current) {
      const dt = entered ? -Math.PI / 2.2 : 0
      door.current.rotation.y = THREE.MathUtils.lerp(door.current.rotation.y, dt, 0.1)
    }
  })
  const wallMat = (i: number) => (
    <meshStandardMaterial ref={(r) => { if (r) matRefs.current[i] = r as THREE.MeshStandardMaterial }} color={C.houseWall} roughness={0.85} transparent opacity={1} />
  )
  return (
    <group ref={grp}>
      {/* left column */}
      <mesh position={[X.left, 3.1, FRONT_Z]}>
        <boxGeometry args={[BAY_W, 6.2, 0.1]} />
        {wallMat(0)}
      </mesh>
      {/* right column */}
      <mesh position={[X.right, 3.1, FRONT_Z]}>
        <boxGeometry args={[BAY_W, 6.2, 0.1]} />
        {wallMat(1)}
      </mesh>
      {/* center upper (above door) */}
      <mesh position={[X.mid, 4.7, FRONT_Z]}>
        <boxGeometry args={[BAY_W, 3.0, 0.1]} />
        {wallMat(2)}
      </mesh>
      {/* transom panel closing the gap between the door head and the upper wall */}
      <mesh position={[X.mid, 3.0, FRONT_Z]}>
        <boxGeometry args={[BAY_W, 0.55, 0.1]} />
        {wallMat(3)}
      </mesh>
      {/* ground-floor panels flanking the door so the centre bay reads solid (no see-through gaps) */}
      <mesh position={[X.mid - 1.05, 1.375, FRONT_Z]}>
        <boxGeometry args={[0.62, 2.75, 0.1]} />
        {wallMat(5)}
      </mesh>
      <mesh position={[X.mid + 1.05, 1.375, FRONT_Z]}>
        <boxGeometry args={[0.62, 2.75, 0.1]} />
        {wallMat(6)}
      </mesh>
      {/* pink windows with dark frame + cross mullions (like the homepage dollhouse) */}
      {[X.left, X.right].map((wx, k) => (
        <group key={k} position={[wx, 4.6, FRONT_Z + 0.05]}>
          {/* dark frame backing */}
          <mesh position={[0, 0, 0]}><boxGeometry args={[1.18, 1.18, 0.04]} /><meshStandardMaterial color={C.ink} roughness={0.7} /></mesh>
          {/* pink pane */}
          <mesh position={[0, 0, 0.03]}><boxGeometry args={[1.04, 1.04, 0.03]} /><meshStandardMaterial color={C.windowGlass} roughness={0.4} /></mesh>
          {/* mullions */}
          <mesh position={[0, 0, 0.06]}><boxGeometry args={[0.05, 1.04, 0.02]} /><meshStandardMaterial color={C.ink} /></mesh>
          <mesh position={[0, 0, 0.06]}><boxGeometry args={[1.04, 0.05, 0.02]} /><meshStandardMaterial color={C.ink} /></mesh>
        </group>
      ))}
      {/* heart above the door - deep rose so it actually reads against the cream wall */}
      <group position={[X.mid, 3.05, FRONT_Z + 0.06]}>
        <mesh position={[-0.16, 0.09, 0]}><circleGeometry args={[0.17, 24]} /><meshStandardMaterial color={C.rose} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0.16, 0.09, 0]}><circleGeometry args={[0.17, 24]} /><meshStandardMaterial color={C.rose} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.07, 0]} rotation={[0, 0, Math.PI / 4]}><planeGeometry args={[0.37, 0.37]} /><meshStandardMaterial color={C.rose} side={THREE.DoubleSide} /></mesh>
      </group>
      {/* dark door frame */}
      <mesh position={[X.mid, 1.4, FRONT_Z + 0.02]}><boxGeometry args={[1.5, 2.7, 0.06]} /><meshStandardMaterial color={C.ink} roughness={0.7} /></mesh>
      {/* door (swings) - soft purple */}
      <group ref={door} position={[X.mid - 0.6, 1.35, FRONT_Z + 0.05]}>
        <mesh
          position={[0.6, 0, 0]}
          onPointerDown={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); if (!entered) onEnterHall() }}
          onPointerOver={(e) => { e.stopPropagation(); if (!entered) cursor(true) }}
          onPointerOut={() => cursor(false)}
        >
          <boxGeometry args={[1.2, 2.4, 0.08]} />
          <meshStandardMaterial ref={(r)=>{if(r)matRefs.current[4]=r as THREE.MeshStandardMaterial}} color={C.roof} roughness={0.6} transparent opacity={1} />
        </mesh>
        <mesh position={[1.05, 0, 0.08]}><sphereGeometry args={[0.05, 16, 16]} /><Gold /></mesh>
      </group>
      {/* welcome mat */}
      <mesh position={[X.mid, 0.12, FRONT_Z + 0.95]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.3, 0.8]} /><meshStandardMaterial color={C.blush} roughness={1} /></mesh>
      <Text position={[X.mid, 0.14, FRONT_Z + 0.95]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.15} color={C.ink} anchorX="center" anchorY="middle" letterSpacing={0.06}>
        {entered ? '' : 'click the door ↑'}
      </Text>
    </group>
  )
}

function CameraRig({ view }: { view: ViewId }) {
  const { camera } = useThree()
  const tgt = useRef(new THREE.Vector3(...CAMERA.exterior.tgt))
  const look = useRef(new THREE.Vector3(...CAMERA.exterior.tgt))
  useFrame(() => {
    const wp = CAMERA[view]
    camera.position.lerp(new THREE.Vector3(...wp.pos), 0.055)
    tgt.current.lerp(new THREE.Vector3(...wp.tgt), 0.055)
    look.current.lerp(tgt.current, 0.2)
    camera.lookAt(look.current)
  })
  return null
}

export default function House({
  view,
  entered,
  onEnterHall,
  onSelectRoom,
  onOpenAbout,
}: {
  view: ViewId
  entered: boolean
  onEnterHall: () => void
  onSelectRoom: (id: RoomId) => void
  onOpenAbout: () => void
}) {
  return (
    <>
      <CameraRig view={view} />
      {/* soft, even daylight for a clean Apple-store feel */}
      <hemisphereLight intensity={0.75} color={'#ffffff'} groundColor={'#e6f1da'} />
      <ambientLight intensity={0.45} color={'#fff6ec'} />
      <directionalLight position={[6, 11, 8]} intensity={1.05} color={'#fff4e6'} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-6, 6, 4]} intensity={0.35} color={'#efe6ff'} />

      {/* lawn - fresh pastel green */}
      <mesh position={[0, -0.05, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial color={C.grass} roughness={1} />
      </mesh>
      {/* a darker grass patch under the house for depth */}
      <mesh position={[0, -0.045, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial color={C.grassDark} roughness={1} />
      </mesh>

      <Landscape />

      {/* room shells - ground: kitchen | hall | sunroom ; upper: niche | studio | niche */}
      <Shell x={X.left} y={GROUND_Y} wall={C.wallBlush} />
      <Shell x={X.mid} y={GROUND_Y} wall={C.wallHall} />
      <Shell x={X.right} y={GROUND_Y} wall={C.wallSage} />
      <Shell x={X.left} y={UPPER_Y} wall={C.wallLilac} />
      <Shell x={X.mid} y={UPPER_Y} wall={C.wallLilac} />
      <Shell x={X.right} y={UPPER_Y} wall={C.wallLilac} />

      {/* labels */}
      <RoomLabel x={X.left} y={GROUND_Y} text="KITCHEN" />
      <RoomLabel x={X.right} y={GROUND_Y} text="SUNROOM" />
      <RoomLabel x={X.mid} y={UPPER_Y} text="STUDIO" />

      {/* furniture */}
      <KitchenRoom x={X.left} y={GROUND_Y} />
      <SunroomRoom x={X.right} y={GROUND_Y} />
      <StudioRoom x={X.mid} y={UPPER_Y} />
      <Niche x={X.left} y={UPPER_Y} kind="plant" />
      <Niche x={X.right} y={UPPER_Y} kind="art" />
      <Hall onOpenAbout={onOpenAbout} />

      {/* room hit zones (only active after entering) */}
      {entered && (
        <>
          <RoomHit x={X.left} y={GROUND_Y} active={view === 'kitchen'} onClick={() => onSelectRoom('kitchen')} />
          <RoomHit x={X.right} y={GROUND_Y} active={view === 'sunroom'} onClick={() => onSelectRoom('sunroom')} />
          <RoomHit x={X.mid} y={UPPER_Y} active={view === 'studio'} onClick={() => onSelectRoom('studio')} />
        </>
      )}

      <Roof />
      <Facade entered={entered} onEnterHall={onEnterHall} />
    </>
  )
}
