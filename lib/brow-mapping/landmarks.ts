import { FaceMesh } from "@mediapipe/face_mesh";
import type { NormalizedLandmark } from "@mediapipe/face_mesh";

/** MediaPipe indices — subject's left/right (selfie view). */
export const FACE_LM = {
  midline: 168,
  forehead: 10,
  rightNostril: 98,
  leftNostril: 327,
  leftIris: 468,
  rightIris: 473,
  leftEyeOuter: 33,
  rightEyeOuter: 263,
  leftBrowUpper: [336, 296, 334, 293],
  rightBrowUpper: [107, 66, 105, 63],
  leftBrowInner: 285,
  rightBrowInner: 55,
} as const;

const MEDIAPIPE_BASE = "/mediapipe/face_mesh/";

let faceMeshPromise: Promise<FaceMesh> | null = null;

export function getFaceMeshClient(): Promise<FaceMesh> {
  if (!faceMeshPromise) {
    faceMeshPromise = (async () => {
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
    })();
  }
  return faceMeshPromise;
}

export async function detectFaceLandmarks(image: HTMLImageElement): Promise<NormalizedLandmark[] | null> {
  const faceMesh = await getFaceMeshClient();
  return new Promise((resolve, reject) => {
    let settled = false;
    faceMesh.onResults((results) => {
      if (settled) return;
      settled = true;
      resolve(results.multiFaceLandmarks?.[0] ?? null);
    });
    faceMesh.send({ image }).catch((err) => {
      if (!settled) {
        settled = true;
        reject(err);
      }
    });
  });
}

export type { NormalizedLandmark };
