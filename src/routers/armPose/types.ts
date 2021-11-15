import { ArmPose } from "../sessions/types";

export class ArmPoseData {
  [ArmPose.ArmsCrossed]: number;
  [ArmPose.Error]: number;
  [ArmPose.HandsOnFace]: number;
  [ArmPose.HandsRaised]: number;
  [ArmPose.Other]: number;

  constructor(data: any) {
    this[ArmPose.ArmsCrossed] = data[ArmPose.ArmsCrossed];
    this[ArmPose.Error] = data[ArmPose.Error];
    this[ArmPose.HandsOnFace] = data[ArmPose.HandsOnFace];
    this[ArmPose.HandsRaised] = data[ArmPose.HandsRaised];
    this[ArmPose.Other] = data[ArmPose.Other];
  }
}

export type ArmPoseStats = {
  avg?: number;
  max?: number;
  min?: number;
};
