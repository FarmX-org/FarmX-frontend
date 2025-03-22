"use client"; 
import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";

const Model = () => {
  const { scene } = useGLTF("/images/scenewithanimal.glb"); 
  const router = useRouter();

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "Ground_barn_2_0") {
          child.userData.link = "/";
        }
      }
    });
  }, [scene]);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (event.intersections.length > 0) {
      const clickedObject = event.intersections[0].object;
      if (clickedObject.userData.link) {
        router.push(clickedObject.userData.link);
      }
    }
  };

  const handlePointerOver = () => {
    document.body.style.cursor = "grabbing";
  };

  const handlePointerUp = () => {
    document.body.style.cursor = "pointer";
  };

  return (
    <primitive
      object={scene}
      scale={[0.65, 0.65, 0.65]}
      position={[0, 4, 4]}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerUp={handlePointerUp}
    />
  );
};

export default Model;
