import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Scene } from "./Scene";

function App() {
  return (
    <>
      <div className="flex h-screen w-screen">
        <Canvas gl={{ antialias: false }} dpr={1}>
          <Scene />
          <color attach="background" args={[0, 0, 0]} />
        </Canvas>
        <Stats />
      </div>
    </>
  );
}

export default App;
