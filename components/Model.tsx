import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";

const MODEL_URL = "http://localhost:3000/api/model";

const Model = () => {
  const { scene } = useGLTF(MODEL_URL); 
  const router = useRouter();

  const optimizedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    optimizedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "Ground_barn_2_0") {
        child.userData.link = "/cropShowcase";
      }
      else if(child instanceof THREE.Mesh && child.name === "Cube029_wall_texture_0"){
        child.userData.link = "/store";
      }
      
    });
  }, [optimizedScene]);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    const clickedObject = event.intersections[0]?.object;
    if (clickedObject?.userData?.link) {
      router.push(clickedObject.userData.link);
    }
  };

  return (
    <primitive
      object={optimizedScene}
      scale={[0.2, 0.2, 0.2]}
      position={[0, 4, 4]}
      onPointerDown={handlePointerDown}
    />
  );
};

export default Model;
