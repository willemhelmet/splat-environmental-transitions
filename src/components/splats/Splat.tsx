import { useMemo } from "react";
import { SplatMesh, dyno } from "@sparkjsdev/spark";
import { type SponzaTypes } from "../../types";

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
                vec4 calculateOpacity(
                  vec4 initialColor,
                  vec3 pos,
                  vec3 origin,
                  float transitionProgress,
                  int myIndex,
                  int showingIndex,
                  int hidingIndex
                ) {
                  float visibility = step(distance(pos, origin), transitionProgress * 12.5);
                  float finalOpacity = 0.0;

                  if (myIndex == showingIndex) {
                    finalOpacity = visibility;
                  } else if (myIndex == hidingIndex) {
                    finalOpacity = 1.0 - visibility;
                  }

                  return vec4(
                    initialColor.rgb,
                    initialColor.a * finalOpacity
                  );
                }
              `),
            ],
            statements: ({ inputs, outputs }) =>
              dyno.unindentLines(`
                ${outputs.gsplat} = ${inputs.gsplat};
                ${outputs.gsplat}.rgba = calculateOpacity(
                  ${inputs.gsplat}.rgba,
                  ${inputs.gsplat}.center,
                  ${inputs.origin},
                  ${inputs.transitionProgress},
                  ${inputs.myIndex},
                  ${inputs.showingIndex},
                  ${inputs.hidingIndex}
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
