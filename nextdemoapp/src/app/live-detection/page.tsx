"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function MoodDetection() {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [mood, setMood] = useState("Loading...");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load Models on mount
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      console.log("✅ Models loaded");
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  // Start webcam after models loaded
  useEffect(() => {
    if (!modelsLoaded) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam", err);
      }
    };

    startVideo();
  }, [modelsLoaded]);

  // Live detection loop
  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(async () => {
      if (
        webcamRef.current &&
        webcamRef.current.readyState === 4
      ) {
        const video = webcamRef.current;

        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detection && detection.expressions) {
          const expressions = detection.expressions;
          const sorted = Object.entries(expressions).sort((a, b) => Number(b[1]) - Number(a[1]));

          if (typeof sorted[0][1] === "number" && sorted[0][1] > 0.01) {
            setMood(sorted[0][0]); // highest confidence mood
          } else {
            setMood("😐 No clear mood");
          }
        } else {
          setMood("😐 No face or expressions");
        }
      }
    }, 2000); // every 2 seconds

    return () => clearInterval(interval); // clean up on unmount
  }, [modelsLoaded]);

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold mb-4">Live Mood Detection</h1>
      <video
        ref={webcamRef}
        autoPlay
        muted
        playsInline
        width={1280}
        height={360}
        className="rounded border"
      />
      <p className="mt-4 text-xl">Detected Mood: <strong>{mood}</strong></p>
    </div>
  );
}
