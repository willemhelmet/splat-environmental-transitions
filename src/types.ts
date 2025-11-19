import { type dyno } from "@sparkjsdev/spark";
import { type Vector3 } from "three";

export interface SponzaTypes {
  myIndex: number;
  hidingIndex: dyno.DynoVal<"int">;
  showingIndex: dyno.DynoVal<"int">;
  origin: dyno.DynoVal<"vec3">;
  transitionProgress: dyno.DynoVal<"float">;
}

export interface ColliderTypes {
  clicked: (point: Vector3) => void;
}
