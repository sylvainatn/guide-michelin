import * as THREE from "three";

/**
 * Helpers de geometrie avec noms explicites (cf. contrainte : jamais B()/C()/S()
 * car ca cree des collisions de noms dans de gros fichiers).
 * Chaque helper retourne un Mesh pret a add() sur la scene.
 */

type Vec3 = [number, number, number];

export const mkBox = (
  size: Vec3,
  pos: Vec3,
  material: THREE.Material,
  opts: { castShadow?: boolean; receiveShadow?: boolean } = {},
): THREE.Mesh => {
  const geo = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(pos[0], pos[1], pos[2]);
  if (opts.castShadow) mesh.castShadow = true;
  if (opts.receiveShadow) mesh.receiveShadow = true;
  return mesh;
};

export const mkCyl = (
  radiusTop: number,
  radiusBottom: number,
  height: number,
  segments: number,
  pos: Vec3,
  material: THREE.Material,
  opts: { castShadow?: boolean; receiveShadow?: boolean } = {},
): THREE.Mesh => {
  const geo = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    segments,
  );
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(pos[0], pos[1], pos[2]);
  if (opts.castShadow) mesh.castShadow = true;
  if (opts.receiveShadow) mesh.receiveShadow = true;
  return mesh;
};

export const mkSph = (
  radius: number,
  widthSegments: number,
  heightSegments: number,
  pos: Vec3,
  material: THREE.Material,
  opts: { castShadow?: boolean } = {},
): THREE.Mesh => {
  const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(pos[0], pos[1], pos[2]);
  if (opts.castShadow) mesh.castShadow = true;
  return mesh;
};

/**
 * Dispose recursivement d'un noeud de scene Three.
 * Libere geometries, materiaux et textures associees.
 */
export const disposeObject = (root: THREE.Object3D): void => {
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material;
      const materials = Array.isArray(mat) ? mat : [mat];
      for (const m of materials) {
        if (!m) continue;
        Object.values(m).forEach((value) => {
          if (value && (value as THREE.Texture).isTexture) {
            (value as THREE.Texture).dispose();
          }
        });
        m.dispose();
      }
    }
  });
};
