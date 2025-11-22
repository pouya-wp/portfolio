'use client'

import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Image, Environment, useTexture } from '@react-three/drei'
import { easing } from 'maath'

// ---------------------------------------------------------
// بخش Utility (کلاس‌های مورد نیاز)
// ---------------------------------------------------------

class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius, ...args) {
    super(...args)
    let p = this.parameters
    let hw = p.width * 0.5
    let a = new THREE.Vector2(-hw, 0)
    let b = new THREE.Vector2(0, radius)
    let c = new THREE.Vector2(hw, 0)
    let ab = new THREE.Vector2().subVectors(a, b)
    let bc = new THREE.Vector2().subVectors(b, c)
    let ac = new THREE.Vector2().subVectors(a, c)
    let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)))
    let center = new THREE.Vector2(0, radius - r)
    let baseV = new THREE.Vector2().subVectors(a, center)
    let baseAngle = baseV.angle() - Math.PI * 0.5
    let arc = baseAngle * 2
    let uv = this.attributes.uv
    let pos = this.attributes.position
    let mainV = new THREE.Vector2()
    for (let i = 0; i < uv.count; i++) {
      let uvRatio = 1 - uv.getX(i)
      let y = pos.getY(i)
      mainV.copy(c).rotateAround(center, arc * uvRatio)
      pos.setXYZ(i, mainV.x, y, -mainV.y)
    }
    pos.needsUpdate = true
    this.computeVertexNormals()
  }
}

class MeshSineMaterial extends THREE.MeshBasicMaterial {
  constructor(parameters = {}) {
    super(parameters)
    this.setValues(parameters)
    this.time = { value: 0 }
  }
  onBeforeCompile(shader) {
    shader.uniforms.time = this.time
    shader.vertexShader = `
      uniform float time;
      ${shader.vertexShader}
    `
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 4.0, position.z);`
    )
  }
}

extend({ MeshSineMaterial, BentPlaneGeometry })

// ---------------------------------------------------------
// کامپوننت اصلی (اصلاح شده برای اسکرول اصلی)
// ---------------------------------------------------------

export default function Caro() {
  const containerRef = useRef(null)
  // این متغیر مقدار پیشرفت اسکرول در این سکشن را نگه می‌دارد (بین 0 تا 1)
  const scrollProgress = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const { top, height } = containerRef.current.getBoundingClientRect()
      const vh = window.innerHeight

      // محاسبه: چه مقدار از کانتینر رد شده است؟
      // وقتی top صفر است یعنی شروع شده، وقتی منفی می‌شود یعنی داریم پایین می‌رویم
      // ارتفاع موثر برای اسکرول برابر است با: ارتفاع کل منهای ارتفاع صفحه
      const scrollDist = height - vh
      let progress = -top / scrollDist

      // محدود کردن عدد بین 0 و 1
      progress = Math.max(0, Math.min(1, progress))
      scrollProgress.current = progress
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // محاسبه اولیه
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    // ارتفاع 400vh یعنی کاربر باید به اندازه 4 برابر ارتفاع صفحه اسکرول کند تا انیمیشن تمام شود
    <div ref={containerRef} style={{ height: '400vh', position: 'relative' }}>

      {/* بخش چسبنده (Sticky) که همیشه در دید کاربر می‌ماند */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <Canvas camera={{ position: [0, 0, 100], fov: 15 }} gl={{ alpha: true }}>
          <fog attach="fog" args={['#FFFFFF', 8.5, 12]} />
          {/* ارسال مقدار اسکرول به کامپوننت‌های سه بعدی */}
          <Rig rotation={[0, 0, 0.15]} scrollProgress={scrollProgress}>
            <Carousel />
          </Rig>

          <Banner position={[0, -0.15, 0]} scrollProgress={scrollProgress} />

          <Environment preset="dawn" blur={0.5} />
        </Canvas>
      </div>
    </div>
  )
}

function Rig({ children, scrollProgress, ...props }) {
  const ref = useRef()

  useFrame((state, delta) => {
    // چرخش بر اساس مقدار اسکرول اصلی صفحه
    // ضرب در Math.PI * 2 یعنی یک دور کامل در طول اسکرول
    const targetRotation = -scrollProgress.current * (Math.PI * 2)

    // نرم کردن حرکت (Lerp)
    easing.damp(ref.current.rotation, 'y', targetRotation, 0.2, delta)

    state.events.update()
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 10], 0.3, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return <group ref={ref} {...props}>{children}</group>
}

function Carousel({ radius = 1.4, count = 8 }) {
  return Array.from({ length: count }, (_, i) => (
    <Card
      key={i}
      url={`/img${Math.floor(i % 10) + 1}_.jpg`}
      position={[Math.sin((i / count) * Math.PI * 2) * radius, 0, Math.cos((i / count) * Math.PI * 2) * radius]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ))
}

function Card({ url, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const pointerOver = (e) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)

  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta)
    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta)
  })

  return (
    <Image ref={ref} url={url} transparent side={THREE.DoubleSide} onPointerOver={pointerOver} onPointerOut={pointerOut} {...props}>
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  )
}

function Banner({ scrollProgress, ...props }) {
  const ref = useRef()
  const texture = useTexture('/work_.png')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  // ذخیره مقدار قبلی اسکرول برای محاسبه سرعت
  const lastScroll = useRef(0)

  useFrame((state, delta) => {
    const currentScroll = scrollProgress.current
    // محاسبه سرعت اسکرول (Delta) به صورت دستی
    const scrollDelta = Math.abs(currentScroll - lastScroll.current)

    ref.current.material.time.value += scrollDelta * 20 // سرعت انیمیشن موج
    ref.current.material.map.offset.x += delta / 2 // چرخش مداوم بنر

    lastScroll.current = currentScroll
  })

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.14, 128, 16, true]} />
      <meshSineMaterial map={texture} map-anisotropy={16} map-repeat={[30, 1]} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}