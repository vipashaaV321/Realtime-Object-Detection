// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

import Webcam from "react-webcam";
import "./App.css";
import * as cocossd from '@tensorflow-models/coco-ssd'


import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {

    const net = await cocossd.load()
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;



      const obj = await net.detect(video);
      console.log(obj)
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");


      drawRect(obj, ctx)
    }
  };

  useEffect(() => { runCoco() }, []);

  return (



    <div className="container mx-auto">


      <Webcam
        ref={webcamRef}
        muted={true}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "100%",
          textAlign: "center",
          zindex: 9,
        }}


      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "100%",
          textAlign: "center",
          zindex: 8,
        }}


      />

    </div>














  );
}

export default App;
