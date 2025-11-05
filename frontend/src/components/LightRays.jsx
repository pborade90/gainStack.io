// src/components/LightRays.jsx
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const LightRays = ({
                       count = 50,
                       color = '#415A77',
                       speed = 0.5,
                       radius = 3
                   }) => {
    const meshRef = useRef()
    const { mouse, viewport } = useThree()

    // Create rays geometry
    const geometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(count * 3 * 2)
        const colors = new Float32Array(count * 3 * 2)

        for (let i = 0; i < count; i++) {
            const i6 = i * 6
            const angle = (i / count) * Math.PI * 2
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius

            // Start position (inner circle)
            positions[i6] = x * 0.3
            positions[i6 + 1] = y * 0.3
            positions[i6 + 2] = 0

            // End position (outer circle)
            positions[i6 + 3] = x
            positions[i6 + 4] = y
            positions[i6 + 5] = 0

            // Colors
            const colorObj = new THREE.Color(color)
            colors[i6] = colorObj.r
            colors[i6 + 1] = colorObj.g
            colors[i6 + 2] = colorObj.b
            colors[i6 + 3] = colorObj.r * 0.3
            colors[i6 + 4] = colorObj.g * 0.3
            colors[i6 + 5] = colorObj.b * 0.3
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        return geometry
    }, [count, color, radius])

    useFrame((state) => {
        if (!meshRef.current) return

        const time = state.clock.getElapsedTime()

        // Gentle rotation and pulse
        meshRef.current.rotation.z = time * speed * 0.1
        meshRef.current.scale.setScalar(1 + Math.sin(time * speed) * 0.05)

        // Subtle mouse follow
        meshRef.current.position.x = THREE.MathUtils.lerp(
            meshRef.current.position.x,
            mouse.x * viewport.width * 0.1,
            0.1
        )
        meshRef.current.position.y = THREE.MathUtils.lerp(
            meshRef.current.position.y,
            mouse.y * viewport.height * 0.1,
            0.1
        )
    })

    return (
        <lineSegments ref={meshRef} geometry={geometry}>
            <lineBasicMaterial
                vertexColors
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </lineSegments>
    )
}

export default LightRays