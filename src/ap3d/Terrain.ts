import * as THREE from 'three';


export class Terrain {
  private mMesh?: THREE.Mesh;
  private mMaterial: THREE.MeshStandardMaterial;
  private mCenterUUT: THREE.Vector2 = new THREE.Vector2(0, 0);
  private mMatrix: number[][] = [[]];
  private mHorizontalDistance: number = 1;
  private mVerticalDistance: number = 1;

  // Callback to be invoked when terrain is ready
  public static onReadyCallback?: () => void;


  constructor(materialOptions?: THREE.MeshStandardMaterialParameters) {
    const aColor = 0xAE9B7D; // 0x88cc88
    this.mMaterial = new THREE.MeshStandardMaterial(
      Object.assign({ color: aColor, side: THREE.FrontSide }, materialOptions)
    );
  }
  //_______________________________________________________


  //_______________________________________________________
  /**
   * Build or replace the terrain mesh from a matrix of heights.
   * pData: number[][] - matrix with rows (z) and cols (x). Must be rectangular.
   * pHorizontalDistance: spacing between adjacent points in x and z.
   * pVerticalDistance: scale factor applied to height values.
   */
  public setTerrain(pData: number[][], pHorizontalDistance: number, pVerticalDistance: number, pCenterUUT: THREE.Vector2): void {
    let startTime = performance.now();
    this.mMatrix = pData;
    this.mHorizontalDistance = pHorizontalDistance;
    this.mVerticalDistance = pVerticalDistance;
    if (!pData || pData.length === 0 || !pData[0]) {
      throw new Error('pData must be a non-empty 2D array');
    }
    this.mCenterUUT = pCenterUUT.clone();
    const rows = pData.length;
    const cols = pData[0].length;
    for (let r = 1; r < rows; r++) {
      if (pData[r].length !== cols) throw new Error('All rows in pData must have the same length');
    }

    const vertexCount = rows * cols;
    const positions = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices: number[] = [];

    const width = (cols - 1) * pHorizontalDistance;
    const depth = (rows - 1) * pHorizontalDistance;
    const xOffset = width / 2;
    const zOffset = depth / 2;

    // fill positions & uvs
    let vi = 0;
    let ui = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = j * pHorizontalDistance - xOffset;
        const y = (pData[i][j] ?? 0) * pVerticalDistance;
        const z = i * pHorizontalDistance - zOffset;
        positions[vi] = x;
        positions[vi + 1] = y;
        positions[vi + 2] = z;
        normals[vi] = 0;
        normals[vi + 1] = 0;
        normals[vi + 2] = 0;
        uvs[ui] = cols > 1 ? j / (cols - 1) : 0;
        uvs[ui + 1] = rows > 1 ? i / (rows - 1) : 0;
        vi += 3;
        ui += 2;
      }
    }

    // build indices (two triangles per grid cell)
    for (let i = 0; i < rows - 1; i++) {
      for (let j = 0; j < cols - 1; j++) {
        const a = i * cols + j;
        const b = i * cols + (j + 1);
        const c = (i + 1) * cols + j;
        const d = (i + 1) * cols + (j + 1);
        // triangle a, c, b
        indices.push(a, c, b);
        // triangle b, c, d
        indices.push(b, c, d);
      }
    }

    // compute normals per face and add to vertex normals
    const pA = new THREE.Vector3();
    const pB = new THREE.Vector3();
    const pC = new THREE.Vector3();
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();
    for (let k = 0; k < indices.length; k += 3) {
      const ia = indices[k] * 3;
      const ib = indices[k + 1] * 3;
      const ic = indices[k + 2] * 3;

      pA.set(positions[ia], positions[ia + 1], positions[ia + 2]);
      pB.set(positions[ib], positions[ib + 1], positions[ib + 2]);
      pC.set(positions[ic], positions[ic + 1], positions[ic + 2]);

      cb.subVectors(pC, pB);
      ab.subVectors(pA, pB);
      cb.cross(ab);

      // accumulate into normals
      normals[ia] += cb.x;
      normals[ia + 1] += cb.y;
      normals[ia + 2] += cb.z;

      normals[ib] += cb.x;
      normals[ib + 1] += cb.y;
      normals[ib + 2] += cb.z;

      normals[ic] += cb.x;
      normals[ic + 1] += cb.y;
      normals[ic + 2] += cb.z;
    }

    // normalize normals
    for (let n = 0; n < vertexCount; n++) {
      const ni = n * 3;
      const nx = normals[ni];
      const ny = normals[ni + 1];
      const nz = normals[ni + 2];
      const len = Math.hypot(nx, ny, nz) || 1;
      normals[ni] = nx / len;
      normals[ni + 1] = ny / len;
      normals[ni + 2] = nz / len;
    }

    // create BufferGeometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();

    // clean up previous mesh
    if (this.mMesh) {
      this.mMesh.geometry.dispose();
      // keep material (user may supply custom options); create new material if different is desired
    }

    this.mMesh = new THREE.Mesh(geometry, this.mMaterial);
    this.mMesh.name = 'Terrain';
    this.mMesh.userData['itemId'] = 'Terrain';
    this.mMesh.receiveShadow = true;
    this.mMesh.castShadow = false;
    this.showTrainData();
    let endTime = performance.now();
    console.log(`Terrain generated in ${(endTime - startTime).toFixed(1)} ms`);
    if (Terrain.onReadyCallback) {
      Terrain.onReadyCallback();
    }
  }
  //_______________________________________________________

  /**
* Load a PNG image where each pixel's color encodes height (uses luminance).
* Creates a height matrix (rows = image height, cols = image width) and calls setTerrain.
*/
  public async loadFromImage(pUrl: string, pHorizontalDistance: number, pVerticalDistance: number, pCenterUUT: THREE.Vector2): Promise<void> {
    let startTime = performance.now();
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = pUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => { console.log(e); reject(new Error('Failed to load image: ' + String(e.toString))) };
    });

    const w = img.width <= 4000 ? img.width : 4000;
    const h = img.height <= 4000 ? img.height : 4000;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.drawImage(img, 0, 0, w, h);
    const imgData = ctx.getImageData(0, 0, w, h).data;

    const aMatrix: number[][] = new Array(h);
    for (let y = 0; y < h; y++) {
      const row: number[] = new Array(w);
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        // convert color to luminance (0..1)
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        row[x] = lum;
      }
      aMatrix[y] = row;
    }
    let endTime = performance.now();
    console.log(`Image loaded and processed in ${(endTime - startTime).toFixed(1)} ms`);
    this.setTerrain(aMatrix, pHorizontalDistance, pVerticalDistance, pCenterUUT.clone());
  }
  //_______________________________________________________

  private showTrainData(): void {
    if (!this.mMatrix || this.mMatrix.length === 0 || !this.mMatrix[0]) {
      console.log('No matrix data available');
      return;
    }
    const cols = this.mMatrix[0].length;
    const rows = this.mMatrix.length;
    console.log("Matrix order: " + cols + " X " + rows);
    console.log("MapSize: " + (cols * this.mHorizontalDistance).toFixed(1) + "m X " + (rows * this.mHorizontalDistance).toFixed(1) + "m");
    console.log("Real world Bounding rect (center): " + this.mCenterUUT.x.toFixed(1) + "m, " + this.mCenterUUT.y.toFixed(1) + "m");
    const aHalfWidth = (cols * this.mHorizontalDistance) / 2;
    const aHalfHeight = (rows * this.mHorizontalDistance) / 2;
    console.log("Real world Bounding rect (top): " + (this.mCenterUUT.x - aHalfWidth).toFixed(1) + "m, " + (this.mCenterUUT.y + aHalfHeight).toFixed(1) + "m");
    console.log("Real world Bounding rect (bottom): " + (this.mCenterUUT.x + aHalfWidth).toFixed(1) + "m, " + (this.mCenterUUT.y - aHalfHeight).toFixed(1) + "m");
  }
  //_______________________________________________________

  public getMesh(): THREE.Mesh | undefined {
    return this.mMesh;
  }
  //_______________________________________________________
  public heightAtPoint(x: number, z: number): number | null {
    if (!this.mMesh) return null;
    const position = this.mMesh.geometry.attributes.position as THREE.BufferAttribute;
    const vertexCount = position.count;
    let closestY: number | null = null;
    let closestDistSq = Infinity;
    for (let i = 0; i < vertexCount; i++) {
      const vx = position.getX(i);
      const vy = position.getY(i);
      const vz = position.getZ(i);
      const dx = vx - x;
      const dz = vz - z;
      const distSq = dx * dx + dz * dz;
      if (distSq < closestDistSq) {
        closestDistSq = distSq;
        closestY = vy;
      }
    }
    return closestY;
  }
  //_______________________________________________________

  public dispose(): void {
    if (this.mMesh) {
      this.mMesh.geometry.dispose();
      if (this.mMesh.material && (this.mMesh.material as THREE.Material).dispose) {
        (this.mMesh.material as THREE.Material).dispose();
      }
      this.mMesh = undefined;
    }
  }
}
