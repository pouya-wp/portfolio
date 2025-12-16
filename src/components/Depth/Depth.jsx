'use client'
import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const DepthMaterial = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform sampler2D uDepthMap;
    uniform vec2 uMouse;
    uniform float uIntensity;
    varying vec2 vUv;

    void main() {
      vec4 depthDistortion = texture2D(uDepthMap, vUv);
      float parallaxMult = depthDistortion.r;
      vec2 parallax = uMouse * parallaxMult * uIntensity;
      vec4 original = texture2D(uTexture, vUv + parallax);
      gl_FragColor = original;
    }
  `
}

function Scene({ image, depth }) {
  const mesh = useRef()
  const { viewport } = useThree()

  const [texture, depthTexture] = useTexture([image, depth])

  const planeAspect = texture.image.width / texture.image.height
  const viewportAspect = viewport.width / viewport.height
  let scaleWidth, scaleHeight
  if (viewportAspect > planeAspect) {
    scaleWidth = viewport.width
    scaleHeight = viewport.width / planeAspect
  } else {
    scaleHeight = viewport.height
    scaleWidth = viewport.height * planeAspect
  }

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTexture: { value: texture },
        uDepthMap: { value: depthTexture },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uIntensity: { value: 0.003 }
      },
      vertexShader: DepthMaterial.vertexShader,
      fragmentShader: DepthMaterial.fragmentShader,
    }),
    [texture, depthTexture]
  )

  const mouse = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    if (mesh.current) {
      mesh.current.material.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
        mesh.current.material.uniforms.uMouse.value.x,
        mouse.current.x,
        0.05
      )
      mesh.current.material.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
        mesh.current.material.uniforms.uMouse.value.y,
        mouse.current.y,
        0.05
      )
    }
  })

  return (
    <mesh ref={mesh} scale={[scaleWidth, scaleHeight, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  )
}

export default function DepthBackground() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas>
        <Suspense fallback={null}>
          <Scene image="/images/bg11.png" depth="/images/bg11-depth11.png" />
        </Suspense>
      </Canvas>
    </div>
  )
}