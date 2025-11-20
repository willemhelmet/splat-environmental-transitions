import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Scene } from "./components/Scene";

function App() {
  return (
    <>
      <div className="flex h-screen w-screen">
        <Canvas gl={{ antialias: false }} dpr={1}>
          <Scene />
          <color attach="background" args={[0, 0, 0]} />
        </Canvas>
        <Loader />
      </div>
    </>
  );
}

export default App;
