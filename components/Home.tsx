import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Suspense } from "react";

const Model = dynamic(() => import("../components/Model"), { ssr: false });


const Home = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Canvas camera={{ position: [10, 15, 60], fov: 50, near: 0.05 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={1.0} />

        <Suspense fallback={<div>Loading...</div>}>
        <Model />
        </Suspense>

        <OrbitControls enableZoom enablePan enableRotate />
      </Canvas>
    </div>
  );
};

export default Home;
