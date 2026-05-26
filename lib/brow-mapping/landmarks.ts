import type { NormalizedLandmark } from "@mediapipe/face_mesh";

/**
 * MediaPipe Face Mesh — anatomical left/right (patient facing camera).
 * Patient LEFT brow = right side of photo (higher x). Patient RIGHT brow = left side of photo (lower x).
 */
export const FACE_LM = {
  midline: 168,
  forehead: 10,
  /** Patient's left brow zone */
  leftBrowInner: 285,
  leftBrowUpper: [336, 296, 334, 293],
  leftEyeOuter: 263,
  leftIris: 473,
  /** Patient's right brow zone */
  rightBrowInner: 55,
  rightBrowUpper: [107, 66, 105, 63],
  rightEyeOuter: 33,
  rightIris: 468,
} as const;

const MEDIAPIPE_BASE = "/mediapipe/face_mesh/";

type FaceMeshInstance = import("@mediapipe/face_mesh").FaceMesh;

let faceMeshPromise: Promise<FaceMeshInstance> | null = null;

async function loadFaceMesh(): Promise<FaceMeshInstance> {
  if (typeof window === "undefined") {
    throw new Error("FaceMesh is browser-only");
  }
  const { FaceMesh } = await import("@mediapipe/face_mesh");
  const faceMesh = new FaceMesh({
    locateFile: (file) => `${MEDIAPIPE_BASE}${file}`,
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.65,
    minTrackingConfidence: 0.65,
  });
  await faceMesh.initialize();
  return faceMesh;
}

export function getFaceMeshClient(): Promise<FaceMeshInstance> {
  if (!faceMeshPromise) {
    faceMeshPromise = loadFaceMesh();
  }
  return faceMeshPromise;
}

export async function detectFaceLandmarks(image: HTMLImageElement): Promise<NormalizedLandmark[] | null> {
  const faceMesh = await getFaceMeshClient();
  return new Promise((resolve, reject) => {
    let settled = false;
    const onResults = (results: { multiFaceLandmarks?: NormalizedLandmark[][] }) => {
      if (settled) return;
      settled = true;
      resolve(results.multiFaceLandmarks?.[0] ?? null);
    };
    faceMesh.onResults(onResults);
    faceMesh.send({ image }).catch((err) => {
      if (!settled) {
        settled = true;
        reject(err);
      }
    });
  });
}

export type { NormalizedLandmark };
