import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const LightRays = ({
                       raysOrigin = 'top-center-offset',
                       raysColor = '#0ea5e9',
                       raysSpeed = 0.8,
                       lightSpread = 0.8,
                       rayLength = 1.2,
                       followMouse = true,
                       mouseInfluence = 0.03,
                       noiseAmount = 0.1,
                       distortion = 0.005
                   }) => {
    const meshRef = useRef()
    const { mouse, viewport } = useThree()

    // Create gradient texture for the light rays
    const createGradientTexture = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const context = canvas.getContext('2d')

        const gradient = context.createLinearGradient(0, 0, 0, 256)
        gradient.addColorStop(0, raysColor)
        gradient.addColorStop(1, 'transparent')

        context.fillStyle = gradient
        context.fillRect(0, 0, 256, 256)

        return new THREE.CanvasTexture(canvas)
    }

    useFrame((state) => {
        if (!meshRef.current) return

        const time = state.clock.getElapsedTime() * raysSpeed

        // Mouse following effect
        if (followMouse) {
            meshRef.current.position.x = THREE.MathUtils.lerp(
                meshRef.current.position.x,
                mouse.x * viewport.width * mouseInfluence,
                0.1
            )
            meshRef.current.position.y = THREE.MathUtils.lerp(
                meshRef.current.position.y,
                mouse.y * viewport.height * mouseInfluence,
                0.1
            )
        }

        // Subtle animation
        meshRef.current.rotation.z = Math.sin(time * 0.5) * distortion
        meshRef.current.material.opacity = 0.6 + Math.sin(time * 0.8) * 0.2
    })

    return (
        <mesh ref={meshRef} position={[0, 0, -10]} scale={[lightSpread * 4, rayLength * 3, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                transparent
                opacity={0.7}
                map={createGradientTexture()}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    )
}

export default LightRays