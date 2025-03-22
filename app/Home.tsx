"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three"; 
import { ThreeEvent } from "@react-three/fiber";
import {Sky} from "@react-three/drei";
const Model = () => {
  const { scene } = useGLTF("images/scenewithanimal.glb");
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
      scale={[.65, .65, .65]}
      position={[0, 4, 4]} 
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerUp={handlePointerUp}

    />
  );
};

const Home = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "fixed", top: 0, left: 0 }}>
      <Canvas 
        camera={{ position: [20, 30, 160], fov: 60 ,near: .1 }} 
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <Sky sunPosition={[100, 20, 100]} turbidity={20} rayleigh={.8} mieCoefficient={0.009} mieDirectionalG={0.99} />
        <Model />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};

export default Home;
