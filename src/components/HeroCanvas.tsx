import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mouse move to influence scene
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      // You could use x,y to move camera or objects via a store or context.
      // For simplicity, we just log; in a real app you'd update a ref or state.
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[90vh] overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        camera={{ position: [0, 1.5, 3], fov: 60 }}
      >
        {/* Ambient light */}
        <ambientLight intensity={0.5} />
        {/* Directional light */}
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {/* A simple torus knot as placeholder; replace with your logo/model */}
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <meshStandardMaterial color="gold" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Optional controls for debugging */}
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
