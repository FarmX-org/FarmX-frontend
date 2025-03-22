import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Sky } from "@react-three/drei";

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
      <Canvas camera={{ position: [20, 30, 160], fov: 60, near: 0.1 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <Sky sunPosition={[100, 20, 100]} turbidity={20} rayleigh={0.8} mieCoefficient={0.009} mieDirectionalG={0.99} />
        <Model />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};

export default Home;
