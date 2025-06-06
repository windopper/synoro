import { StarData } from "@/app/data/starData";
import { Mesh } from "three";
import { useCallback, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";

export default function InvisibleStar({
  star,
  onClick,
}: {
  star: StarData;
  onClick: (star: StarData, position: { x: number; y: number }) => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const { gl } = useThree();
  const starSize = useMemo(() => {
    // Simplified size calculation
    const baseSizeFromMagnitude = Math.max(
      0.35,
      1.5 - star.apparentMagnitude * 0.2
    );
    return baseSizeFromMagnitude * star.size * 0.8; // Smaller overall size
  }, [star.apparentMagnitude, star.size]);

  const handleClick = useCallback(
    (event: any) => {
      event.stopPropagation();
      setClicked(true);
      setTimeout(() => setClicked(false), 200);

      // Get mouse position from the click event
      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      onClick(star, { x, y });
    },
    [star, onClick, gl]
  );

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[star.position.x, star.position.y, star.position.z]}
        onClick={handleClick}
      >
        <sphereGeometry args={[starSize, 8, 8]} />
        {/* gray */}
        <meshBasicMaterial color={"#262626"} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
