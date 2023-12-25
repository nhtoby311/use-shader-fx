import * as THREE from "three";
import { DomSyncerParams } from "..";
import { Size } from "@react-three/fiber";
import { setUniform } from "../../../utils/setUniforms";
import { DomSyncerMaterial } from "./createMesh";
import { useCallback, useRef } from "react";

type UpdateDomRect = ({
   params,
   size,
   resolutionRef,
   scene,
   isIntersectingRef,
}: {
   params: DomSyncerParams;
   size: Size;
   resolutionRef: React.MutableRefObject<THREE.Vector2>;
   scene: THREE.Scene;
   isIntersectingRef: React.MutableRefObject<boolean[]>;
}) => void;

type UseUpdateDomRectReturn = [DOMRect[], UpdateDomRect];

export const useUpdateDomRect = (): UseUpdateDomRectReturn => {
   const domRects = useRef<DOMRect[]>([]);

   const updateDomRects: UpdateDomRect = useCallback(
      ({ params, size, resolutionRef, scene, isIntersectingRef }) => {
         if (scene.children.length !== domRects.current!.length) {
            domRects.current = new Array(scene.children.length);
         }

         scene.children.forEach((mesh, i) => {
            const domElement = params.dom![i];
            if (!domElement) {
               throw new Error("DOM is null.");
            }

            if (isIntersectingRef.current[i]) {
               const rect = domElement.getBoundingClientRect();
               domRects.current[i] = rect;

               mesh.scale.set(rect.width, rect.height, 1.0);
               mesh.position.set(
                  rect.left + rect.width * 0.5 - size.width * 0.5,
                  -rect.top - rect.height * 0.5 + size.height * 0.5,
                  0.0
               );

               if (params.rotation![i]) {
                  mesh.rotation.copy(params.rotation![i]);
               }

               if (mesh instanceof THREE.Mesh) {
                  const material: DomSyncerMaterial = mesh.material;
                  setUniform(material, "u_texture", params.texture![i]);
                  setUniform(
                     material,
                     "u_textureResolution",
                     params.resolution![i]
                  );
                  setUniform(
                     material,
                     "u_resolution",
                     resolutionRef.current.set(rect.width, rect.height)
                  );
                  setUniform(
                     material,
                     "u_borderRadius",
                     params.boderRadius![i] ? params.boderRadius![i] : 0.0
                  );
               }
            }
         });
      },
      []
   );

   return [domRects.current, updateDomRects];
};
