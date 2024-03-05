import { useRef, useEffect } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);

      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  useEffect(() => {
    async function runCoco() {
      const net = await cocossd.load();
      console.log("Model loaded.");
      setInterval(() => {
        detect(net);
      }, 10);
    }

    runCoco();
  }, []);

  return (
    <div className="container">
      <header>
        <Webcam ref={webcamRef} muted={true} className="mainScreen1" />

        <canvas ref={canvasRef} className="mainScreen" />
      </header>
    </div>
  );
}

export default App;
