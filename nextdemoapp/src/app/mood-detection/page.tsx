// "use client";
// import { useEffect, useState, useRef } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "face-api.js";

// export default function MoodDetection() {
//   const webcamRef = useRef<Webcam>(null);
//   const [mood, setMood] = useState("Neutral");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = "/models";
//       await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//       await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
//       console.log("Face expression model loaded");
//       setLoading(false);
//     };
//     loadModels();
//   }, []);

//   const detectMood = async () => {
//     if (
//       webcamRef.current &&
//       webcamRef.current.video &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       const video = webcamRef.current.video as HTMLVideoElement;
//       const detection = await faceapi
//         .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceExpressions();

//       if (detection && detection.expressions) {
//         const sorted = Object.entries(detection.expressions).sort(
//           (a, b) => Number(b[1]) - Number(a[1])
//         );
//         const dominantMood = sorted[0][0];
//         setMood(dominantMood);
//       } else {
//         console.warn('Face detected, but no expressions found.');
//       }
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-500">
//         <h1 className="text-3xl font-bold mb-6">Mood Detection in Real Time</h1>
//         {loading ? (
//           <p>Loading Models...</p>
//         ) : (
//           <>
//             <Webcam
//               ref={webcamRef}
//               audio={false}
//               width={520}
//               height={340}
//               screenshotFormat="image/jpeg"
//               classID="rounded border"
//             />
//             <button
//               onClick={detectMood}
//               className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Detect Mood
//             </button>
//             <p className="mt-4 text-xl">
//               Detected Mood : <strong>{mood}</strong>
//             </p>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

export default function MoodDetection() {
  const webcamRef = useRef<Webcam>(null);
  const [mood, setMood] = useState("No mood detected");

  // Load models once when component mounts
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("✅ Models loaded");
      } catch (error) {
        console.error("❌ Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  const detectMood = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detection?.expressions) {
        const expressions = detection.expressions;
        const sorted = Object.entries(expressions).sort(
          (a, b) => Number(b[1]) - Number(a[1])
        );
        const topExpression = sorted[0][0];
        setMood(topExpression);
        console.log("👍 Mood detected:", topExpression);
      } else {
        console.warn("😐 Face detected but no expressions found.");
        setMood("Face detected but no expressions");
      }
    } else {
      console.warn("📷 Webcam not ready");
      setMood("Webcam not ready");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-500 p-6">
      <h1 className="text-3xl font-bold mb-6">😊 Mood Detection App</h1>

      <Webcam
        ref={webcamRef}
        width={320}
        height={240}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded shadow border"
      />

      <button
        onClick={detectMood}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Detect Mood
      </button>

      <p className="mt-4 text-lg">
        <strong>Detected Mood:</strong> {mood}
      </p>
    </div>
  );
}
