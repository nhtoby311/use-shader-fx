"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Distortion } from "./Distortion";

export const DistortionCarousel = () => {
   return (
      <Canvas dpr={[1, 1.5]}>
         <Suspense fallback={null}>
            <Distortion />
         </Suspense>
      </Canvas>
   );
};
