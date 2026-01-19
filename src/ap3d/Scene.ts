import * as THREE from 'three';
import { Item } from './Item';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Terrain } from './Terrain';

export class Scene {

  private mContainer: HTMLElement;
  private mScene: THREE.Scene;
  private mCamera: THREE.PerspectiveCamera;
  private mRenderer: THREE.WebGLRenderer;
  private mLight: THREE.DirectionalLight;
  private mControls?: OrbitControls;

  public static onClickCallback?: (item:Item,x:number,y:number,z:number) => void;

  constructor(container?: HTMLElement) {
    if (!container) {
      container = document.body;
    }
    this.mContainer = container;

    this.mScene = new THREE.Scene();
    this.mScene.background = new THREE.Color(0x202025);

    this.mCamera = new THREE.PerspectiveCamera(75, this.mContainer.clientWidth / this.mContainer.clientHeight, 0.1, 500000);
    this.mCamera.position.x = -300;
    this.mCamera.position.y = 500;
    this.mCamera.position.z = 350;

    this.mRenderer = new THREE.WebGLRenderer({ antialias: true });
    this.mRenderer.setSize(this.mContainer.clientWidth, this.mContainer.clientHeight);
    this.mContainer.appendChild(this.mRenderer.domElement);

    this.mControls = new OrbitControls(this.mCamera, this.mRenderer.domElement);
    this.mControls.enableDamping = true;
    this.mControls.dampingFactor = 0.05;

    this.mLight = new THREE.DirectionalLight(0xffffff, 1);
    this.mLight.position.set(5, 5, 5);
    this.mScene.add(this.mLight);

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize, false);
    this.initMouseEvents();
    this.renderLoop = this.renderLoop.bind(this);
    this.renderLoop();
  }
  //_______________________________________________________
  public addToScene(object: THREE.Object3D, position?: THREE.Vector3): void {
    if (position) {
      object.position.copy(position);
    }
    this.mScene.add(object);
  }

  //_______________________________________________________
  /**
   * Set the OrbitControls target (look-at) point. If controls are not available,
   * the camera will directly look at the provided point.
   */
  public setControlsLookAt(x: number, y: number, z: number): void {
    if (this.mControls) {
      this.mControls.target.set(x, y, z);
      this.mControls.update();
    } else {
      this.mCamera.lookAt(new THREE.Vector3(x, y, z));
    }
  }

  //_______________________________________________________
  /**
   * Set the OrbitControls look-at target from an Object3D's world position.
   */
  public setControlsLookAtObject(obj: THREE.Object3D): void {
    const pos = new THREE.Vector3();
    obj.getWorldPosition(pos);
    if (this.mControls) {
      this.mControls.target.copy(pos);
      this.mCamera.position.x = pos.x + 20;
      this.mCamera.position.y = pos.y + 30;
      this.mCamera.position.z = pos.z + 20;
      this.mControls.update();
    } else {
      this.mCamera.lookAt(pos);
    }
    console.log(`Scene: setControlsLookAtObject to ${pos.x}, ${pos.y}, ${pos.z}`);
  }
  //_______________________________________________________

  private onWindowResize() {
    this.mCamera.aspect = this.mContainer.clientWidth / this.mContainer.clientHeight;
    this.mCamera.updateProjectionMatrix();
    this.mRenderer.setSize(this.mContainer.clientWidth, this.mContainer.clientHeight);
  }
  //_______________________________________________________

  private renderLoop() {
    requestAnimationFrame(() => this.renderLoop());
    if(this.mCamera.position.y < 30) this.mCamera.position.y = 30; // prevent camera going under ground
    if (this.mControls) this.mControls.update();
    this.mRenderer.render(this.mScene, this.mCamera);
  }
  //_______________________________________________________

  // initialize mouse raycaster to detect objects under mouse pointer
  private initMouseEvents() {
    //this.mContainer.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    this.mContainer.addEventListener('click', (event) => this.onMouseClick(event), false);
  };
  //_______________________________________________________

  private onMouseClick(event: MouseEvent) {
    const aData = this.getObjectUnderMouse(event);
    console.log('Mouse click on object:', aData);
    if (Scene.onClickCallback && aData) {
      Scene.onClickCallback(aData.obj.userData['itemId'], aData.point.x, aData.point.y, aData.point.z);
    }
  }
  //_______________________________________________________

  private onMouseMove(event: MouseEvent) {
    const aData = this.getObjectUnderMouse(event);
    console.log('Mouse over object:', aData);
  }
  //________________________________________________________
  private getObjectUnderMouse(event: MouseEvent): {obj:THREE.Object3D,point:THREE.Vector3}|null {
    const intersect = this.getObjectUnderScreenCoord(event.clientX, event.clientY);
    if (intersect) {
      console.log('Intersected object:', intersect);
      let Obj = intersect.object
      while (Obj.parent && !(Obj.parent instanceof THREE.Scene)) {
        Obj = Obj.parent;
      }
      let returnObj = {obj: Obj, point: intersect.point};
      return returnObj;
    }
    return null;
  }
  //_______________________________________________________
  // Check colision under the screem cordinate (x, y)
  public getObjectUnderScreenCoord(x: number, y: number): THREE.Intersection | null {
    console.log('getObjectUnderScreenCoord', x, y);
    const mouse = new THREE.Vector2();
    // the container is not full screen aware
    x = x - this.mContainer.getBoundingClientRect().left;
    y = y - this.mContainer.getBoundingClientRect().top;
    mouse.x = (x / this.mContainer.clientWidth) * 2 - 1;
    mouse.y = -(y / this.mContainer.clientHeight) * 2 + 1;
    console.log('Normalized mouse coords', mouse.x, mouse.y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.mCamera);
    const intersects = raycaster.intersectObjects(this.mScene.children);
    return intersects.length > 0 ? intersects[0] : null;
  }
  //_______________________________________________________

  // Statistics display
  private mStatsEl?: HTMLDivElement;
  private mStatsRafId?: number;
  private mStatsLastTime = performance.now();
  private mStatsFrames = 0;
  private mStatsFps = 0;

  // ensure stats start once the page is loaded (or immediately if already loaded)
  private readonly mStatsStarter = (() => {
    const cb = () => this.startStats();
    if (document.readyState === 'complete') setTimeout(cb, 0);
    else window.addEventListener('load', cb, { once: true });
    return 0;
  })();

  private createStatsElement(): void {
    if (this.mStatsEl) return;
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.right = '0';
    el.style.top = '0';
    el.style.padding = '6px 8px';
    el.style.background = 'rgba(0,0,0,0.6)';
    el.style.color = '#0f0';
    el.style.font = '12px monospace';
    el.style.whiteSpace = 'pre';
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    // make container positioned so absolute stats position works
    try {
      const cs = getComputedStyle(this.mContainer);
      if (cs.position === 'static') this.mContainer.style.position = 'relative';
    } catch {
      /* ignore */
    }
    this.mContainer.appendChild(el);
    this.mStatsEl = el;
  }
  //_______________________________________________________

  private startStats(): void {
    if (this.mStatsRafId) return;
    this.createStatsElement();
    this.mStatsLastTime = performance.now();
    this.mStatsFrames = 0;
    const loop = () => {
      this.mStatsFrames++;
      const now = performance.now();
      const delta = now - this.mStatsLastTime;
      if (delta >= 250) {
        this.mStatsFps = Math.round((this.mStatsFrames * 1000) / delta);
        this.mStatsFrames = 0;
        this.mStatsLastTime = now;
        if (this.mStatsEl) {
          const info = this.mRenderer.info;
          this.mStatsEl.textContent =
            `FPS: ${this.mStatsFps}\n` +
            `Calls: ${info.render.calls}  Tris: ${info.render.triangles}\n` +
            `Geoms: ${info.memory.geometries}  Tex: ${info.memory.textures}`;
        }
      }
      this.mStatsRafId = requestAnimationFrame(loop);
    };
    this.mStatsRafId = requestAnimationFrame(loop);
  }

  private stopStats(): void {
    if (this.mStatsRafId) {
      cancelAnimationFrame(this.mStatsRafId);
      this.mStatsRafId = undefined;
    }
    if (this.mStatsEl && this.mStatsEl.parentElement) {
      this.mStatsEl.parentElement.removeChild(this.mStatsEl);
      this.mStatsEl = undefined;
    }
  }

  // try to stop stats on page unload to avoid leaks
  private readonly mStatsStopper = (() => {
    const cb = () => this.stopStats();
    window.addEventListener('beforeunload', cb, { once: true });
    return 0;
  })();
  //_______________________________________________________
  dispose() {
    window.removeEventListener('resize', this.onWindowResize, false);
    this.mRenderer.dispose();
    if (this.mControls) {
      this.mControls.dispose();
      this.mControls = undefined;
    }
  }
}