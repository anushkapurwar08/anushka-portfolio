'use client'
import { useRef } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { RoomId, ViewId } from '@/lib/tour'

// ── Minimal-luxe palette ──────────────────────────────────────────────
const C = {
  wall: '#DCD4C7',      // warm greige
  wallSoft: '#E8E1D5',  // lighter greige
  marble: '#F1ECE4',    // polished floor
  trimWhite: '#FBF8F2',
  gold: '#C2A368',      // brass
  ink: '#2D2D2D',
  accent: '#8B5CC0',    // signature purple, used sparingly
  fabric: '#CDBFAE',    // muted upholstery
  green: '#8FA98A',     // muted plant
  glow: '#FFE9C2',      // warm light
  // exterior — matches the homepage dollhouse
  roof: '#D8B4F8',      // soft purple roof
  roofDark: '#b893e8',  // roof shade
  cream: '#FFF8F0',     // house body
  windowPink: '#F8E8EE',// pink window glass
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

// Thin brass material helper
function Gold(props: any) {
  return <meshStandardMaterial color={C.gold} metalness={0.85} roughness={0.35} {...props} />
}

// A single room shell: marble floor, greige back wall, ceiling, dividers, gold trim
function Shell({ x, y }: { x: number; y: number }) {
  return (
    <group>
      {/* floor (polished marble) */}
      <mesh position={[x, y + 0.05, 0]} receiveShadow>
        <boxGeometry args={[BAY_W, 0.1, 3.4]} />
        <meshStandardMaterial color={C.marble} metalness={0.1} roughness={0.45} />
      </mesh>
      {/* back wall */}
      <mesh position={[x, y + FLOOR_H / 2, BACK_Z]} receiveShadow>
        <boxGeometry args={[BAY_W, FLOOR_H, 0.12]} />
        <meshStandardMaterial color={C.wall} roughness={0.95} />
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
    <Text position={[x, y + 2.5, BACK_Z + 0.08]} fontSize={0.26} color={C.ink} anchorX="center" anchorY="middle" maxWidth={BAY_W - 0.3} textAlign="center" letterSpacing={0.06}>
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
      <meshStandardMaterial transparent opacity={active ? 0.0 : 0.03} color={C.accent} depthWrite={false} />
    </mesh>
  )
}

// ── Decorative props ──────────────────────────────────────────────────
function Vase({ position, branch = true }: { position: [number, number, number]; branch?: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow><cylinderGeometry args={[0.08, 0.12, 0.42, 20]} /><meshStandardMaterial color={C.trimWhite} roughness={0.4} /></mesh>
      {branch && (
        <>
          <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.006, 0.01, 0.6, 6]} /><meshStandardMaterial color={C.ink} /></mesh>
          <mesh position={[0.1, 0.62, 0]}><sphereGeometry args={[0.07, 12, 12]} /><meshStandardMaterial color={C.green} /></mesh>
          <mesh position={[-0.05, 0.5, 0.04]}><sphereGeometry args={[0.05, 12, 12]} /><meshStandardMaterial color={C.green} /></mesh>
        </>
      )}
    </group>
  )
}

function FloorPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow><cylinderGeometry args={[0.2, 0.16, 0.45, 20]} /><meshStandardMaterial color={C.trimWhite} roughness={0.5} /></mesh>
      <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.34, 18, 18]} /><meshStandardMaterial color={C.green} roughness={0.9} /></mesh>
      <mesh position={[0.18, 0.7, 0.05]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color={C.green} roughness={0.9} /></mesh>
      <mesh position={[-0.16, 0.66, -0.04]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color={C.green} roughness={0.9} /></mesh>
    </group>
  )
}

// Framed wall art with purple accent
function FramedArt({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh><boxGeometry args={[0.72, 0.92, 0.04]} /><Gold /></mesh>
      <mesh position={[0, 0, 0.03]}><boxGeometry args={[0.6, 0.8, 0.02]} /><meshStandardMaterial color={C.accent} roughness={0.6} /></mesh>
      <mesh position={[0, -0.05, 0.045]}><boxGeometry args={[0.4, 0.4, 0.01]} /><meshStandardMaterial color={C.wallSoft} /></mesh>
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
        <meshStandardMaterial color={C.wallSoft} roughness={0.85} />
      </RoundedBox>
      {/* marble countertop */}
      <RoundedBox args={[2.2, 0.08, 0.66]} radius={0.02} position={[0, 0.89, 0]}>
        <meshStandardMaterial color={C.marble} metalness={0.15} roughness={0.35} />
      </RoundedBox>
      {/* gold toe-kick */}
      <mesh position={[0, 0.06, 0.28]}><boxGeometry args={[2.0, 0.05, 0.04]} /><Gold /></mesh>
      {/* fruit bowl */}
      <mesh position={[0.55, 0.96, 0]}><cylinderGeometry args={[0.16, 0.12, 0.1, 20]} /><Gold /></mesh>
      <mesh position={[0.55, 1.04, 0]}><sphereGeometry args={[0.06, 14, 14]} /><meshStandardMaterial color={C.accent} /></mesh>
      <mesh position={[0.45, 1.03, 0.04]}><sphereGeometry args={[0.05, 14, 14]} /><meshStandardMaterial color={C.green} /></mesh>
      {/* pot + steam */}
      <mesh position={[-0.5, 0.99, 0]}><cylinderGeometry args={[0.16, 0.14, 0.16, 20]} /><meshStandardMaterial color={C.ink} metalness={0.5} roughness={0.4} /></mesh>
      <group ref={steam} position={[-0.5, 1.06, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}><sphereGeometry args={[0.1, 10, 10]} /><meshStandardMaterial color={'#ffffff'} transparent opacity={0.35} /></mesh>
        ))}
      </group>
      {/* pendants above island */}
      <Pendant position={[-0.5, FLOOR_H - 0.2, 0]} />
      <Pendant position={[0.5, FLOOR_H - 0.2, 0]} />
    </group>
  )
}

function SunroomRoom({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, y, BACK_Z + 0.5]}>
      {/* big warm window on back wall */}
      <mesh position={[0, 1.5, -0.05]}><boxGeometry args={[1.6, 1.8, 0.02]} /><meshStandardMaterial color={C.glow} emissive={C.glow} emissiveIntensity={0.5} /></mesh>
      <mesh position={[0, 1.5, 0.0]}><boxGeometry args={[1.66, 0.04, 0.03]} /><Gold /></mesh>
      <mesh position={[0, 0.6, 0.0]}><boxGeometry args={[1.66, 0.04, 0.03]} /><Gold /></mesh>
      <mesh position={[0, 1.5, 0.0]}><boxGeometry args={[0.04, 1.84, 0.03]} /><Gold /></mesh>
      {/* lounge chair */}
      <RoundedBox args={[0.9, 0.4, 0.8]} radius={0.1} position={[-0.4, 0.32, 0.5]} castShadow>
        <meshStandardMaterial color={C.fabric} roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.9, 0.7, 0.16]} radius={0.1} position={[-0.4, 0.62, 0.14]}>
        <meshStandardMaterial color={C.fabric} roughness={0.95} />
      </RoundedBox>
      {/* gold legs */}
      <mesh position={[-0.75, 0.1, 0.8]}><cylinderGeometry args={[0.02, 0.02, 0.22, 8]} /><Gold /></mesh>
      <mesh position={[-0.05, 0.1, 0.8]}><cylinderGeometry args={[0.02, 0.02, 0.22, 8]} /><Gold /></mesh>
      {/* side table */}
      <mesh position={[0.5, 0.45, 0.5]}><cylinderGeometry args={[0.22, 0.22, 0.04, 24]} /><meshStandardMaterial color={C.marble} metalness={0.15} roughness={0.35} /></mesh>
      <mesh position={[0.5, 0.22, 0.5]}><cylinderGeometry args={[0.02, 0.02, 0.45, 8]} /><Gold /></mesh>
      {/* plant */}
      <FloorPlant position={[0.7, 0.05, -0.2]} />
    </group>
  )
}

function StudioRoom({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, y, BACK_Z + 0.6]}>
      {/* desk top */}
      <RoundedBox args={[1.6, 0.08, 0.66]} radius={0.02} position={[0, 0.78, 0]} castShadow>
        <meshStandardMaterial color={C.marble} metalness={0.12} roughness={0.4} />
      </RoundedBox>
      {/* gold legs */}
      <mesh position={[-0.7, 0.39, 0.25]}><boxGeometry args={[0.05, 0.78, 0.05]} /><Gold /></mesh>
      <mesh position={[0.7, 0.39, 0.25]}><boxGeometry args={[0.05, 0.78, 0.05]} /><Gold /></mesh>
      <mesh position={[-0.7, 0.39, -0.25]}><boxGeometry args={[0.05, 0.78, 0.05]} /><Gold /></mesh>
      <mesh position={[0.7, 0.39, -0.25]}><boxGeometry args={[0.05, 0.78, 0.05]} /><Gold /></mesh>
      {/* monitor */}
      <RoundedBox args={[0.72, 0.44, 0.04]} radius={0.02} position={[0, 1.12, -0.1]}>
        <meshStandardMaterial color={C.trimWhite} emissive={C.accent} emissiveIntensity={0.15} />
      </RoundedBox>
      <mesh position={[0, 0.86, -0.1]}><boxGeometry args={[0.1, 0.16, 0.1]} /><meshStandardMaterial color={C.ink} /></mesh>
      {/* chair */}
      <RoundedBox args={[0.5, 0.1, 0.5]} radius={0.06} position={[0, 0.45, 0.6]}><meshStandardMaterial color={C.fabric} roughness={0.95} /></RoundedBox>
      <RoundedBox args={[0.5, 0.55, 0.1]} radius={0.06} position={[0, 0.72, 0.84]}><meshStandardMaterial color={C.fabric} roughness={0.95} /></RoundedBox>
      {/* wall art + shelf (against back wall, local z ≈ -0.55) */}
      <FramedArt position={[-0.85, 1.7, -0.55]} />
      <mesh position={[0.8, 1.55, -0.5]}><boxGeometry args={[0.9, 0.05, 0.22]} /><meshStandardMaterial color={C.wallSoft} /></mesh>
      <mesh position={[0.55, 1.7, -0.5]}><boxGeometry args={[0.12, 0.24, 0.12]} /><meshStandardMaterial color={C.accent} /></mesh>
      <mesh position={[0.8, 1.66, -0.5]}><sphereGeometry args={[0.1, 16, 16]} /><Gold /></mesh>
      <mesh position={[1.05, 1.68, -0.5]}><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color={C.green} /></mesh>
    </group>
  )
}

// Upper-floor decorative niche (flanks the studio): pedestal + sculpture or plant
function Niche({ x, y, kind }: { x: number; y: number; kind: 'art' | 'plant' }) {
  return (
    <group position={[x, y, BACK_Z + 0.5]}>
      {kind === 'art' ? (
        <FramedArt position={[0, 1.6, -0.02]} />
      ) : (
        <>
          <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.4, 1.0, 0.4]} /><meshStandardMaterial color={C.trimWhite} roughness={0.6} /></mesh>
          <Vase position={[0, 1.0, 0]} />
        </>
      )}
    </group>
  )
}

// Hall: console + clickable magazine + round mirror + pendant + runner
function Hall({ onOpenAbout }: { onOpenAbout: () => void }) {
  const mag = useRef<THREE.Group>(null)
  useFrame((s) => { if (mag.current) mag.current.position.y = 0.92 + Math.sin(s.clock.elapsedTime * 1.3) * 0.012 })
  const x = X.mid
  const y = GROUND_Y
  return (
    <group>
      {/* runner rug */}
      <mesh position={[x, y + 0.11, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 2.0]} />
        <meshStandardMaterial color={C.fabric} roughness={1} />
      </mesh>
      {/* round mirror with gold ring */}
      <mesh position={[x, y + 1.9, BACK_Z + 0.07]}><torusGeometry args={[0.42, 0.04, 16, 48]} /><Gold /></mesh>
      <mesh position={[x, y + 1.9, BACK_Z + 0.06]}><circleGeometry args={[0.4, 48]} /><meshStandardMaterial color={C.wallSoft} metalness={0.3} roughness={0.2} /></mesh>
      {/* console table */}
      <group position={[x, y, BACK_Z + 0.55]}>
        <RoundedBox args={[1.5, 0.07, 0.5]} radius={0.02} position={[0, 0.82, 0]} castShadow>
          <meshStandardMaterial color={C.marble} metalness={0.15} roughness={0.35} />
        </RoundedBox>
        <mesh position={[-0.65, 0.41, 0.18]}><cylinderGeometry args={[0.025, 0.025, 0.82, 8]} /><Gold /></mesh>
        <mesh position={[0.65, 0.41, 0.18]}><cylinderGeometry args={[0.025, 0.025, 0.82, 8]} /><Gold /></mesh>
        <mesh position={[-0.65, 0.41, -0.18]}><cylinderGeometry args={[0.025, 0.025, 0.82, 8]} /><Gold /></mesh>
        <mesh position={[0.65, 0.41, -0.18]}><cylinderGeometry args={[0.025, 0.025, 0.82, 8]} /><Gold /></mesh>
        {/* a slim vase on the console */}
        <Vase position={[0.5, 0.85, 0]} />
        {/* clickable magazine */}
        <group
          ref={mag}
          position={[-0.15, 0.92, 0.02]}
          onPointerDown={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onOpenAbout() }}
          onPointerOver={(e) => { e.stopPropagation(); cursor(true) }}
          onPointerOut={() => cursor(false)}
        >
          <RoundedBox args={[0.5, 0.03, 0.66]} radius={0.015}>
            <meshStandardMaterial color={C.trimWhite} roughness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0.018, 0.18]}><boxGeometry args={[0.42, 0.005, 0.12]} /><meshStandardMaterial color={C.accent} /></mesh>
          <Text position={[0, 0.022, -0.05]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.06} color={C.ink} anchorX="center" anchorY="middle" maxWidth={0.42} textAlign="center" letterSpacing={0.04}>
            ABOUT THE OWNER
          </Text>
        </group>
      </group>
      {/* pendant lamp */}
      <Pendant position={[x, GROUND_Y + FLOOR_H - 0.15, 0.5]} swing />
    </group>
  )
}

// Roof — soft purple, matching the homepage dollhouse
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

// Facade (front wall) — fades out / door swings when entered
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
    <meshStandardMaterial ref={(r) => { if (r) matRefs.current[i] = r as THREE.MeshStandardMaterial }} color={C.cream} roughness={0.9} transparent opacity={1} />
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
      {/* pink windows with dark frame + cross mullions (like the homepage dollhouse) */}
      {[X.left, X.right].map((wx, k) => (
        <group key={k} position={[wx, 4.6, FRONT_Z + 0.05]}>
          {/* dark frame backing */}
          <mesh position={[0, 0, 0]}><boxGeometry args={[1.18, 1.18, 0.04]} /><meshStandardMaterial color={C.ink} roughness={0.7} /></mesh>
          {/* pink pane */}
          <mesh position={[0, 0, 0.03]}><boxGeometry args={[1.04, 1.04, 0.03]} /><meshStandardMaterial color={C.windowPink} roughness={0.4} /></mesh>
          {/* mullions */}
          <mesh position={[0, 0, 0.06]}><boxGeometry args={[0.05, 1.04, 0.02]} /><meshStandardMaterial color={C.ink} /></mesh>
          <mesh position={[0, 0, 0.06]}><boxGeometry args={[1.04, 0.05, 0.02]} /><meshStandardMaterial color={C.ink} /></mesh>
        </group>
      ))}
      {/* heart above the door */}
      <group position={[X.mid, 3.15, FRONT_Z + 0.05]}>
        <mesh position={[-0.12, 0.07, 0]}><circleGeometry args={[0.14, 24]} /><meshStandardMaterial color={C.windowPink} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0.12, 0.07, 0]}><circleGeometry args={[0.14, 24]} /><meshStandardMaterial color={C.windowPink} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.04, 0]} rotation={[0, 0, Math.PI / 4]}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial color={C.windowPink} side={THREE.DoubleSide} /></mesh>
      </group>
      {/* dark door frame */}
      <mesh position={[X.mid, 1.4, FRONT_Z + 0.02]}><boxGeometry args={[1.5, 2.7, 0.06]} /><meshStandardMaterial color={C.ink} roughness={0.7} /></mesh>
      {/* door (swings) — soft purple */}
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
        <mesh position={[1.05, 0, 0.08]}><sphereGeometry args={[0.05, 16, 16]} /><meshStandardMaterial color={C.ink} /></mesh>
      </group>
      {/* welcome mat text */}
      <Text position={[X.mid, 0.15, FRONT_Z + 1.0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.16} color={C.ink} anchorX="center" anchorY="middle" letterSpacing={0.06}>
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
      <ambientLight intensity={0.55} color={'#fff3e6'} />
      <directionalLight position={[6, 11, 8]} intensity={1.0} color={'#fff4e6'} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-6, 6, 4]} intensity={0.3} color={'#efe6ff'} />

      {/* ground */}
      <mesh position={[0, -0.05, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color={C.wallSoft} roughness={1} />
      </mesh>

      {/* room shells — ground: kitchen | hall | sunroom ; upper: niche | studio | niche */}
      <Shell x={X.left} y={GROUND_Y} />
      <Shell x={X.mid} y={GROUND_Y} />
      <Shell x={X.right} y={GROUND_Y} />
      <Shell x={X.left} y={UPPER_Y} />
      <Shell x={X.mid} y={UPPER_Y} />
      <Shell x={X.right} y={UPPER_Y} />

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
