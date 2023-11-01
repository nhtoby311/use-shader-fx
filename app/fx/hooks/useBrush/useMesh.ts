import * as THREE from "three";
import vertexShader from "./shader/main.vert";
import fragmentShader from "./shader/main.frag";
import { useMemo } from "react";
import { useResolution } from "../utils/useResolution";
import { useAddMesh } from "../utils/useAddMesh";
import { setUniform } from "../utils/setUniforms";

export const useMesh = (scene: THREE.Scene) => {
   const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
   const material = useMemo(
      () =>
         new THREE.ShaderMaterial({
            uniforms: {
               uMap: {
                  value: null,
               },
               uResolution: { value: new THREE.Vector2(0, 0) },
               uAspect: { value: 1 },
               uTexture: { value: new THREE.Texture() },
               uRadius: { value: 0.0 },
               uAlpha: { value: 0.0 },
               uSmudge: { value: 0.0 },
               uDissipation: { value: 0.0 },
               uMagnification: { value: 0.0 },
               uMotionBlur: { value: 0.0 },
               uMotionSample: { value: 10 },
               uMouse: { value: new THREE.Vector2(0, 0) },
               uPrevMouse: { value: new THREE.Vector2(0, 0) },
               uVelocity: { value: new THREE.Vector2(0, 0) },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
         }),
      []
   );

   const resolution = useResolution();
   setUniform(material, "uAspect", resolution.width / resolution.height);
   setUniform(material, "uResolution", resolution.clone());

   useAddMesh(scene, geometry, material);

   return material;
};
