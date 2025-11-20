import { Box } from "@react-three/drei";
import { type ThreeEvent } from "@react-three/fiber";
import { type ColliderTypes } from "../types";

import { BackSide } from "three";
export const Collider = ({ clicked }: ColliderTypes) => {
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    clicked(e.point);
  };
  return (
    <>
      <Box position={[0, 2, 0]} scale={[11, 5.5, 2]} onClick={handleClick}>
        <meshStandardMaterial visible={false} side={BackSide} />
      </Box>
    </>
  );
};
