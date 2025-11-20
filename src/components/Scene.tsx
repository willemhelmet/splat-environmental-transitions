import { useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { dyno } from "@sparkjsdev/spark";
import { Vector3 } from "three";
import { gsap } from "gsap";

import { SparkRenderer } from "./SparkRenderer";
import { Collider } from "./Collider.tsx";
import { Splat } from "./Splat.tsx";

export const Scene = () => {
  const renderer = useThree((state) => state.gl);
  const sparkRendererArgs = useMemo(() => {
    return { renderer };
  }, [renderer]);

  const origin = useMemo(
    (): dyno.DynoVal<"vec3"> => dyno.dynoVec3(new Vector3(0, 0, 0)),
    [],
  );

  const splatUrls = [
    "ForestSponza.sog",
    "TechnoSponza.sog",
    "LibrarySponza.sog",
  ];
  const [activeSplat, setActiveSplat] = useState(0);

  const transitionProgress = useMemo(() => dyno.dynoFloat(1), []);
  const showingIndex = useMemo(() => dyno.dynoInt(0), []);
  const hidingIndex = useMemo(() => dyno.dynoInt(-1), []);

  function handleClick(point: Vector3) {
    // The splat groups are rotated 180 degrees on X, so we must apply the
    // inverse transformation to the world-space click point.
    const localPoint = point.clone();
    localPoint.y *= -1;
    localPoint.z *= -1;

    // WHP: I couldn't figure out how to use the SparkJS types,
    //      seems like it may be a bug on their end? `.value`
    //      is not understood to be a property of DynoVal.
    //      Not sure how to fix so I begrudgingly used "as any"

    // Instantly update the origin to the corrected local point
    (origin as any).value.copy(localPoint);

    // Tell the dyno shaders which splat is hiding and which is showing
    const nextActiveSplat = (activeSplat + 1) % splatUrls.length;
    (hidingIndex as any).value = activeSplat;
    (showingIndex as any).value = nextActiveSplat;

    // Stop any animation that's currently running on 'amount'
    gsap.killTweensOf(transitionProgress);
    (transitionProgress as any).value = 0;
    gsap.to(transitionProgress, {
      value: 1,
      duration: 2.5,
      ease: "power1.inOut", // Linear ease for constant velocity
    });

    // Update state for next click
    setActiveSplat(nextActiveSplat);
  }

  return (
    <>
      {/* <axesHelper /> */}
      <Collider clicked={handleClick} />
      <CameraControls
        azimuthAngle={Math.PI * 0.5}
        polarAngle={Math.PI * 0.45}
        distance={2}
        maxDistance={3}
      />
      <SparkRenderer args={[sparkRendererArgs]}>
        {splatUrls.map((url, index) => (
          <Splat
            origin={origin}
            transitionProgress={transitionProgress}
            myIndex={index}
            hidingIndex={hidingIndex}
            showingIndex={showingIndex}
            url={url}
            key={index}
          />
        ))}
      </SparkRenderer>
    </>
  );
};
