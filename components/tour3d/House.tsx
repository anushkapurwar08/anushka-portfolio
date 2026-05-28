'use client'
import { useRef } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { RoomId, ViewId } from '@/lib/tour'

// Palette
const C = {
  cream: '#FFF8F0',
  blush: '#F8E8EE',
  lilac: '#D8B4F8',
  lilacDeep: '#8B5CC0',
  ink: '#2D2D2D',
  sage: '#C9DABF',
  sun: '#FCD34D',
}

// Camera waypoints per view: [position, lookAt]
export const CAMERA: Record<ViewId, { pos: [number, number, number]; tgt: [number, number, number] }> = {
  exterior: { pos: [0, 3.0, 17], tgt: [0, 3.0, 0] },
  hall: { pos: [0, 1.5, 7.5], tgt: [0, 1.4, 0] },
  kitchen: { pos: [-3, 1.5, 6.2], tgt: [-3, 1.4, -1] },
  sunroom: { pos: [3, 1.5, 6.2], tgt: [3, 1.4, -1] },
  library: { pos: [-3, 4.6, 6.2], tgt: [-3, 4.5, -1] },
  studio: { pos: [3, 4.6, 6.2], tgt: [3, 4.5, -1] },
  farewell: { pos: [0, 3.0, 15], tgt: [0, 3.0, 0] },
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

// A single room shell: floor, back wall, ceiling, dividers
function Shell({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <group>
      {/* floor */}
      <mesh position={[x, y + 0.05, 0]} receiveShadow>
        <boxGeometry args={[BAY_W, 0.1, 3.4]} />
        <meshStandardMaterial color={C.cream} />
      </mesh>
      {/* back wall */}
      <mesh position={[x, y + FLOOR_H / 2, BACK_Z]}>
        <boxGeometry args={[BAY_W, FLOOR_H, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* left divider */}
      <mesh position={[x - BAY_W / 2, y + FLOOR_H / 2, 0]}>
        <boxGeometry args={[0.1, FLOOR_H, 3.4]} />
        <meshStandardMaterial color={'#ffffff'} />
      </mesh>
      {/* right divider */}
      <mesh position={[x + BAY_W / 2, y + FLOOR_H / 2, 0]}>
        <boxGeometry args={[0.1, FLOOR_H, 3.4]} />
        <meshStandardMaterial color={'#ffffff'} />
      </mesh>
    </group>
  )
}

function RoomLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <Text position={[x, y + 2.55, BACK_Z + 0.08]} fontSize={0.32} color={C.ink} anchorX="center" anchorY="middle" maxWidth={BAY_W - 0.3} textAlign="center">
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
      <meshStandardMaterial transparent opacity={active ? 0.0 : 0.04} color={C.lilacDeep} depthWrite={false} />
    </mesh>
  )
}

// ---- Furniture ----
function Bookshelf({ x, y }: { x: number; y: number }) {
  const cols = [C.lilac, C.blush, C.sage, C.lilacDeep, C.sun]
  return (
    <group position={[x - 0.6, y, BACK_Z + 0.5]}>
      <RoundedBox args={[1.5, 1.8, 0.4]} radius={0.05} position={[0, 0.95, 0]}>
        <meshStandardMaterial color={'#e7d7c9'} />
      </RoundedBox>
      {[0.45, 1.0, 1.55].map((shelfY, si) => (
        <group key={si} position={[0, shelfY, 0.05]}>
          {cols.map((c, i) => (
            <mesh key={i} position={[-0.55 + i * 0.26, 0.05, 0]}>
              <boxGeometry args={[0.16, 0.34, 0.22]} />
              <meshStandardMaterial color={c} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function Desk({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x + 0.4, y, BACK_Z + 0.7]}>
      <RoundedBox args={[1.4, 0.12, 0.7]} radius={0.04} position={[0, 0.75, 0]}>
        <meshStandardMaterial color={'#e7d7c9'} />
      </RoundedBox>
      <mesh position={[0, 0.37, 0]}><boxGeometry args={[0.1, 0.75, 0.1]} /><meshStandardMaterial color={C.ink} /></mesh>
      {/* monitor */}
      <RoundedBox args={[0.7, 0.45, 0.05]} radius={0.03} position={[0, 1.15, -0.1]}>
        <meshStandardMaterial color={C.lilacDeep} emissive={C.lilac} emissiveIntensity={0.25} />
      </RoundedBox>
      <mesh position={[0, 0.85, -0.1]}><boxGeometry args={[0.1, 0.18, 0.1]} /><meshStandardMaterial color={C.ink} /></mesh>
    </group>
  )
}

function Kitchen({ x, y }: { x: number; y: number }) {
  const steam = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (steam.current) {
      steam.current.children.forEach((c, i) => {
        const t = (s.clock.elapsedTime * 0.5 + i * 0.4) % 1
        c.position.y = 0.2 + t * 0.7
        ;(c as THREE.Mesh).scale.setScalar(0.12 * (1 - t) + 0.04)
        const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial
        m.opacity = 0.5 * (1 - t)
      })
    }
  })
  return (
    <group position={[x, y, BACK_Z + 0.6]}>
      {/* counter */}
      <RoundedBox args={[2.2, 0.9, 0.55]} radius={0.05} position={[0, 0.45, 0]}>
        <meshStandardMaterial color={C.blush} />
      </RoundedBox>
      {/* stove top */}
      <mesh position={[-0.5, 0.92, 0]}><boxGeometry args={[0.7, 0.05, 0.5]} /><meshStandardMaterial color={C.ink} /></mesh>
      {/* pot */}
      <mesh position={[-0.5, 1.05, 0]}><cylinderGeometry args={[0.18, 0.16, 0.18, 20]} /><meshStandardMaterial color={C.lilacDeep} /></mesh>
      {/* steam */}
      <group ref={steam} position={[-0.5, 1.1, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}><sphereGeometry args={[0.1, 10, 10]} /><meshStandardMaterial color={'#ffffff'} transparent opacity={0.4} /></mesh>
        ))}
      </group>
    </group>
  )
}

function Sunroom({ x, y }: { x: number; y: number }) {
  const sun = useRef<THREE.Mesh>(null)
  useFrame((s) => { if (sun.current) sun.current.position.y = 2.1 + Math.sin(s.clock.elapsedTime * 0.8) * 0.08 })
  return (
    <group position={[x, y, BACK_Z + 0.5]}>
      {/* plant pot */}
      <mesh position={[0.6, 0.3, 0.2]}><cylinderGeometry args={[0.22, 0.16, 0.4, 16]} /><meshStandardMaterial color={C.lilacDeep} /></mesh>
      <mesh position={[0.6, 0.75, 0.2]}><sphereGeometry args={[0.35, 16, 16]} /><meshStandardMaterial color={C.sage} /></mesh>
      {/* little sun */}
      <mesh ref={sun} position={[-0.6, 2.1, 0]}><sphereGeometry args={[0.3, 24, 24]} /><meshStandardMaterial color={C.sun} emissive={C.sun} emissiveIntensity={0.6} /></mesh>
      {/* armchair */}
      <RoundedBox args={[0.8, 0.5, 0.7]} radius={0.12} position={[-0.4, 0.35, 0.4]}>
        <meshStandardMaterial color={C.blush} />
      </RoundedBox>
      <RoundedBox args={[0.8, 0.6, 0.18]} radius={0.1} position={[-0.4, 0.7, 0.08]}>
        <meshStandardMaterial color={C.blush} />
      </RoundedBox>
    </group>
  )
}

// Hall: desk + clickable magazine + rug + pendant lamp
function Hall({ onOpenAbout }: { onOpenAbout: () => void }) {
  const lamp = useRef<THREE.Group>(null)
  const mag = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (lamp.current) lamp.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.9) * 0.06
    if (mag.current) mag.current.position.y = 0.92 + Math.sin(s.clock.elapsedTime * 1.4) * 0.015
  })
  const x = X.mid
  const y = GROUND_Y
  return (
    <group>
      {/* rug */}
      <mesh position={[x, y + 0.11, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.0, 32]} />
        <meshStandardMaterial color={C.lilac} />
      </mesh>
      {/* desk */}
      <group position={[x, y, BACK_Z + 0.7]}>
        <RoundedBox args={[1.5, 0.12, 0.7]} radius={0.04} position={[0, 0.82, 0]}>
          <meshStandardMaterial color={'#e7d7c9'} />
        </RoundedBox>
        <mesh position={[-0.6, 0.4, 0]}><boxGeometry args={[0.1, 0.82, 0.1]} /><meshStandardMaterial color={C.ink} /></mesh>
        <mesh position={[0.6, 0.4, 0]}><boxGeometry args={[0.1, 0.82, 0.1]} /><meshStandardMaterial color={C.ink} /></mesh>
        {/* clickable magazine */}
        <group
          ref={mag}
          position={[0, 0.92, 0.05]}
          onPointerDown={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onOpenAbout() }}
          onPointerOver={(e) => { e.stopPropagation(); cursor(true) }}
          onPointerOut={() => cursor(false)}
        >
          <RoundedBox args={[0.55, 0.04, 0.72]} radius={0.02}>
            <meshStandardMaterial color={C.blush} />
          </RoundedBox>
          <Text position={[0, 0.03, 0.02]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.08} color={C.lilacDeep} anchorX="center" anchorY="middle" maxWidth={0.5} textAlign="center">
            ABOUT THE OWNER
          </Text>
        </group>
      </group>
      {/* pendant lamp */}
      <group ref={lamp} position={[x, GROUND_Y + FLOOR_H, 0.6]}>
        <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[0.012, 0.012, 0.8, 8]} /><meshStandardMaterial color={C.ink} /></mesh>
        <mesh position={[0, -0.85, 0]}><coneGeometry args={[0.22, 0.3, 24, 1, true]} /><meshStandardMaterial color={C.sun} side={THREE.DoubleSide} emissive={C.sun} emissiveIntensity={0.4} /></mesh>
      </group>
    </group>
  )
}

// Roof + sign
function Roof() {
  return (
    <group>
      <mesh position={[0, 6.2 + 0.7, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.001, 0.001, 0.001]} />
        <meshStandardMaterial color={C.lilac} />
      </mesh>
      {/* triangular roof via extruded shape approximation: two slanted boxes */}
      <mesh position={[0, 6.9, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[6.4, 1.8, 4]} />
        <meshStandardMaterial color={C.lilacDeep} />
      </mesh>
      <Text position={[0, 6.7, FRONT_Z + 0.2]} fontSize={0.4} color={C.cream} anchorX="center" anchorY="middle">
        AnushkaLand
      </Text>
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
    <meshStandardMaterial ref={(r) => { if (r) matRefs.current[i] = r as THREE.MeshStandardMaterial }} color={C.cream} transparent opacity={1} />
  )
  return (
    <group ref={grp}>
      {/* big front wall covering whole house with a door hole in center-ground */}
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
      {/* windows hint on facade */}
      <mesh position={[X.left, 4.6, FRONT_Z + 0.06]}><boxGeometry args={[1.1, 1.1, 0.04]} /><meshStandardMaterial ref={(r)=>{if(r)matRefs.current[5]=r as THREE.MeshStandardMaterial}} color={C.blush} transparent opacity={1} /></mesh>
      <mesh position={[X.right, 4.6, FRONT_Z + 0.06]}><boxGeometry args={[1.1, 1.1, 0.04]} /><meshStandardMaterial ref={(r)=>{if(r)matRefs.current[6]=r as THREE.MeshStandardMaterial}} color={C.blush} transparent opacity={1} /></mesh>
      {/* door frame */}
      <mesh position={[X.mid, 1.4, FRONT_Z + 0.02]}><boxGeometry args={[1.5, 2.7, 0.06]} /><meshStandardMaterial ref={(r)=>{if(r)matRefs.current[3]=r as THREE.MeshStandardMaterial}} color={C.lilac} transparent opacity={1} /></mesh>
      {/* door (swings) */}
      <group ref={door} position={[X.mid - 0.6, 1.35, FRONT_Z + 0.05]}>
        <mesh
          position={[0.6, 0, 0]}
          onPointerDown={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); if (!entered) onEnterHall() }}
          onPointerOver={(e) => { e.stopPropagation(); if (!entered) cursor(true) }}
          onPointerOut={() => cursor(false)}
        >
          <boxGeometry args={[1.2, 2.4, 0.08]} />
          <meshStandardMaterial ref={(r)=>{if(r)matRefs.current[4]=r as THREE.MeshStandardMaterial}} color={C.lilacDeep} transparent opacity={1} />
        </mesh>
        <mesh position={[1.05, 0, 0.08]}><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color={C.sun} /></mesh>
      </group>
      {/* welcome mat text */}
      <Text position={[X.mid, 0.15, FRONT_Z + 1.0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.18} color={C.ink} anchorX="center" anchorY="middle">
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
    // subtle idle breathing on the look target
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
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 10, 8]} intensity={0.8} />
      <pointLight position={[0, 4, 6]} intensity={0.4} color={C.lilac} />

      {/* ground */}
      <mesh position={[0, -0.05, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color={C.sage} />
      </mesh>

      {/* room shells */}
      <Shell x={X.left} y={UPPER_Y} color={C.lilac} />   {/* library */}
      <Shell x={X.right} y={UPPER_Y} color={C.sage} />   {/* studio */}
      <Shell x={X.left} y={GROUND_Y} color={C.blush} />  {/* kitchen */}
      <Shell x={X.right} y={GROUND_Y} color={C.sun} />   {/* sunroom */}
      <Shell x={X.mid} y={GROUND_Y} color={C.cream} />   {/* hall */}
      <Shell x={X.mid} y={UPPER_Y} color={C.blush} />    {/* decor */}

      {/* labels */}
      <RoomLabel x={X.left} y={UPPER_Y} text="The Library" />
      <RoomLabel x={X.right} y={UPPER_Y} text="The Studio" />
      <RoomLabel x={X.left} y={GROUND_Y} text="The Kitchen" />
      <RoomLabel x={X.right} y={GROUND_Y} text="The Sunroom" />

      {/* decor center upper: heart window */}
      <mesh position={[X.mid, UPPER_Y + 1.5, BACK_Z + 0.1]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color={C.lilacDeep} />
      </mesh>

      {/* furniture */}
      <Bookshelf x={X.left} y={UPPER_Y} />
      <Desk x={X.right} y={UPPER_Y} />
      <Kitchen x={X.left} y={GROUND_Y} />
      <Sunroom x={X.right} y={GROUND_Y} />
      <Hall onOpenAbout={onOpenAbout} />

      {/* room hit zones (only active after entering) */}
      {entered && (
        <>
          <RoomHit x={X.left} y={UPPER_Y} active={view === 'library'} onClick={() => onSelectRoom('library')} />
          <RoomHit x={X.right} y={UPPER_Y} active={view === 'studio'} onClick={() => onSelectRoom('studio')} />
          <RoomHit x={X.left} y={GROUND_Y} active={view === 'kitchen'} onClick={() => onSelectRoom('kitchen')} />
          <RoomHit x={X.right} y={GROUND_Y} active={view === 'sunroom'} onClick={() => onSelectRoom('sunroom')} />
        </>
      )}

      <Roof />
      <Facade entered={entered} onEnterHall={onEnterHall} />
    </>
  )
}
