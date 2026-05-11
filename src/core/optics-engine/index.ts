import { roundTo } from "@/core/math-engine";

export type ConvexLensParameters = {
  focalLength: number;
  objectDistance: number;
  objectHeight: number;
};

export type LensImageResult = {
  imageDistance: number;
  magnification: number;
  imageHeight: number;
  imageNature: "real" | "virtual";
  orientation: "inverted" | "upright";
  atFocus: boolean;
};

export type OpticalPoint = {
  x: number;
  y: number;
};

export type RaySegment = {
  from: OpticalPoint;
  to: OpticalPoint;
  dashed?: boolean;
};

export type PrincipalRaySet = {
  parallelRay: RaySegment[];
  centralRay: RaySegment[];
  focalRay: RaySegment[];
};

export function solveConvexLensImage(
  parameters: ConvexLensParameters
): LensImageResult {
  const focalLength = Math.max(parameters.focalLength, 0.0001);
  const objectDistance = Math.max(parameters.objectDistance, 0.0001);
  const denominator = objectDistance - focalLength;

  if (Math.abs(denominator) < 0.0001) {
    return {
      imageDistance: Number.POSITIVE_INFINITY,
      magnification: Number.POSITIVE_INFINITY,
      imageHeight: Number.POSITIVE_INFINITY,
      imageNature: "real",
      orientation: "inverted",
      atFocus: true
    };
  }

  const imageDistance = (focalLength * objectDistance) / denominator;
  const magnification = -imageDistance / objectDistance;
  const imageHeight = magnification * parameters.objectHeight;

  return {
    imageDistance: roundTo(imageDistance, 2),
    magnification: roundTo(magnification, 3),
    imageHeight: roundTo(imageHeight, 2),
    imageNature: imageDistance > 0 ? "real" : "virtual",
    orientation: imageHeight < 0 ? "inverted" : "upright",
    atFocus: false
  };
}

export function createPrincipalRays(
  parameters: ConvexLensParameters,
  image: LensImageResult
): PrincipalRaySet {
  const top = { x: -parameters.objectDistance, y: parameters.objectHeight };
  const center = { x: 0, y: 0 };
  const nearFocus = { x: -parameters.focalLength, y: 0 };

  if (image.atFocus) {
    return {
      parallelRay: [
        { from: top, to: { x: 0, y: top.y } },
        { from: { x: 0, y: top.y }, to: { x: parameters.focalLength * 3, y: top.y } }
      ],
      centralRay: [{ from: top, to: { x: parameters.focalLength * 3, y: -top.y * 0.06 } }],
      focalRay: [
        { from: top, to: nearFocus },
        { from: center, to: { x: parameters.focalLength * 3, y: 0 } }
      ]
    };
  }

  const imageTop = { x: image.imageDistance, y: image.imageHeight };

  if (image.imageNature === "real") {
    return {
      parallelRay: [
        { from: top, to: { x: 0, y: top.y } },
        { from: { x: 0, y: top.y }, to: imageTop }
      ],
      centralRay: [{ from: top, to: imageTop }],
      focalRay: [
        { from: top, to: nearFocus },
        { from: center, to: { x: imageTop.x, y: top.y } }
      ]
    };
  }

  const refractedFromParallel = { x: parameters.focalLength * 2.4, y: -top.y * 0.55 };
  const refractedFromFocal = { x: parameters.focalLength * 2.4, y: top.y };

  return {
    parallelRay: [
      { from: top, to: { x: 0, y: top.y } },
      { from: { x: 0, y: top.y }, to: refractedFromParallel },
      { from: { x: 0, y: top.y }, to: imageTop, dashed: true }
    ],
    centralRay: [{ from: top, to: imageTop }],
    focalRay: [
      { from: top, to: nearFocus },
      { from: center, to: refractedFromFocal },
      { from: center, to: imageTop, dashed: true }
    ]
  };
}
