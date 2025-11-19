import { Box } from "@react-three/drei";
import { type ThreeEvent } from "@react-three/fiber";
// import { useControls } from "leva";
// {"pos":{"x":0,"y":2,"z":0}}
import { type ColliderTypes } from "../types";

import { BackSide } from "three";
export const Collider = ({ clicked }: ColliderTypes) => {
  // const leva = useControls({
  //   pos: {
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //   },
  //   scale: {
  //     x: 1,
  //     y: 1,
  //     z: 1,
  //   },
  // });
  // {"scale":{"x":11,"y":5.5,"z":2}}

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    clicked(e.point);
  };
  return (
    <>
      <directionalLight />
      <pointLight position={[0, 2, 0]} />

      <Box position={[0, 2, 0]} scale={[11, 5.5, 2]} onClick={handleClick}>
        <meshStandardMaterial visible={false} side={BackSide} />
      </Box>
    </>
  );
};
