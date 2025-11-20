import { useMemo } from "react";
import { SplatMesh, dyno } from "@sparkjsdev/spark";
import { type SponzaTypes } from "../types";

export const Splat = ({
  myIndex,
  origin,
  hidingIndex,
  showingIndex,
  transitionProgress,
  url,
}: SponzaTypes) => {
  const splat = useMemo(() => {
    const splatMesh = new SplatMesh({
      url: url,
      objectModifier: dyno.dynoBlock(
        { gsplat: dyno.Gsplat },
        { gsplat: dyno.Gsplat },
        ({ gsplat }) => {
          const myDyno = new dyno.Dyno({
            inTypes: {
              gsplat: dyno.Gsplat,
              origin: "vec3",
              myIndex: "int",
              hidingIndex: "int",
              showingIndex: "int",
              transitionProgress: "float",
            },
            outTypes: { gsplat: dyno.Gsplat },
            globals: () => [
              dyno.defineGsplat,
              dyno.unindent(`
                float getSphericalGlow(float dist, float radius, float thickness) {
                  float halfThickness = thickness / 2.0;
                  float band = smoothstep(radius - halfThickness, radius, dist) -
                              smoothstep(radius, radius + halfThickness, dist);
                  return band;
                }

                vec4 calculateColor(
                  vec4 initialColor,
                  vec3 pos,
                  vec3 origin,
                  float transitionProgress,
                  int myIndex,
                  int showingIndex,
                  int hidingIndex
                ) {
                  float dist = distance(pos, origin);
                  float radius = transitionProgress * 12.5;
                  float glowThickness = 0.5;
                  float glow = getSphericalGlow(dist, radius, glowThickness);
                  vec3 glowColor = vec3(0.0, 1.0, 1.0); // Cyan, change this to a gradient

                  vec3 finalRgb = initialColor.rgb + (glowColor * glow);

                  float visibility = step(dist, radius);

                  // Create "masks".
                  // casting boolean to float returns 1.0 for true, 0.0 for false.
                  float isShowing = float(myIndex == showingIndex);
                  float isHiding = float(myIndex == hidingIndex);

                  // Combine using math.
                  // If isShowing is 1.0, we add (visibility).
                  // If isHiding is 1.0, we add (1.0 - visibility).
                  // If neither (isShowing=0, isHiding=0), the result is 0.0.
                  float finalOpacity = (isShowing * visibility) + (isHiding * (1.0 - visibility));

                  return vec4(
                    finalRgb,
                    initialColor.a * finalOpacity
                  );
                }
              // vec3 calculateTranslation(
              //   vec3 pos,
              //   vec3 origin,
              //   float transitionProgress
              // ) {
              //   float displacementStrength = 0.2;
              //   vec3 displacementDirection = normalize(pos - origin);
              //   float dist = distance(pos, origin);
              //   float glowThickness = 0.4;
              //   float radius = transitionProgress * 12.5;
              //   float glow = getSphericalGlow(dist, radius, glowThickness);
              //   return pos + (displacementDirection * glow * displacementStrength);
              // }

              vec3 calculateScale(
                vec3 pos,
                vec3 scale,
                vec3 origin,
                float transitionProgress
              ) {
                float scaleStrength = 0.02;
                vec3 displacementDirection = normalize(pos - origin);
                float dist = distance(pos, origin);
                float glowThickness = 0.4;
                float radius = transitionProgress * 12.5;
                float glow = getSphericalGlow(dist, radius, glowThickness);
                return scale + (displacementDirection * glow * scaleStrength);
              }
              `),
            ],
            statements: ({ inputs, outputs }) =>
              dyno.unindentLines(`
                ${outputs.gsplat} = ${inputs.gsplat};
                ${outputs.gsplat}.rgba = calculateColor(
                  ${inputs.gsplat}.rgba,
                  ${inputs.gsplat}.center,
                  ${inputs.origin},
                  ${inputs.transitionProgress},
                  ${inputs.myIndex},
                  ${inputs.showingIndex},
                  ${inputs.hidingIndex}
                );
                // ${outputs.gsplat}.center = calculateTranslation(
                //   ${inputs.gsplat}.center,
                //   ${inputs.origin},
                //   ${inputs.transitionProgress}
                // );
                ${outputs.gsplat}.scales = calculateScale(
                  ${inputs.gsplat}.center,
                  ${inputs.gsplat}.scales,
                  ${inputs.origin},
                  ${inputs.transitionProgress}
                );
              `),
          });
          gsplat = myDyno.apply({
            gsplat,
            origin: origin,
            transitionProgress: transitionProgress,
            myIndex: dyno.dynoConst("int", myIndex),
            showingIndex: showingIndex,
            hidingIndex: hidingIndex,
          }).gsplat;
          return { gsplat };
        },
      ),
      onFrame({ mesh }) {
        mesh.updateVersion();
      },
    });
    return splatMesh;
  }, [transitionProgress, origin, myIndex, showingIndex, hidingIndex, url]);
  return (
    <>
      <group rotation={[Math.PI, 0, 0]}>
        <primitive object={splat} />
      </group>
    </>
  );
};
