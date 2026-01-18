var Ke = Object.defineProperty;
var Be = (h, e, t) => e in h ? Ke(h, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : h[e] = t;
var S = (h, e, t) => Be(h, typeof e != "symbol" ? e + "" : e, t);
import * as A from "three";
import { Controls as ze, Vector3 as I, MOUSE as V, TOUCH as z, Quaternion as se, Spherical as Te, Vector2 as O, Ray as Ve, Plane as Xe, MathUtils as De, TrianglesDrawMode as Ye, TriangleFanDrawMode as ue, TriangleStripDrawMode as Ie, Loader as We, LoaderUtils as q, FileLoader as Ne, MeshPhysicalMaterial as j, Color as B, LinearSRGBColorSpace as v, SRGBColorSpace as J, SpotLight as Ze, PointLight as qe, DirectionalLight as Qe, Matrix4 as ne, InstancedMesh as $e, InstancedBufferAttribute as Je, Object3D as Oe, TextureLoader as et, ImageBitmapLoader as tt, BufferAttribute as ie, InterleavedBuffer as st, InterleavedBufferAttribute as nt, LinearMipmapLinearFilter as ke, NearestMipmapLinearFilter as it, LinearMipmapNearestFilter as ot, NearestMipmapNearestFilter as rt, LinearFilter as de, NearestFilter as Fe, RepeatWrapping as me, MirroredRepeatWrapping as at, ClampToEdgeWrapping as ct, PointsMaterial as ht, Material as oe, LineBasicMaterial as lt, MeshStandardMaterial as He, DoubleSide as ut, MeshBasicMaterial as Z, PropertyBinding as dt, BufferGeometry as mt, SkinnedMesh as ft, Mesh as pt, LineSegments as gt, Line as _t, LineLoop as Tt, Points as yt, Group as re, PerspectiveCamera as Et, OrthographicCamera as bt, Skeleton as St, AnimationClip as Rt, Bone as xt, InterpolateDiscrete as wt, InterpolateLinear as je, Texture as ye, VectorKeyframeTrack as Ee, NumberKeyframeTrack as be, QuaternionKeyframeTrack as Se, ColorManagement as Re, FrontSide as Mt, Interpolant as At, Box3 as Lt, Sphere as Ct } from "three";
const xe = { type: "change" }, _e = { type: "start" }, ve = { type: "end" }, te = new Ve(), we = new Xe(), Pt = Math.cos(70 * De.DEG2RAD), L = new I(), N = 2 * Math.PI, x = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, ae = 1e-6;
class Dt extends ze {
  /**
   * Constructs a new controls instance.
   *
   * @param {Object3D} object - The object that is managed by the controls.
   * @param {?HTMLElement} domElement - The HTML element used for event listeners.
   */
  constructor(e, t = null) {
    super(e, t), this.state = x.NONE, this.target = new I(), this.cursor = new I(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: V.ROTATE, MIDDLE: V.DOLLY, RIGHT: V.PAN }, this.touches = { ONE: z.ROTATE, TWO: z.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new I(), this._lastQuaternion = new se(), this._lastTargetPosition = new I(), this._quat = new se().setFromUnitVectors(e.up, new I(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new Te(), this._sphericalDelta = new Te(), this._scale = 1, this._panOffset = new I(), this._rotateStart = new O(), this._rotateEnd = new O(), this._rotateDelta = new O(), this._panStart = new O(), this._panEnd = new O(), this._panDelta = new O(), this._dollyStart = new O(), this._dollyEnd = new O(), this._dollyDelta = new O(), this._dollyDirection = new I(), this._mouse = new O(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = Nt.bind(this), this._onPointerDown = It.bind(this), this._onPointerUp = Ot.bind(this), this._onContextMenu = Gt.bind(this), this._onMouseWheel = Ht.bind(this), this._onKeyDown = jt.bind(this), this._onTouchStart = vt.bind(this), this._onTouchMove = Ut.bind(this), this._onMouseDown = kt.bind(this), this._onMouseMove = Ft.bind(this), this._interceptControlDown = Kt.bind(this), this._interceptControlUp = Bt.bind(this), this.domElement !== null && this.connect(this.domElement), this.update();
  }
  connect(e) {
    super.connect(e), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, { passive: !0, capture: !0 }), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  /**
   * Get the current vertical rotation, in radians.
   *
   * @return {number} The current vertical rotation, in radians.
   */
  getPolarAngle() {
    return this._spherical.phi;
  }
  /**
   * Get the current horizontal rotation, in radians.
   *
   * @return {number} The current horizontal rotation, in radians.
   */
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  /**
   * Returns the distance from the camera to the target.
   *
   * @return {number} The distance from the camera to the target.
   */
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  /**
   * Adds key event listeners to the given DOM element.
   * `window` is a recommended argument for using this method.
   *
   * @param {HTMLElement} domElement - The DOM element
   */
  listenToKeyEvents(e) {
    e.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = e;
  }
  /**
   * Removes the key event listener previously defined with `listenToKeyEvents()`.
   */
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  /**
   * Save the current state of the controls. This can later be recovered with `reset()`.
   */
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  /**
   * Reset the controls to their state from either the last time the `saveState()`
   * was called, or the initial state.
   */
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(xe), this.update(), this.state = x.NONE;
  }
  update(e = null) {
    const t = this.object.position;
    L.copy(t).sub(this.target), L.applyQuaternion(this._quat), this._spherical.setFromVector3(L), this.autoRotate && this.state === x.NONE && this._rotateLeft(this._getAutoRotationAngle(e)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let n = this.minAzimuthAngle, s = this.maxAzimuthAngle;
    isFinite(n) && isFinite(s) && (n < -Math.PI ? n += N : n > Math.PI && (n -= N), s < -Math.PI ? s += N : s > Math.PI && (s -= N), n <= s ? this._spherical.theta = Math.max(n, Math.min(s, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + s) / 2 ? Math.max(n, this._spherical.theta) : Math.min(s, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let i = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const o = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), i = o != this._spherical.radius;
    }
    if (L.setFromSpherical(this._spherical), L.applyQuaternion(this._quatInverse), t.copy(this.target).add(L), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let o = null;
      if (this.object.isPerspectiveCamera) {
        const a = L.length();
        o = this._clampDistance(a * this._scale);
        const r = a - o;
        this.object.position.addScaledVector(this._dollyDirection, r), this.object.updateMatrixWorld(), i = !!r;
      } else if (this.object.isOrthographicCamera) {
        const a = new I(this._mouse.x, this._mouse.y, 0);
        a.unproject(this.object);
        const r = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), i = r !== this.object.zoom;
        const c = new I(this._mouse.x, this._mouse.y, 0);
        c.unproject(this.object), this.object.position.sub(c).add(a), this.object.updateMatrixWorld(), o = L.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      o !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position) : (te.origin.copy(this.object.position), te.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(te.direction)) < Pt ? this.object.lookAt(this.target) : (we.setFromNormalAndCoplanarPoint(this.object.up, this.target), te.intersectPlane(we, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const o = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), o !== this.object.zoom && (this.object.updateProjectionMatrix(), i = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, i || this._lastPosition.distanceToSquared(this.object.position) > ae || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > ae || this._lastTargetPosition.distanceToSquared(this.target) > ae ? (this.dispatchEvent(xe), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(e) {
    return e !== null ? N / 60 * this.autoRotateSpeed * e : N / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(e) {
    const t = Math.abs(e * 0.01);
    return Math.pow(0.95, this.zoomSpeed * t);
  }
  _rotateLeft(e) {
    this._sphericalDelta.theta -= e;
  }
  _rotateUp(e) {
    this._sphericalDelta.phi -= e;
  }
  _panLeft(e, t) {
    L.setFromMatrixColumn(t, 0), L.multiplyScalar(-e), this._panOffset.add(L);
  }
  _panUp(e, t) {
    this.screenSpacePanning === !0 ? L.setFromMatrixColumn(t, 1) : (L.setFromMatrixColumn(t, 0), L.crossVectors(this.object.up, L)), L.multiplyScalar(e), this._panOffset.add(L);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(e, t) {
    const n = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const s = this.object.position;
      L.copy(s).sub(this.target);
      let i = L.length();
      i *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * i / n.clientHeight, this.object.matrix), this._panUp(2 * t * i / n.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / n.clientWidth, this.object.matrix), this._panUp(t * (this.object.top - this.object.bottom) / this.object.zoom / n.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
  }
  _dollyOut(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _dollyIn(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _updateZoomParameters(e, t) {
    if (!this.zoomToCursor)
      return;
    this._performCursorZoom = !0;
    const n = this.domElement.getBoundingClientRect(), s = e - n.left, i = t - n.top, o = n.width, a = n.height;
    this._mouse.x = s / o * 2 - 1, this._mouse.y = -(i / a) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(e) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, e));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(e) {
    this._rotateStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownDolly(e) {
    this._updateZoomParameters(e.clientX, e.clientX), this._dollyStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownPan(e) {
    this._panStart.set(e.clientX, e.clientY);
  }
  _handleMouseMoveRotate(e) {
    this._rotateEnd.set(e.clientX, e.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const t = this.domElement;
    this._rotateLeft(N * this._rotateDelta.x / t.clientHeight), this._rotateUp(N * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(e) {
    this._dollyEnd.set(e.clientX, e.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(e) {
    this._panEnd.set(e.clientX, e.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(e) {
    this._updateZoomParameters(e.clientX, e.clientY), e.deltaY < 0 ? this._dollyIn(this._getZoomScale(e.deltaY)) : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)), this.update();
  }
  _handleKeyDown(e) {
    let t = !1;
    switch (e.code) {
      case this.keys.UP:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(N * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), t = !0;
        break;
      case this.keys.BOTTOM:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(-N * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), t = !0;
        break;
      case this.keys.LEFT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(N * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), t = !0;
        break;
      case this.keys.RIGHT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(-N * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), t = !0;
        break;
    }
    t && (e.preventDefault(), this.update());
  }
  _handleTouchStartRotate(e) {
    if (this._pointers.length === 1)
      this._rotateStart.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e), n = 0.5 * (e.pageX + t.x), s = 0.5 * (e.pageY + t.y);
      this._rotateStart.set(n, s);
    }
  }
  _handleTouchStartPan(e) {
    if (this._pointers.length === 1)
      this._panStart.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e), n = 0.5 * (e.pageX + t.x), s = 0.5 * (e.pageY + t.y);
      this._panStart.set(n, s);
    }
  }
  _handleTouchStartDolly(e) {
    const t = this._getSecondPointerPosition(e), n = e.pageX - t.x, s = e.pageY - t.y, i = Math.sqrt(n * n + s * s);
    this._dollyStart.set(0, i);
  }
  _handleTouchStartDollyPan(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e);
  }
  _handleTouchStartDollyRotate(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e);
  }
  _handleTouchMoveRotate(e) {
    if (this._pointers.length == 1)
      this._rotateEnd.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e), s = 0.5 * (e.pageX + n.x), i = 0.5 * (e.pageY + n.y);
      this._rotateEnd.set(s, i);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const t = this.domElement;
    this._rotateLeft(N * this._rotateDelta.x / t.clientHeight), this._rotateUp(N * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(e) {
    if (this._pointers.length === 1)
      this._panEnd.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e), n = 0.5 * (e.pageX + t.x), s = 0.5 * (e.pageY + t.y);
      this._panEnd.set(n, s);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(e) {
    const t = this._getSecondPointerPosition(e), n = e.pageX - t.x, s = e.pageY - t.y, i = Math.sqrt(n * n + s * s);
    this._dollyEnd.set(0, i), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const o = (e.pageX + t.x) * 0.5, a = (e.pageY + t.y) * 0.5;
    this._updateZoomParameters(o, a);
  }
  _handleTouchMoveDollyPan(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e);
  }
  _handleTouchMoveDollyRotate(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e);
  }
  // pointers
  _addPointer(e) {
    this._pointers.push(e.pointerId);
  }
  _removePointer(e) {
    delete this._pointerPositions[e.pointerId];
    for (let t = 0; t < this._pointers.length; t++)
      if (this._pointers[t] == e.pointerId) {
        this._pointers.splice(t, 1);
        return;
      }
  }
  _isTrackingPointer(e) {
    for (let t = 0; t < this._pointers.length; t++)
      if (this._pointers[t] == e.pointerId) return !0;
    return !1;
  }
  _trackPointer(e) {
    let t = this._pointerPositions[e.pointerId];
    t === void 0 && (t = new O(), this._pointerPositions[e.pointerId] = t), t.set(e.pageX, e.pageY);
  }
  _getSecondPointerPosition(e) {
    const t = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[t];
  }
  //
  _customWheelEvent(e) {
    const t = e.deltaMode, n = {
      clientX: e.clientX,
      clientY: e.clientY,
      deltaY: e.deltaY
    };
    switch (t) {
      case 1:
        n.deltaY *= 16;
        break;
      case 2:
        n.deltaY *= 100;
        break;
    }
    return e.ctrlKey && !this._controlActive && (n.deltaY *= 10), n;
  }
}
function It(h) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(h.pointerId), this.domElement.ownerDocument.addEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(h) && (this._addPointer(h), h.pointerType === "touch" ? this._onTouchStart(h) : this._onMouseDown(h)));
}
function Nt(h) {
  this.enabled !== !1 && (h.pointerType === "touch" ? this._onTouchMove(h) : this._onMouseMove(h));
}
function Ot(h) {
  switch (this._removePointer(h), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(h.pointerId), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(ve), this.state = x.NONE;
      break;
    case 1:
      const e = this._pointers[0], t = this._pointerPositions[e];
      this._onTouchStart({ pointerId: e, pageX: t.x, pageY: t.y });
      break;
  }
}
function kt(h) {
  let e;
  switch (h.button) {
    case 0:
      e = this.mouseButtons.LEFT;
      break;
    case 1:
      e = this.mouseButtons.MIDDLE;
      break;
    case 2:
      e = this.mouseButtons.RIGHT;
      break;
    default:
      e = -1;
  }
  switch (e) {
    case V.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(h), this.state = x.DOLLY;
      break;
    case V.ROTATE:
      if (h.ctrlKey || h.metaKey || h.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(h), this.state = x.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(h), this.state = x.ROTATE;
      }
      break;
    case V.PAN:
      if (h.ctrlKey || h.metaKey || h.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(h), this.state = x.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(h), this.state = x.PAN;
      }
      break;
    default:
      this.state = x.NONE;
  }
  this.state !== x.NONE && this.dispatchEvent(_e);
}
function Ft(h) {
  switch (this.state) {
    case x.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(h);
      break;
    case x.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(h);
      break;
    case x.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(h);
      break;
  }
}
function Ht(h) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== x.NONE || (h.preventDefault(), this.dispatchEvent(_e), this._handleMouseWheel(this._customWheelEvent(h)), this.dispatchEvent(ve));
}
function jt(h) {
  this.enabled !== !1 && this._handleKeyDown(h);
}
function vt(h) {
  switch (this._trackPointer(h), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case z.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(h), this.state = x.TOUCH_ROTATE;
          break;
        case z.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(h), this.state = x.TOUCH_PAN;
          break;
        default:
          this.state = x.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case z.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(h), this.state = x.TOUCH_DOLLY_PAN;
          break;
        case z.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(h), this.state = x.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = x.NONE;
      }
      break;
    default:
      this.state = x.NONE;
  }
  this.state !== x.NONE && this.dispatchEvent(_e);
}
function Ut(h) {
  switch (this._trackPointer(h), this.state) {
    case x.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(h), this.update();
      break;
    case x.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(h), this.update();
      break;
    case x.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(h), this.update();
      break;
    case x.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(h), this.update();
      break;
    default:
      this.state = x.NONE;
  }
}
function Gt(h) {
  this.enabled !== !1 && h.preventDefault();
}
function Kt(h) {
  h.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function Bt(h) {
  h.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
class zt {
  constructor(e) {
    S(this, "mContainer");
    S(this, "mScene");
    S(this, "mCamera");
    S(this, "mRenderer");
    S(this, "mLight");
    S(this, "mControls");
    //_______________________________________________________
    S(this, "mStatsEl");
    S(this, "mStatsRafId");
    S(this, "mStatsLastTime", performance.now());
    S(this, "mStatsFrames", 0);
    S(this, "mStatsFps", 0);
    // ensure stats start once the page is loaded (or immediately if already loaded)
    S(this, "mStatsStarter", (() => {
      const e = () => this.startStats();
      return document.readyState === "complete" ? setTimeout(e, 0) : window.addEventListener("load", e, { once: !0 }), 0;
    })());
    // try to stop stats on page unload to avoid leaks
    S(this, "mStatsStopper", (() => {
      const e = () => this.stopStats();
      return window.addEventListener("beforeunload", e, { once: !0 }), 0;
    })());
    e || (e = document.body), this.mContainer = e, this.mScene = new A.Scene(), this.mScene.background = new A.Color(2105381), this.mCamera = new A.PerspectiveCamera(75, this.mContainer.clientWidth / this.mContainer.clientHeight, 0.1, 5e5), this.mCamera.position.z = 15, this.mCamera.position.y = 70, this.mCamera.position.x = 43, this.mRenderer = new A.WebGLRenderer({ antialias: !0 }), this.mRenderer.setSize(this.mContainer.clientWidth, this.mContainer.clientHeight), this.mContainer.appendChild(this.mRenderer.domElement), this.mControls = new Dt(this.mCamera, this.mRenderer.domElement), this.mControls.enableDamping = !0, this.mControls.dampingFactor = 0.05, this.mLight = new A.DirectionalLight(16777215, 1), this.mLight.position.set(5, 5, 5), this.mScene.add(this.mLight), this.onWindowResize = this.onWindowResize.bind(this), window.addEventListener("resize", this.onWindowResize, !1), this.animate = this.animate.bind(this), this.animate();
  }
  //_______________________________________________________
  addToScene(e, t) {
    t && e.position.copy(t), this.mScene.add(e);
  }
  //_______________________________________________________
  /**
   * Set the OrbitControls target (look-at) point. If controls are not available,
   * the camera will directly look at the provided point.
   */
  setControlsLookAt(e, t, n) {
    this.mControls ? (this.mControls.target.set(e, t, n), this.mControls.update()) : this.mCamera.lookAt(new A.Vector3(e, t, n));
  }
  //_______________________________________________________
  /**
   * Set the OrbitControls look-at target from an Object3D's world position.
   */
  setControlsLookAtObject(e) {
    const t = new A.Vector3();
    e.getWorldPosition(t), this.mControls ? (this.mControls.target.copy(t), this.mControls.update()) : this.mCamera.lookAt(t);
  }
  //_______________________________________________________
  onWindowResize() {
    this.mCamera.aspect = this.mContainer.clientWidth / this.mContainer.clientHeight, this.mCamera.updateProjectionMatrix(), this.mRenderer.setSize(this.mContainer.clientWidth, this.mContainer.clientHeight);
  }
  //_______________________________________________________
  animate() {
    requestAnimationFrame(() => this.animate()), this.mControls && this.mControls.update(), this.mRenderer.render(this.mScene, this.mCamera);
  }
  createStatsElement() {
    if (this.mStatsEl) return;
    const e = document.createElement("div");
    e.style.position = "absolute", e.style.right = "0", e.style.top = "0", e.style.padding = "6px 8px", e.style.background = "rgba(0,0,0,0.6)", e.style.color = "#0f0", e.style.font = "12px monospace", e.style.whiteSpace = "pre", e.style.zIndex = "9999", e.style.pointerEvents = "none";
    try {
      getComputedStyle(this.mContainer).position === "static" && (this.mContainer.style.position = "relative");
    } catch {
    }
    this.mContainer.appendChild(e), this.mStatsEl = e;
  }
  startStats() {
    if (this.mStatsRafId) return;
    this.createStatsElement(), this.mStatsLastTime = performance.now(), this.mStatsFrames = 0;
    const e = () => {
      this.mStatsFrames++;
      const t = performance.now(), n = t - this.mStatsLastTime;
      if (n >= 250 && (this.mStatsFps = Math.round(this.mStatsFrames * 1e3 / n), this.mStatsFrames = 0, this.mStatsLastTime = t, this.mStatsEl)) {
        const s = this.mRenderer.info;
        this.mStatsEl.textContent = `FPS: ${this.mStatsFps}
Calls: ${s.render.calls}  Tris: ${s.render.triangles}
Geoms: ${s.memory.geometries}  Tex: ${s.memory.textures}`;
      }
      this.mStatsRafId = requestAnimationFrame(e);
    };
    this.mStatsRafId = requestAnimationFrame(e);
  }
  stopStats() {
    this.mStatsRafId && (cancelAnimationFrame(this.mStatsRafId), this.mStatsRafId = void 0), this.mStatsEl && this.mStatsEl.parentElement && (this.mStatsEl.parentElement.removeChild(this.mStatsEl), this.mStatsEl = void 0);
  }
  //_______________________________________________________
  dispose() {
    window.removeEventListener("resize", this.onWindowResize, !1), this.mRenderer.dispose(), this.mControls && (this.mControls.dispose(), this.mControls = void 0);
  }
}
const Q = class Q {
  constructor(e) {
    S(this, "mMesh");
    S(this, "mMaterial");
    S(this, "mCenterUUT", new A.Vector2(0, 0));
    S(this, "mMatrix", [[]]);
    S(this, "mHorizontalDistance", 1);
    S(this, "mVerticalDistance", 1);
    this.mMaterial = new A.MeshStandardMaterial(
      Object.assign({ color: 11443069, side: A.DoubleSide }, e)
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
  setTerrain(e, t, n, s) {
    if (this.mMatrix = e, this.mHorizontalDistance = t, this.mVerticalDistance = n, !e || e.length === 0 || !e[0])
      throw new Error("pData must be a non-empty 2D array");
    this.mCenterUUT = s.clone();
    const i = e.length, o = e[0].length;
    for (let E = 1; E < i; E++)
      if (e[E].length !== o) throw new Error("All rows in pData must have the same length");
    const a = i * o, r = new Float32Array(a * 3), c = new Float32Array(a * 3), u = new Float32Array(a * 2), l = [], d = (o - 1) * t, m = (i - 1) * t, p = d / 2, T = m / 2;
    let f = 0, g = 0;
    for (let E = 0; E < i; E++)
      for (let y = 0; y < o; y++) {
        const D = y * t - p, P = (e[E][y] ?? 0) * n, G = E * t - T;
        r[f] = D, r[f + 1] = P, r[f + 2] = G, c[f] = 0, c[f + 1] = 0, c[f + 2] = 0, u[g] = o > 1 ? y / (o - 1) : 0, u[g + 1] = i > 1 ? E / (i - 1) : 0, f += 3, g += 2;
      }
    for (let E = 0; E < i - 1; E++)
      for (let y = 0; y < o - 1; y++) {
        const D = E * o + y, P = E * o + (y + 1), G = (E + 1) * o + y, Y = (E + 1) * o + (y + 1);
        l.push(D, G, P), l.push(P, G, Y);
      }
    const w = new A.Vector3(), R = new A.Vector3(), b = new A.Vector3(), M = new A.Vector3(), F = new A.Vector3();
    for (let E = 0; E < l.length; E += 3) {
      const y = l[E] * 3, D = l[E + 1] * 3, P = l[E + 2] * 3;
      w.set(r[y], r[y + 1], r[y + 2]), R.set(r[D], r[D + 1], r[D + 2]), b.set(r[P], r[P + 1], r[P + 2]), M.subVectors(b, R), F.subVectors(w, R), M.cross(F), c[y] += M.x, c[y + 1] += M.y, c[y + 2] += M.z, c[D] += M.x, c[D + 1] += M.y, c[D + 2] += M.z, c[P] += M.x, c[P + 1] += M.y, c[P + 2] += M.z;
    }
    for (let E = 0; E < a; E++) {
      const y = E * 3, D = c[y], P = c[y + 1], G = c[y + 2], Y = Math.hypot(D, P, G) || 1;
      c[y] = D / Y, c[y + 1] = P / Y, c[y + 2] = G / Y;
    }
    const C = new A.BufferGeometry();
    C.setAttribute("position", new A.BufferAttribute(r, 3)), C.setAttribute("normal", new A.BufferAttribute(c, 3)), C.setAttribute("uv", new A.BufferAttribute(u, 2)), C.setIndex(l), C.computeBoundingSphere(), this.mMesh && this.mMesh.geometry.dispose(), this.mMesh = new A.Mesh(C, this.mMaterial), this.mMesh.receiveShadow = !0, this.mMesh.castShadow = !1, this.showTrainData(), Q.onReadyCallback && Q.onReadyCallback();
  }
  //_______________________________________________________
  /**
  * Load a PNG image where each pixel's color encodes height (uses luminance).
  * Creates a height matrix (rows = image height, cols = image width) and calls setTerrain.
  */
  async loadFromImage(e, t, n, s) {
    const i = new Image();
    i.crossOrigin = "Anonymous", i.src = e, await new Promise((d, m) => {
      i.onload = () => d(), i.onerror = (p) => {
        console.log(p), m(new Error("Failed to load image: " + String(p.toString)));
      };
    });
    const o = i.width <= 4e3 ? i.width : 4e3, a = i.height <= 4e3 ? i.height : 4e3, r = document.createElement("canvas");
    r.width = o, r.height = a;
    const c = r.getContext("2d");
    if (!c) throw new Error("Canvas 2D context unavailable");
    c.drawImage(i, 0, 0, o, a);
    const u = c.getImageData(0, 0, o, a).data, l = new Array(a);
    for (let d = 0; d < a; d++) {
      const m = new Array(o);
      for (let p = 0; p < o; p++) {
        const T = (d * o + p) * 4, f = u[T], g = u[T + 1], w = u[T + 2], R = (0.2126 * f + 0.7152 * g + 0.0722 * w) / 255;
        m[p] = R;
      }
      l[d] = m;
    }
    this.setTerrain(l, t, n, s.clone());
  }
  //_______________________________________________________
  showTrainData() {
    if (!this.mMatrix || this.mMatrix.length === 0 || !this.mMatrix[0]) {
      console.log("No matrix data available");
      return;
    }
    const e = this.mMatrix[0].length, t = this.mMatrix.length;
    console.log("Matrix order: " + e + " X " + t), console.log("MapSize: " + (e * this.mHorizontalDistance).toFixed(1) + "m X " + (t * this.mHorizontalDistance).toFixed(1) + "m"), console.log("Real world Bounding rect (center): " + this.mCenterUUT.x.toFixed(1) + "m, " + this.mCenterUUT.y.toFixed(1) + "m");
    const n = e * this.mHorizontalDistance / 2, s = t * this.mHorizontalDistance / 2;
    console.log("Real world Bounding rect (top): " + (this.mCenterUUT.x - n).toFixed(1) + "m, " + (this.mCenterUUT.y + s).toFixed(1) + "m"), console.log("Real world Bounding rect (bottom): " + (this.mCenterUUT.x + n).toFixed(1) + "m, " + (this.mCenterUUT.y - s).toFixed(1) + "m");
  }
  //_______________________________________________________
  getMesh() {
    return this.mMesh;
  }
  //_______________________________________________________
  heightAtPoint(e, t) {
    if (!this.mMesh) return;
    const n = this.mMesh.geometry.attributes.position, s = n.count;
    let i, o = 1 / 0;
    for (let a = 0; a < s; a++) {
      const r = n.getX(a), c = n.getY(a), u = n.getZ(a), l = r - e, d = u - t, m = l * l + d * d;
      m < o && (o = m, i = c);
    }
    return i;
  }
  //_______________________________________________________
  dispose() {
    this.mMesh && (this.mMesh.geometry.dispose(), this.mMesh.material && this.mMesh.material.dispose && this.mMesh.material.dispose(), this.mMesh = void 0);
  }
};
// Callback to be invoked when terrain is ready
S(Q, "onReadyCallback");
let ee = Q;
function Me(h, e) {
  if (e === Ye)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), h;
  if (e === ue || e === Ie) {
    let t = h.getIndex();
    if (t === null) {
      const o = [], a = h.getAttribute("position");
      if (a !== void 0) {
        for (let r = 0; r < a.count; r++)
          o.push(r);
        h.setIndex(o), t = h.getIndex();
      } else
        return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), h;
    }
    const n = t.count - 2, s = [];
    if (e === ue)
      for (let o = 1; o <= n; o++)
        s.push(t.getX(0)), s.push(t.getX(o)), s.push(t.getX(o + 1));
    else
      for (let o = 0; o < n; o++)
        o % 2 === 0 ? (s.push(t.getX(o)), s.push(t.getX(o + 1)), s.push(t.getX(o + 2))) : (s.push(t.getX(o + 2)), s.push(t.getX(o + 1)), s.push(t.getX(o)));
    s.length / 3 !== n && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const i = h.clone();
    return i.setIndex(s), i.clearGroups(), i;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), h;
}
class Vt extends We {
  /**
   * Constructs a new glTF loader.
   *
   * @param {LoadingManager} [manager] - The loading manager.
   */
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new qt(t);
    }), this.register(function(t) {
      return new Qt(t);
    }), this.register(function(t) {
      return new rs(t);
    }), this.register(function(t) {
      return new as(t);
    }), this.register(function(t) {
      return new cs(t);
    }), this.register(function(t) {
      return new Jt(t);
    }), this.register(function(t) {
      return new es(t);
    }), this.register(function(t) {
      return new ts(t);
    }), this.register(function(t) {
      return new ss(t);
    }), this.register(function(t) {
      return new Zt(t);
    }), this.register(function(t) {
      return new ns(t);
    }), this.register(function(t) {
      return new $t(t);
    }), this.register(function(t) {
      return new os(t);
    }), this.register(function(t) {
      return new is(t);
    }), this.register(function(t) {
      return new Yt(t);
    }), this.register(function(t) {
      return new hs(t);
    }), this.register(function(t) {
      return new ls(t);
    });
  }
  /**
   * Starts loading from the given URL and passes the loaded glTF asset
   * to the `onLoad()` callback.
   *
   * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
   * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
   * @param {onProgressCallback} onProgress - Executed while the loading is in progress.
   * @param {onErrorCallback} onError - Executed when errors occur.
   */
  load(e, t, n, s) {
    const i = this;
    let o;
    if (this.resourcePath !== "")
      o = this.resourcePath;
    else if (this.path !== "") {
      const c = q.extractUrlBase(e);
      o = q.resolveURL(c, this.path);
    } else
      o = q.extractUrlBase(e);
    this.manager.itemStart(e);
    const a = function(c) {
      s ? s(c) : console.error(c), i.manager.itemError(e), i.manager.itemEnd(e);
    }, r = new Ne(this.manager);
    r.setPath(this.path), r.setResponseType("arraybuffer"), r.setRequestHeader(this.requestHeader), r.setWithCredentials(this.withCredentials), r.load(e, function(c) {
      try {
        i.parse(c, o, function(u) {
          t(u), i.manager.itemEnd(e);
        }, a);
      } catch (u) {
        a(u);
      }
    }, n, a);
  }
  /**
   * Sets the given Draco loader to this loader. Required for decoding assets
   * compressed with the `KHR_draco_mesh_compression` extension.
   *
   * @param {DRACOLoader} dracoLoader - The Draco loader to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }
  /**
   * Sets the given KTX2 loader to this loader. Required for loading KTX2
   * compressed textures.
   *
   * @param {KTX2Loader} ktx2Loader - The KTX2 loader to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }
  /**
   * Sets the given meshopt decoder. Required for decoding assets
   * compressed with the `EXT_meshopt_compression` extension.
   *
   * @param {Object} meshoptDecoder - The meshopt decoder to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }
  /**
   * Registers a plugin callback. This API is internally used to implement the various
   * glTF extensions but can also used by third-party code to add additional logic
   * to the loader.
   *
   * @param {function(parser:GLTFParser)} callback - The callback function to register.
   * @return {GLTFLoader} A reference to this loader.
   */
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  /**
   * Unregisters a plugin callback.
   *
   * @param {Function} callback - The callback function to unregister.
   * @return {GLTFLoader} A reference to this loader.
   */
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  /**
   * Parses the given FBX data and returns the resulting group.
   *
   * @param {string|ArrayBuffer} data - The raw glTF data.
   * @param {string} path - The URL base path.
   * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
   * @param {onErrorCallback} onError - Executed when errors occur.
   */
  parse(e, t, n, s) {
    let i;
    const o = {}, a = {}, r = new TextDecoder();
    if (typeof e == "string")
      i = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (r.decode(new Uint8Array(e, 0, 4)) === Ue) {
        try {
          o[_.KHR_BINARY_GLTF] = new us(e);
        } catch (l) {
          s && s(l);
          return;
        }
        i = JSON.parse(o[_.KHR_BINARY_GLTF].content);
      } else
        i = JSON.parse(r.decode(e));
    else
      i = e;
    if (i.asset === void 0 || i.asset.version[0] < 2) {
      s && s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const c = new xs(i, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    c.fileLoader.setRequestHeader(this.requestHeader);
    for (let u = 0; u < this.pluginCallbacks.length; u++) {
      const l = this.pluginCallbacks[u](c);
      l.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), a[l.name] = l, o[l.name] = !0;
    }
    if (i.extensionsUsed)
      for (let u = 0; u < i.extensionsUsed.length; ++u) {
        const l = i.extensionsUsed[u], d = i.extensionsRequired || [];
        switch (l) {
          case _.KHR_MATERIALS_UNLIT:
            o[l] = new Wt();
            break;
          case _.KHR_DRACO_MESH_COMPRESSION:
            o[l] = new ds(i, this.dracoLoader);
            break;
          case _.KHR_TEXTURE_TRANSFORM:
            o[l] = new ms();
            break;
          case _.KHR_MESH_QUANTIZATION:
            o[l] = new fs();
            break;
          default:
            d.indexOf(l) >= 0 && a[l] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + l + '".');
        }
      }
    c.setExtensions(o), c.setPlugins(a), c.parse(n, s);
  }
  /**
   * Async version of {@link GLTFLoader#parse}.
   *
   * @async
   * @param {string|ArrayBuffer} data - The raw glTF data.
   * @param {string} path - The URL base path.
   * @return {Promise<GLTFLoader~LoadObject>} A Promise that resolves with the loaded glTF when the parsing has been finished.
   */
  parseAsync(e, t) {
    const n = this;
    return new Promise(function(s, i) {
      n.parse(e, t, s, i);
    });
  }
}
function Xt() {
  let h = {};
  return {
    get: function(e) {
      return h[e];
    },
    add: function(e, t) {
      h[e] = t;
    },
    remove: function(e) {
      delete h[e];
    },
    removeAll: function() {
      h = {};
    }
  };
}
const _ = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class Yt {
  constructor(e) {
    this.parser = e, this.name = _.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let n = 0, s = t.length; n < s; n++) {
      const i = t[n];
      i.extensions && i.extensions[this.name] && i.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, i.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, n = "light:" + e;
    let s = t.cache.get(n);
    if (s) return s;
    const i = t.json, r = ((i.extensions && i.extensions[this.name] || {}).lights || [])[e];
    let c;
    const u = new B(16777215);
    r.color !== void 0 && u.setRGB(r.color[0], r.color[1], r.color[2], v);
    const l = r.range !== void 0 ? r.range : 0;
    switch (r.type) {
      case "directional":
        c = new Qe(u), c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      case "point":
        c = new qe(u), c.distance = l;
        break;
      case "spot":
        c = new Ze(u), c.distance = l, r.spot = r.spot || {}, r.spot.innerConeAngle = r.spot.innerConeAngle !== void 0 ? r.spot.innerConeAngle : 0, r.spot.outerConeAngle = r.spot.outerConeAngle !== void 0 ? r.spot.outerConeAngle : Math.PI / 4, c.angle = r.spot.outerConeAngle, c.penumbra = 1 - r.spot.innerConeAngle / r.spot.outerConeAngle, c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + r.type);
    }
    return c.position.set(0, 0, 0), H(c, r), r.intensity !== void 0 && (c.intensity = r.intensity), c.name = t.createUniqueName(r.name || "light_" + e), s = Promise.resolve(c), t.cache.add(n, s), s;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, n = this.parser, i = n.json.nodes[e], a = (i.extensions && i.extensions[this.name] || {}).light;
    return a === void 0 ? null : this._loadLight(a).then(function(r) {
      return n._getNodeRef(t.cache, a, r);
    });
  }
}
class Wt {
  constructor() {
    this.name = _.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return Z;
  }
  extendParams(e, t, n) {
    const s = [];
    e.color = new B(1, 1, 1), e.opacity = 1;
    const i = t.pbrMetallicRoughness;
    if (i) {
      if (Array.isArray(i.baseColorFactor)) {
        const o = i.baseColorFactor;
        e.color.setRGB(o[0], o[1], o[2], v), e.opacity = o[3];
      }
      i.baseColorTexture !== void 0 && s.push(n.assignTexture(e, "map", i.baseColorTexture, J));
    }
    return Promise.all(s);
  }
}
class Zt {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const s = this.parser.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = s.extensions[this.name].emissiveStrength;
    return i !== void 0 && (t.emissiveIntensity = i), Promise.resolve();
  }
}
class qt {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = [], o = s.extensions[this.name];
    if (o.clearcoatFactor !== void 0 && (t.clearcoat = o.clearcoatFactor), o.clearcoatTexture !== void 0 && i.push(n.assignTexture(t, "clearcoatMap", o.clearcoatTexture)), o.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = o.clearcoatRoughnessFactor), o.clearcoatRoughnessTexture !== void 0 && i.push(n.assignTexture(t, "clearcoatRoughnessMap", o.clearcoatRoughnessTexture)), o.clearcoatNormalTexture !== void 0 && (i.push(n.assignTexture(t, "clearcoatNormalMap", o.clearcoatNormalTexture)), o.clearcoatNormalTexture.scale !== void 0)) {
      const a = o.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new O(a, a);
    }
    return Promise.all(i);
  }
}
class Qt {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const s = this.parser.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = s.extensions[this.name];
    return t.dispersion = i.dispersion !== void 0 ? i.dispersion : 0, Promise.resolve();
  }
}
class $t {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = [], o = s.extensions[this.name];
    return o.iridescenceFactor !== void 0 && (t.iridescence = o.iridescenceFactor), o.iridescenceTexture !== void 0 && i.push(n.assignTexture(t, "iridescenceMap", o.iridescenceTexture)), o.iridescenceIor !== void 0 && (t.iridescenceIOR = o.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), o.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = o.iridescenceThicknessMinimum), o.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = o.iridescenceThicknessMaximum), o.iridescenceThicknessTexture !== void 0 && i.push(n.assignTexture(t, "iridescenceThicknessMap", o.iridescenceThicknessTexture)), Promise.all(i);
  }
}
class Jt {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = [];
    t.sheenColor = new B(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
    const o = s.extensions[this.name];
    if (o.sheenColorFactor !== void 0) {
      const a = o.sheenColorFactor;
      t.sheenColor.setRGB(a[0], a[1], a[2], v);
    }
    return o.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = o.sheenRoughnessFactor), o.sheenColorTexture !== void 0 && i.push(n.assignTexture(t, "sheenColorMap", o.sheenColorTexture, J)), o.sheenRoughnessTexture !== void 0 && i.push(n.assignTexture(t, "sheenRoughnessMap", o.sheenRoughnessTexture)), Promise.all(i);
  }
}
class es {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = [], o = s.extensions[this.name];
    return o.transmissionFactor !== void 0 && (t.transmission = o.transmissionFactor), o.transmissionTexture !== void 0 && i.push(n.assignTexture(t, "transmissionMap", o.transmissionTexture)), Promise.all(i);
  }
}
class ts {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = [], o = s.extensions[this.name];
    t.thickness = o.thicknessFactor !== void 0 ? o.thicknessFactor : 0, o.thicknessTexture !== void 0 && i.push(n.assignTexture(t, "thicknessMap", o.thicknessTexture)), t.attenuationDistance = o.attenuationDistance || 1 / 0;
    const a = o.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new B().setRGB(a[0], a[1], a[2], v), Promise.all(i);
  }
}
class ss {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const s = this.parser.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = s.extensions[this.name];
    return t.ior = i.ior !== void 0 ? i.ior : 1.5, Promise.resolve();
  }
}
class ns {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = [], o = s.extensions[this.name];
    t.specularIntensity = o.specularFactor !== void 0 ? o.specularFactor : 1, o.specularTexture !== void 0 && i.push(n.assignTexture(t, "specularIntensityMap", o.specularTexture));
    const a = o.specularColorFactor || [1, 1, 1];
    return t.specularColor = new B().setRGB(a[0], a[1], a[2], v), o.specularColorTexture !== void 0 && i.push(n.assignTexture(t, "specularColorMap", o.specularColorTexture, J)), Promise.all(i);
  }
}
class is {
  constructor(e) {
    this.parser = e, this.name = _.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = [], o = s.extensions[this.name];
    return t.bumpScale = o.bumpFactor !== void 0 ? o.bumpFactor : 1, o.bumpTexture !== void 0 && i.push(n.assignTexture(t, "bumpMap", o.bumpTexture)), Promise.all(i);
  }
}
class os {
  constructor(e) {
    this.parser = e, this.name = _.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : j;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, s = n.json.materials[e];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const i = [], o = s.extensions[this.name];
    return o.anisotropyStrength !== void 0 && (t.anisotropy = o.anisotropyStrength), o.anisotropyRotation !== void 0 && (t.anisotropyRotation = o.anisotropyRotation), o.anisotropyTexture !== void 0 && i.push(n.assignTexture(t, "anisotropyMap", o.anisotropyTexture)), Promise.all(i);
  }
}
class rs {
  constructor(e) {
    this.parser = e, this.name = _.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, n = t.json, s = n.textures[e];
    if (!s.extensions || !s.extensions[this.name])
      return null;
    const i = s.extensions[this.name], o = t.options.ktx2Loader;
    if (!o) {
      if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, i.source, o);
  }
}
class as {
  constructor(e) {
    this.parser = e, this.name = _.EXT_TEXTURE_WEBP;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, s = n.json, i = s.textures[e];
    if (!i.extensions || !i.extensions[t])
      return null;
    const o = i.extensions[t], a = s.images[o.source];
    let r = n.textureLoader;
    if (a.uri) {
      const c = n.options.manager.getHandler(a.uri);
      c !== null && (r = c);
    }
    return n.loadTextureImage(e, o.source, r);
  }
}
class cs {
  constructor(e) {
    this.parser = e, this.name = _.EXT_TEXTURE_AVIF;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, s = n.json, i = s.textures[e];
    if (!i.extensions || !i.extensions[t])
      return null;
    const o = i.extensions[t], a = s.images[o.source];
    let r = n.textureLoader;
    if (a.uri) {
      const c = n.options.manager.getHandler(a.uri);
      c !== null && (r = c);
    }
    return n.loadTextureImage(e, o.source, r);
  }
}
class hs {
  constructor(e) {
    this.name = _.EXT_MESHOPT_COMPRESSION, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, n = t.bufferViews[e];
    if (n.extensions && n.extensions[this.name]) {
      const s = n.extensions[this.name], i = this.parser.getDependency("buffer", s.buffer), o = this.parser.options.meshoptDecoder;
      if (!o || !o.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return i.then(function(a) {
        const r = s.byteOffset || 0, c = s.byteLength || 0, u = s.count, l = s.byteStride, d = new Uint8Array(a, r, c);
        return o.decodeGltfBufferAsync ? o.decodeGltfBufferAsync(u, l, d, s.mode, s.filter).then(function(m) {
          return m.buffer;
        }) : o.ready.then(function() {
          const m = new ArrayBuffer(u * l);
          return o.decodeGltfBuffer(new Uint8Array(m), u, l, d, s.mode, s.filter), m;
        });
      });
    } else
      return null;
  }
}
class ls {
  constructor(e) {
    this.name = _.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, n = t.nodes[e];
    if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0)
      return null;
    const s = t.meshes[n.mesh];
    for (const c of s.primitives)
      if (c.mode !== k.TRIANGLES && c.mode !== k.TRIANGLE_STRIP && c.mode !== k.TRIANGLE_FAN && c.mode !== void 0)
        return null;
    const o = n.extensions[this.name].attributes, a = [], r = {};
    for (const c in o)
      a.push(this.parser.getDependency("accessor", o[c]).then((u) => (r[c] = u, r[c])));
    return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((c) => {
      const u = c.pop(), l = u.isGroup ? u.children : [u], d = c[0].count, m = [];
      for (const p of l) {
        const T = new ne(), f = new I(), g = new se(), w = new I(1, 1, 1), R = new $e(p.geometry, p.material, d);
        for (let b = 0; b < d; b++)
          r.TRANSLATION && f.fromBufferAttribute(r.TRANSLATION, b), r.ROTATION && g.fromBufferAttribute(r.ROTATION, b), r.SCALE && w.fromBufferAttribute(r.SCALE, b), R.setMatrixAt(b, T.compose(f, g, w));
        for (const b in r)
          if (b === "_COLOR_0") {
            const M = r[b];
            R.instanceColor = new Je(M.array, M.itemSize, M.normalized);
          } else b !== "TRANSLATION" && b !== "ROTATION" && b !== "SCALE" && p.geometry.setAttribute(b, r[b]);
        Oe.prototype.copy.call(R, p), this.parser.assignFinalMaterial(R), m.push(R);
      }
      return u.isGroup ? (u.clear(), u.add(...m), u) : m[0];
    }));
  }
}
const Ue = "glTF", W = 12, Ae = { JSON: 1313821514, BIN: 5130562 };
class us {
  constructor(e) {
    this.name = _.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, W), n = new TextDecoder();
    if (this.header = {
      magic: n.decode(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== Ue)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const s = this.header.length - W, i = new DataView(e, W);
    let o = 0;
    for (; o < s; ) {
      const a = i.getUint32(o, !0);
      o += 4;
      const r = i.getUint32(o, !0);
      if (o += 4, r === Ae.JSON) {
        const c = new Uint8Array(e, W + o, a);
        this.content = n.decode(c);
      } else if (r === Ae.BIN) {
        const c = W + o;
        this.body = e.slice(c, c + a);
      }
      o += a;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class ds {
  constructor(e, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = _.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const n = this.json, s = this.dracoLoader, i = e.extensions[this.name].bufferView, o = e.extensions[this.name].attributes, a = {}, r = {}, c = {};
    for (const u in o) {
      const l = fe[u] || u.toLowerCase();
      a[l] = o[u];
    }
    for (const u in e.attributes) {
      const l = fe[u] || u.toLowerCase();
      if (o[u] !== void 0) {
        const d = n.accessors[e.attributes[u]], m = X[d.componentType];
        c[l] = m.name, r[l] = d.normalized === !0;
      }
    }
    return t.getDependency("bufferView", i).then(function(u) {
      return new Promise(function(l, d) {
        s.decodeDracoFile(u, function(m) {
          for (const p in m.attributes) {
            const T = m.attributes[p], f = r[p];
            f !== void 0 && (T.normalized = f);
          }
          l(m);
        }, a, c, v, d);
      });
    });
  }
}
class ms {
  constructor() {
    this.name = _.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e;
  }
}
class fs {
  constructor() {
    this.name = _.KHR_MESH_QUANTIZATION;
  }
}
class Ge extends At {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, n = this.sampleValues, s = this.valueSize, i = e * s * 3 + s;
    for (let o = 0; o !== s; o++)
      t[o] = n[i + o];
    return t;
  }
  interpolate_(e, t, n, s) {
    const i = this.resultBuffer, o = this.sampleValues, a = this.valueSize, r = a * 2, c = a * 3, u = s - t, l = (n - t) / u, d = l * l, m = d * l, p = e * c, T = p - c, f = -2 * m + 3 * d, g = m - d, w = 1 - f, R = g - d + l;
    for (let b = 0; b !== a; b++) {
      const M = o[T + b + a], F = o[T + b + r] * u, C = o[p + b + a], E = o[p + b] * u;
      i[b] = w * M + R * F + f * C + g * E;
    }
    return i;
  }
}
const ps = new se();
class gs extends Ge {
  interpolate_(e, t, n, s) {
    const i = super.interpolate_(e, t, n, s);
    return ps.fromArray(i).normalize().toArray(i), i;
  }
}
const k = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
}, X = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, Le = {
  9728: Fe,
  9729: de,
  9984: rt,
  9985: ot,
  9986: it,
  9987: ke
}, Ce = {
  33071: ct,
  33648: at,
  10497: me
}, ce = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, fe = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv1",
  TEXCOORD_2: "uv2",
  TEXCOORD_3: "uv3",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, U = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, _s = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: je,
  STEP: wt
}, he = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function Ts(h) {
  return h.DefaultMaterial === void 0 && (h.DefaultMaterial = new He({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: Mt
  })), h.DefaultMaterial;
}
function K(h, e, t) {
  for (const n in t.extensions)
    h[n] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[n] = t.extensions[n]);
}
function H(h, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(h.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function ys(h, e, t) {
  let n = !1, s = !1, i = !1;
  for (let c = 0, u = e.length; c < u; c++) {
    const l = e[c];
    if (l.POSITION !== void 0 && (n = !0), l.NORMAL !== void 0 && (s = !0), l.COLOR_0 !== void 0 && (i = !0), n && s && i) break;
  }
  if (!n && !s && !i) return Promise.resolve(h);
  const o = [], a = [], r = [];
  for (let c = 0, u = e.length; c < u; c++) {
    const l = e[c];
    if (n) {
      const d = l.POSITION !== void 0 ? t.getDependency("accessor", l.POSITION) : h.attributes.position;
      o.push(d);
    }
    if (s) {
      const d = l.NORMAL !== void 0 ? t.getDependency("accessor", l.NORMAL) : h.attributes.normal;
      a.push(d);
    }
    if (i) {
      const d = l.COLOR_0 !== void 0 ? t.getDependency("accessor", l.COLOR_0) : h.attributes.color;
      r.push(d);
    }
  }
  return Promise.all([
    Promise.all(o),
    Promise.all(a),
    Promise.all(r)
  ]).then(function(c) {
    const u = c[0], l = c[1], d = c[2];
    return n && (h.morphAttributes.position = u), s && (h.morphAttributes.normal = l), i && (h.morphAttributes.color = d), h.morphTargetsRelative = !0, h;
  });
}
function Es(h, e) {
  if (h.updateMorphTargets(), e.weights !== void 0)
    for (let t = 0, n = e.weights.length; t < n; t++)
      h.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (h.morphTargetInfluences.length === t.length) {
      h.morphTargetDictionary = {};
      for (let n = 0, s = t.length; n < s; n++)
        h.morphTargetDictionary[t[n]] = n;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function bs(h) {
  let e;
  const t = h.extensions && h.extensions[_.KHR_DRACO_MESH_COMPRESSION];
  if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + le(t.attributes) : e = h.indices + ":" + le(h.attributes) + ":" + h.mode, h.targets !== void 0)
    for (let n = 0, s = h.targets.length; n < s; n++)
      e += ":" + le(h.targets[n]);
  return e;
}
function le(h) {
  let e = "";
  const t = Object.keys(h).sort();
  for (let n = 0, s = t.length; n < s; n++)
    e += t[n] + ":" + h[t[n]] + ";";
  return e;
}
function pe(h) {
  switch (h) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function Ss(h) {
  return h.search(/\.jpe?g($|\?)/i) > 0 || h.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : h.search(/\.webp($|\?)/i) > 0 || h.search(/^data\:image\/webp/) === 0 ? "image/webp" : h.search(/\.ktx2($|\?)/i) > 0 || h.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
const Rs = new ne();
class xs {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Xt(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let n = !1, s = -1, i = !1, o = -1;
    if (typeof navigator < "u") {
      const a = navigator.userAgent;
      n = /^((?!chrome|android).)*safari/i.test(a) === !0;
      const r = a.match(/Version\/(\d+)/);
      s = n && r ? parseInt(r[1], 10) : -1, i = a.indexOf("Firefox") > -1, o = i ? a.match(/Firefox\/([0-9]+)\./)[1] : -1;
    }
    typeof createImageBitmap > "u" || n && s < 17 || i && o < 98 ? this.textureLoader = new et(this.options.manager) : this.textureLoader = new tt(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new Ne(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const n = this, s = this.json, i = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(o) {
      return o._markDefs && o._markDefs();
    }), Promise.all(this._invokeAll(function(o) {
      return o.beforeRoot && o.beforeRoot();
    })).then(function() {
      return Promise.all([
        n.getDependencies("scene"),
        n.getDependencies("animation"),
        n.getDependencies("camera")
      ]);
    }).then(function(o) {
      const a = {
        scene: o[0][s.scene || 0],
        scenes: o[0],
        animations: o[1],
        cameras: o[2],
        asset: s.asset,
        parser: n,
        userData: {}
      };
      return K(i, a, s), H(a, s), Promise.all(n._invokeAll(function(r) {
        return r.afterRoot && r.afterRoot(a);
      })).then(function() {
        for (const r of a.scenes)
          r.updateMatrixWorld();
        e(a);
      });
    }).catch(t);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   *
   * @private
   */
  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
    for (let s = 0, i = t.length; s < i; s++) {
      const o = t[s].joints;
      for (let a = 0, r = o.length; a < r; a++)
        e[o[a]].isBone = !0;
    }
    for (let s = 0, i = e.length; s < i; s++) {
      const o = e[s];
      o.mesh !== void 0 && (this._addNodeRef(this.meshCache, o.mesh), o.skin !== void 0 && (n[o.mesh].isSkinnedMesh = !0)), o.camera !== void 0 && this._addNodeRef(this.cameraCache, o.camera);
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   *
   * @private
   * @param {Object} cache
   * @param {Object3D} index
   */
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  /**
   * Returns a reference to a shared resource, cloning it if necessary.
   *
   * @private
   * @param {Object} cache
   * @param {number} index
   * @param {Object} object
   * @return {Object}
   */
  _getNodeRef(e, t, n) {
    if (e.refs[t] <= 1) return n;
    const s = n.clone(), i = (o, a) => {
      const r = this.associations.get(o);
      r != null && this.associations.set(a, r);
      for (const [c, u] of o.children.entries())
        i(u, a.children[c]);
    };
    return i(n, s), s.name += "_instance_" + e.uses[t]++, s;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let n = 0; n < t.length; n++) {
      const s = e(t[n]);
      if (s) return s;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const n = [];
    for (let s = 0; s < t.length; s++) {
      const i = e(t[s]);
      i && n.push(i);
    }
    return n;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   *
   * @private
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(e, t) {
    const n = e + ":" + t;
    let s = this.cache.get(n);
    if (!s) {
      switch (e) {
        case "scene":
          s = this.loadScene(t);
          break;
        case "node":
          s = this._invokeOne(function(i) {
            return i.loadNode && i.loadNode(t);
          });
          break;
        case "mesh":
          s = this._invokeOne(function(i) {
            return i.loadMesh && i.loadMesh(t);
          });
          break;
        case "accessor":
          s = this.loadAccessor(t);
          break;
        case "bufferView":
          s = this._invokeOne(function(i) {
            return i.loadBufferView && i.loadBufferView(t);
          });
          break;
        case "buffer":
          s = this.loadBuffer(t);
          break;
        case "material":
          s = this._invokeOne(function(i) {
            return i.loadMaterial && i.loadMaterial(t);
          });
          break;
        case "texture":
          s = this._invokeOne(function(i) {
            return i.loadTexture && i.loadTexture(t);
          });
          break;
        case "skin":
          s = this.loadSkin(t);
          break;
        case "animation":
          s = this._invokeOne(function(i) {
            return i.loadAnimation && i.loadAnimation(t);
          });
          break;
        case "camera":
          s = this.loadCamera(t);
          break;
        default:
          if (s = this._invokeOne(function(i) {
            return i != this && i.getDependency && i.getDependency(e, t);
          }), !s)
            throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(n, s);
    }
    return s;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   *
   * @private
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const n = this, s = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(s.map(function(i, o) {
        return n.getDependency(e, o);
      })), this.cache.add(e, t);
    }
    return t;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   *
   * @private
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(e) {
    const t = this.json.buffers[e], n = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0)
      return Promise.resolve(this.extensions[_.KHR_BINARY_GLTF].body);
    const s = this.options;
    return new Promise(function(i, o) {
      n.load(q.resolveURL(t.uri, s.path), i, void 0, function() {
        o(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   *
   * @private
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(n) {
      const s = t.byteLength || 0, i = t.byteOffset || 0;
      return n.slice(i, i + s);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   *
   * @private
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(e) {
    const t = this, n = this.json, s = this.json.accessors[e];
    if (s.bufferView === void 0 && s.sparse === void 0) {
      const o = ce[s.type], a = X[s.componentType], r = s.normalized === !0, c = new a(s.count * o);
      return Promise.resolve(new ie(c, o, r));
    }
    const i = [];
    return s.bufferView !== void 0 ? i.push(this.getDependency("bufferView", s.bufferView)) : i.push(null), s.sparse !== void 0 && (i.push(this.getDependency("bufferView", s.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", s.sparse.values.bufferView))), Promise.all(i).then(function(o) {
      const a = o[0], r = ce[s.type], c = X[s.componentType], u = c.BYTES_PER_ELEMENT, l = u * r, d = s.byteOffset || 0, m = s.bufferView !== void 0 ? n.bufferViews[s.bufferView].byteStride : void 0, p = s.normalized === !0;
      let T, f;
      if (m && m !== l) {
        const g = Math.floor(d / m), w = "InterleavedBuffer:" + s.bufferView + ":" + s.componentType + ":" + g + ":" + s.count;
        let R = t.cache.get(w);
        R || (T = new c(a, g * m, s.count * m / u), R = new st(T, m / u), t.cache.add(w, R)), f = new nt(R, r, d % m / u, p);
      } else
        a === null ? T = new c(s.count * r) : T = new c(a, d, s.count * r), f = new ie(T, r, p);
      if (s.sparse !== void 0) {
        const g = ce.SCALAR, w = X[s.sparse.indices.componentType], R = s.sparse.indices.byteOffset || 0, b = s.sparse.values.byteOffset || 0, M = new w(o[1], R, s.sparse.count * g), F = new c(o[2], b, s.sparse.count * r);
        a !== null && (f = new ie(f.array.slice(), f.itemSize, f.normalized)), f.normalized = !1;
        for (let C = 0, E = M.length; C < E; C++) {
          const y = M[C];
          if (f.setX(y, F[C * r]), r >= 2 && f.setY(y, F[C * r + 1]), r >= 3 && f.setZ(y, F[C * r + 2]), r >= 4 && f.setW(y, F[C * r + 3]), r >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
        f.normalized = p;
      }
      return f;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   *
   * @private
   * @param {number} textureIndex
   * @return {Promise<?Texture>}
   */
  loadTexture(e) {
    const t = this.json, n = this.options, i = t.textures[e].source, o = t.images[i];
    let a = this.textureLoader;
    if (o.uri) {
      const r = n.manager.getHandler(o.uri);
      r !== null && (a = r);
    }
    return this.loadTextureImage(e, i, a);
  }
  loadTextureImage(e, t, n) {
    const s = this, i = this.json, o = i.textures[e], a = i.images[t], r = (a.uri || a.bufferView) + ":" + o.sampler;
    if (this.textureCache[r])
      return this.textureCache[r];
    const c = this.loadImageSource(t, n).then(function(u) {
      u.flipY = !1, u.name = o.name || a.name || "", u.name === "" && typeof a.uri == "string" && a.uri.startsWith("data:image/") === !1 && (u.name = a.uri);
      const d = (i.samplers || {})[o.sampler] || {};
      return u.magFilter = Le[d.magFilter] || de, u.minFilter = Le[d.minFilter] || ke, u.wrapS = Ce[d.wrapS] || me, u.wrapT = Ce[d.wrapT] || me, u.generateMipmaps = !u.isCompressedTexture && u.minFilter !== Fe && u.minFilter !== de, s.associations.set(u, { textures: e }), u;
    }).catch(function() {
      return null;
    });
    return this.textureCache[r] = c, c;
  }
  loadImageSource(e, t) {
    const n = this, s = this.json, i = this.options;
    if (this.sourceCache[e] !== void 0)
      return this.sourceCache[e].then((l) => l.clone());
    const o = s.images[e], a = self.URL || self.webkitURL;
    let r = o.uri || "", c = !1;
    if (o.bufferView !== void 0)
      r = n.getDependency("bufferView", o.bufferView).then(function(l) {
        c = !0;
        const d = new Blob([l], { type: o.mimeType });
        return r = a.createObjectURL(d), r;
      });
    else if (o.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const u = Promise.resolve(r).then(function(l) {
      return new Promise(function(d, m) {
        let p = d;
        t.isImageBitmapLoader === !0 && (p = function(T) {
          const f = new ye(T);
          f.needsUpdate = !0, d(f);
        }), t.load(q.resolveURL(l, i.path), p, void 0, m);
      });
    }).then(function(l) {
      return c === !0 && a.revokeObjectURL(r), H(l, o), l.userData.mimeType = o.mimeType || Ss(o.uri), l;
    }).catch(function(l) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", r), l;
    });
    return this.sourceCache[e] = u, u;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   *
   * @private
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @param {string} [colorSpace]
   * @return {Promise<Texture>}
   */
  assignTexture(e, t, n, s) {
    const i = this;
    return this.getDependency("texture", n.index).then(function(o) {
      if (!o) return null;
      if (n.texCoord !== void 0 && n.texCoord > 0 && (o = o.clone(), o.channel = n.texCoord), i.extensions[_.KHR_TEXTURE_TRANSFORM]) {
        const a = n.extensions !== void 0 ? n.extensions[_.KHR_TEXTURE_TRANSFORM] : void 0;
        if (a) {
          const r = i.associations.get(o);
          o = i.extensions[_.KHR_TEXTURE_TRANSFORM].extendTexture(o, a), i.associations.set(o, r);
        }
      }
      return s !== void 0 && (o.colorSpace = s), e[t] = o, o;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   *
   * @private
   * @param {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(e) {
    const t = e.geometry;
    let n = e.material;
    const s = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, o = t.attributes.normal === void 0;
    if (e.isPoints) {
      const a = "PointsMaterial:" + n.uuid;
      let r = this.cache.get(a);
      r || (r = new ht(), oe.prototype.copy.call(r, n), r.color.copy(n.color), r.map = n.map, r.sizeAttenuation = !1, this.cache.add(a, r)), n = r;
    } else if (e.isLine) {
      const a = "LineBasicMaterial:" + n.uuid;
      let r = this.cache.get(a);
      r || (r = new lt(), oe.prototype.copy.call(r, n), r.color.copy(n.color), r.map = n.map, this.cache.add(a, r)), n = r;
    }
    if (s || i || o) {
      let a = "ClonedMaterial:" + n.uuid + ":";
      s && (a += "derivative-tangents:"), i && (a += "vertex-colors:"), o && (a += "flat-shading:");
      let r = this.cache.get(a);
      r || (r = n.clone(), i && (r.vertexColors = !0), o && (r.flatShading = !0), s && (r.normalScale && (r.normalScale.y *= -1), r.clearcoatNormalScale && (r.clearcoatNormalScale.y *= -1)), this.cache.add(a, r), this.associations.set(r, this.associations.get(n))), n = r;
    }
    e.material = n;
  }
  getMaterialType() {
    return He;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   *
   * @private
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(e) {
    const t = this, n = this.json, s = this.extensions, i = n.materials[e];
    let o;
    const a = {}, r = i.extensions || {}, c = [];
    if (r[_.KHR_MATERIALS_UNLIT]) {
      const l = s[_.KHR_MATERIALS_UNLIT];
      o = l.getMaterialType(), c.push(l.extendParams(a, i, t));
    } else {
      const l = i.pbrMetallicRoughness || {};
      if (a.color = new B(1, 1, 1), a.opacity = 1, Array.isArray(l.baseColorFactor)) {
        const d = l.baseColorFactor;
        a.color.setRGB(d[0], d[1], d[2], v), a.opacity = d[3];
      }
      l.baseColorTexture !== void 0 && c.push(t.assignTexture(a, "map", l.baseColorTexture, J)), a.metalness = l.metallicFactor !== void 0 ? l.metallicFactor : 1, a.roughness = l.roughnessFactor !== void 0 ? l.roughnessFactor : 1, l.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(a, "metalnessMap", l.metallicRoughnessTexture)), c.push(t.assignTexture(a, "roughnessMap", l.metallicRoughnessTexture))), o = this._invokeOne(function(d) {
        return d.getMaterialType && d.getMaterialType(e);
      }), c.push(Promise.all(this._invokeAll(function(d) {
        return d.extendMaterialParams && d.extendMaterialParams(e, a);
      })));
    }
    i.doubleSided === !0 && (a.side = ut);
    const u = i.alphaMode || he.OPAQUE;
    if (u === he.BLEND ? (a.transparent = !0, a.depthWrite = !1) : (a.transparent = !1, u === he.MASK && (a.alphaTest = i.alphaCutoff !== void 0 ? i.alphaCutoff : 0.5)), i.normalTexture !== void 0 && o !== Z && (c.push(t.assignTexture(a, "normalMap", i.normalTexture)), a.normalScale = new O(1, 1), i.normalTexture.scale !== void 0)) {
      const l = i.normalTexture.scale;
      a.normalScale.set(l, l);
    }
    if (i.occlusionTexture !== void 0 && o !== Z && (c.push(t.assignTexture(a, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (a.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && o !== Z) {
      const l = i.emissiveFactor;
      a.emissive = new B().setRGB(l[0], l[1], l[2], v);
    }
    return i.emissiveTexture !== void 0 && o !== Z && c.push(t.assignTexture(a, "emissiveMap", i.emissiveTexture, J)), Promise.all(c).then(function() {
      const l = new o(a);
      return i.name && (l.name = i.name), H(l, i), t.associations.set(l, { materials: e }), i.extensions && K(s, l, i), l;
    });
  }
  /**
   * When Object3D instances are targeted by animation, they need unique names.
   *
   * @private
   * @param {string} originalName
   * @return {string}
   */
  createUniqueName(e) {
    const t = dt.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @private
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(e) {
    const t = this, n = this.extensions, s = this.primitiveCache;
    function i(a) {
      return n[_.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a, t).then(function(r) {
        return Pe(r, a, t);
      });
    }
    const o = [];
    for (let a = 0, r = e.length; a < r; a++) {
      const c = e[a], u = bs(c), l = s[u];
      if (l)
        o.push(l.promise);
      else {
        let d;
        c.extensions && c.extensions[_.KHR_DRACO_MESH_COMPRESSION] ? d = i(c) : d = Pe(new mt(), c, t), s[u] = { primitive: c, promise: d }, o.push(d);
      }
    }
    return Promise.all(o);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   *
   * @private
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh|Line|Points>}
   */
  loadMesh(e) {
    const t = this, n = this.json, s = this.extensions, i = n.meshes[e], o = i.primitives, a = [];
    for (let r = 0, c = o.length; r < c; r++) {
      const u = o[r].material === void 0 ? Ts(this.cache) : this.getDependency("material", o[r].material);
      a.push(u);
    }
    return a.push(t.loadGeometries(o)), Promise.all(a).then(function(r) {
      const c = r.slice(0, r.length - 1), u = r[r.length - 1], l = [];
      for (let m = 0, p = u.length; m < p; m++) {
        const T = u[m], f = o[m];
        let g;
        const w = c[m];
        if (f.mode === k.TRIANGLES || f.mode === k.TRIANGLE_STRIP || f.mode === k.TRIANGLE_FAN || f.mode === void 0)
          g = i.isSkinnedMesh === !0 ? new ft(T, w) : new pt(T, w), g.isSkinnedMesh === !0 && g.normalizeSkinWeights(), f.mode === k.TRIANGLE_STRIP ? g.geometry = Me(g.geometry, Ie) : f.mode === k.TRIANGLE_FAN && (g.geometry = Me(g.geometry, ue));
        else if (f.mode === k.LINES)
          g = new gt(T, w);
        else if (f.mode === k.LINE_STRIP)
          g = new _t(T, w);
        else if (f.mode === k.LINE_LOOP)
          g = new Tt(T, w);
        else if (f.mode === k.POINTS)
          g = new yt(T, w);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + f.mode);
        Object.keys(g.geometry.morphAttributes).length > 0 && Es(g, i), g.name = t.createUniqueName(i.name || "mesh_" + e), H(g, i), f.extensions && K(s, g, f), t.assignFinalMaterial(g), l.push(g);
      }
      for (let m = 0, p = l.length; m < p; m++)
        t.associations.set(l[m], {
          meshes: e,
          primitives: m
        });
      if (l.length === 1)
        return i.extensions && K(s, l[0], i), l[0];
      const d = new re();
      i.extensions && K(s, d, i), t.associations.set(d, { meshes: e });
      for (let m = 0, p = l.length; m < p; m++)
        d.add(l[m]);
      return d;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   *
   * @private
   * @param {number} cameraIndex
   * @return {Promise<Camera>|undefined}
   */
  loadCamera(e) {
    let t;
    const n = this.json.cameras[e], s = n[n.type];
    if (!s) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return n.type === "perspective" ? t = new Et(De.radToDeg(s.yfov), s.aspectRatio || 1, s.znear || 1, s.zfar || 2e6) : n.type === "orthographic" && (t = new bt(-s.xmag, s.xmag, s.ymag, -s.ymag, s.znear, s.zfar)), n.name && (t.name = this.createUniqueName(n.name)), H(t, n), Promise.resolve(t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   *
   * @private
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(e) {
    const t = this.json.skins[e], n = [];
    for (let s = 0, i = t.joints.length; s < i; s++)
      n.push(this._loadNodeShallow(t.joints[s]));
    return t.inverseBindMatrices !== void 0 ? n.push(this.getDependency("accessor", t.inverseBindMatrices)) : n.push(null), Promise.all(n).then(function(s) {
      const i = s.pop(), o = s, a = [], r = [];
      for (let c = 0, u = o.length; c < u; c++) {
        const l = o[c];
        if (l) {
          a.push(l);
          const d = new ne();
          i !== null && d.fromArray(i.array, c * 16), r.push(d);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[c]);
      }
      return new St(a, r);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   *
   * @private
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(e) {
    const t = this.json, n = this, s = t.animations[e], i = s.name ? s.name : "animation_" + e, o = [], a = [], r = [], c = [], u = [];
    for (let l = 0, d = s.channels.length; l < d; l++) {
      const m = s.channels[l], p = s.samplers[m.sampler], T = m.target, f = T.node, g = s.parameters !== void 0 ? s.parameters[p.input] : p.input, w = s.parameters !== void 0 ? s.parameters[p.output] : p.output;
      T.node !== void 0 && (o.push(this.getDependency("node", f)), a.push(this.getDependency("accessor", g)), r.push(this.getDependency("accessor", w)), c.push(p), u.push(T));
    }
    return Promise.all([
      Promise.all(o),
      Promise.all(a),
      Promise.all(r),
      Promise.all(c),
      Promise.all(u)
    ]).then(function(l) {
      const d = l[0], m = l[1], p = l[2], T = l[3], f = l[4], g = [];
      for (let R = 0, b = d.length; R < b; R++) {
        const M = d[R], F = m[R], C = p[R], E = T[R], y = f[R];
        if (M === void 0) continue;
        M.updateMatrix && M.updateMatrix();
        const D = n._createAnimationTracks(M, F, C, E, y);
        if (D)
          for (let P = 0; P < D.length; P++)
            g.push(D[P]);
      }
      const w = new Rt(i, void 0, g);
      return H(w, s), w;
    });
  }
  createNodeMesh(e) {
    const t = this.json, n = this, s = t.nodes[e];
    return s.mesh === void 0 ? null : n.getDependency("mesh", s.mesh).then(function(i) {
      const o = n._getNodeRef(n.meshCache, s.mesh, i);
      return s.weights !== void 0 && o.traverse(function(a) {
        if (a.isMesh)
          for (let r = 0, c = s.weights.length; r < c; r++)
            a.morphTargetInfluences[r] = s.weights[r];
      }), o;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   *
   * @private
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(e) {
    const t = this.json, n = this, s = t.nodes[e], i = n._loadNodeShallow(e), o = [], a = s.children || [];
    for (let c = 0, u = a.length; c < u; c++)
      o.push(n.getDependency("node", a[c]));
    const r = s.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", s.skin);
    return Promise.all([
      i,
      Promise.all(o),
      r
    ]).then(function(c) {
      const u = c[0], l = c[1], d = c[2];
      d !== null && u.traverse(function(m) {
        m.isSkinnedMesh && m.bind(d, Rs);
      });
      for (let m = 0, p = l.length; m < p; m++)
        u.add(l[m]);
      return u;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(e) {
    const t = this.json, n = this.extensions, s = this;
    if (this.nodeCache[e] !== void 0)
      return this.nodeCache[e];
    const i = t.nodes[e], o = i.name ? s.createUniqueName(i.name) : "", a = [], r = s._invokeOne(function(c) {
      return c.createNodeMesh && c.createNodeMesh(e);
    });
    return r && a.push(r), i.camera !== void 0 && a.push(s.getDependency("camera", i.camera).then(function(c) {
      return s._getNodeRef(s.cameraCache, i.camera, c);
    })), s._invokeAll(function(c) {
      return c.createNodeAttachment && c.createNodeAttachment(e);
    }).forEach(function(c) {
      a.push(c);
    }), this.nodeCache[e] = Promise.all(a).then(function(c) {
      let u;
      if (i.isBone === !0 ? u = new xt() : c.length > 1 ? u = new re() : c.length === 1 ? u = c[0] : u = new Oe(), u !== c[0])
        for (let l = 0, d = c.length; l < d; l++)
          u.add(c[l]);
      if (i.name && (u.userData.name = i.name, u.name = o), H(u, i), i.extensions && K(n, u, i), i.matrix !== void 0) {
        const l = new ne();
        l.fromArray(i.matrix), u.applyMatrix4(l);
      } else
        i.translation !== void 0 && u.position.fromArray(i.translation), i.rotation !== void 0 && u.quaternion.fromArray(i.rotation), i.scale !== void 0 && u.scale.fromArray(i.scale);
      if (!s.associations.has(u))
        s.associations.set(u, {});
      else if (i.mesh !== void 0 && s.meshCache.refs[i.mesh] > 1) {
        const l = s.associations.get(u);
        s.associations.set(u, { ...l });
      }
      return s.associations.get(u).nodes = e, u;
    }), this.nodeCache[e];
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   *
   * @private
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(e) {
    const t = this.extensions, n = this.json.scenes[e], s = this, i = new re();
    n.name && (i.name = s.createUniqueName(n.name)), H(i, n), n.extensions && K(t, i, n);
    const o = n.nodes || [], a = [];
    for (let r = 0, c = o.length; r < c; r++)
      a.push(s.getDependency("node", o[r]));
    return Promise.all(a).then(function(r) {
      for (let u = 0, l = r.length; u < l; u++)
        i.add(r[u]);
      const c = (u) => {
        const l = /* @__PURE__ */ new Map();
        for (const [d, m] of s.associations)
          (d instanceof oe || d instanceof ye) && l.set(d, m);
        return u.traverse((d) => {
          const m = s.associations.get(d);
          m != null && l.set(d, m);
        }), l;
      };
      return s.associations = c(i), i;
    });
  }
  _createAnimationTracks(e, t, n, s, i) {
    const o = [], a = e.name ? e.name : e.uuid, r = [];
    U[i.path] === U.weights ? e.traverse(function(d) {
      d.morphTargetInfluences && r.push(d.name ? d.name : d.uuid);
    }) : r.push(a);
    let c;
    switch (U[i.path]) {
      case U.weights:
        c = be;
        break;
      case U.rotation:
        c = Se;
        break;
      case U.translation:
      case U.scale:
        c = Ee;
        break;
      default:
        switch (n.itemSize) {
          case 1:
            c = be;
            break;
          case 2:
          case 3:
          default:
            c = Ee;
            break;
        }
        break;
    }
    const u = s.interpolation !== void 0 ? _s[s.interpolation] : je, l = this._getArrayFromAccessor(n);
    for (let d = 0, m = r.length; d < m; d++) {
      const p = new c(
        r[d] + "." + U[i.path],
        t.array,
        l,
        u
      );
      s.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(p), o.push(p);
    }
    return o;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const n = pe(t.constructor), s = new Float32Array(t.length);
      for (let i = 0, o = t.length; i < o; i++)
        s[i] = t[i] * n;
      t = s;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(n) {
      const s = this instanceof Se ? gs : Ge;
      return new s(this.times, this.values, this.getValueSize() / 3, n);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
  }
}
function ws(h, e, t) {
  const n = e.attributes, s = new Lt();
  if (n.POSITION !== void 0) {
    const a = t.json.accessors[n.POSITION], r = a.min, c = a.max;
    if (r !== void 0 && c !== void 0) {
      if (s.set(
        new I(r[0], r[1], r[2]),
        new I(c[0], c[1], c[2])
      ), a.normalized) {
        const u = pe(X[a.componentType]);
        s.min.multiplyScalar(u), s.max.multiplyScalar(u);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else
    return;
  const i = e.targets;
  if (i !== void 0) {
    const a = new I(), r = new I();
    for (let c = 0, u = i.length; c < u; c++) {
      const l = i[c];
      if (l.POSITION !== void 0) {
        const d = t.json.accessors[l.POSITION], m = d.min, p = d.max;
        if (m !== void 0 && p !== void 0) {
          if (r.setX(Math.max(Math.abs(m[0]), Math.abs(p[0]))), r.setY(Math.max(Math.abs(m[1]), Math.abs(p[1]))), r.setZ(Math.max(Math.abs(m[2]), Math.abs(p[2]))), d.normalized) {
            const T = pe(X[d.componentType]);
            r.multiplyScalar(T);
          }
          a.max(r);
        } else
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    s.expandByVector(a);
  }
  h.boundingBox = s;
  const o = new Ct();
  s.getCenter(o.center), o.radius = s.min.distanceTo(s.max) / 2, h.boundingSphere = o;
}
function Pe(h, e, t) {
  const n = e.attributes, s = [];
  function i(o, a) {
    return t.getDependency("accessor", o).then(function(r) {
      h.setAttribute(a, r);
    });
  }
  for (const o in n) {
    const a = fe[o] || o.toLowerCase();
    a in h.attributes || s.push(i(n[o], a));
  }
  if (e.indices !== void 0 && !h.index) {
    const o = t.getDependency("accessor", e.indices).then(function(a) {
      h.setIndex(a);
    });
    s.push(o);
  }
  return Re.workingColorSpace !== v && "COLOR_0" in n && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Re.workingColorSpace}" not supported.`), H(h, e), ws(h, e, t), Promise.all(s).then(function() {
    return e.targets !== void 0 ? ys(h, e.targets, t) : h;
  });
}
const $ = class $ {
  constructor(e, t) {
    S(this, "mScene");
    S(this, "mTerrain");
    this.mScene = e, this.mTerrain = t;
  }
  //_______________________________________________________
  addLibraryData(e) {
    if (e)
      for (const t of e)
        t.id && $.sLibraryDataMap.set(t.id, t);
  }
  //_______________________________________________________
  addItem(e, t, n, s) {
    s == null && (this.mTerrain && (s = this.mTerrain.heightAtPoint(t, n)), s == null && (s = 0));
    const i = $.sLibraryDataMap.get(e);
    if (!i)
      return;
    i.instances || (i.instances = []);
    const o = (r) => {
      var u;
      const c = r.scene.clone(!0);
      c.position.set(t, s, n), (u = this.mScene) == null || u.addToScene(c), i.instances.push({ object: c, type: i.type ?? null, libId: e });
    };
    if (i.gltf) {
      o(i.gltf);
      return;
    }
    if (i.loadingPromise) {
      i.loadingPromise.then((r) => {
        r && o(r);
      }).catch(() => {
      });
      return;
    }
    const a = new Vt();
    i.loadingPromise = new Promise((r, c) => {
      a.load(
        i.url,
        (u) => {
          i.gltf = u, r(u), o(u);
        },
        void 0,
        (u) => {
          i.loadingPromise = void 0, c(u);
        }
      );
    });
  }
  //_______________________________________________________
  dispose() {
    this.mScene && (this.mScene.dispose(), this.mScene = void 0), this.mTerrain && (this.mTerrain.dispose(), this.mTerrain = void 0);
  }
};
S($, "sLibraryDataMap", /* @__PURE__ */ new Map());
let ge = $;
class Ms {
  /**
   * Register a callback that will be invoked once the terrain is ready.
   * Implementations may call the callback immediately if the terrain is already available.
   */
  onTerrainReady(e) {
    ee.onReadyCallback = e;
  }
}
class Cs {
  constructor() {
    S(this, "mScene");
    S(this, "mTerrain");
    S(this, "mItems");
    S(this, "mLibraryData");
    S(this, "mHooks");
  }
  int(e) {
    this.mScene || (this.mScene = new zt(e));
  }
  //_______________________________________________________
  setTerrain(e, t, n, s, i) {
    this.mScene || this.int(), this.mTerrain = new ee(), this.mTerrain.setTerrain(e, t, n, new A.Vector2(s, i));
    const o = this.mTerrain.getMesh();
    o && this.mScene && this.mScene.addToScene(o);
  }
  //_______________________________________________________
  async setTerrainFromImage(e, t, n, s, i) {
    this.mScene || this.int(), this.mTerrain = new ee(), await this.mTerrain.loadFromImage(e, t, n, new A.Vector2(s, i));
    const o = this.mTerrain.getMesh();
    o && this.mScene && this.mScene.addToScene(o);
  }
  //_______________________________________________________
  /**
   * Forward to Scene to set the OrbitControls look-at target.
   */
  setControlsLookAt(e, t, n) {
    this.mScene || this.int(), this.mScene && this.mScene.setControlsLookAt(e, t, n);
  }
  //_______________________________________________________
  /**
   * Forward to Scene to set the OrbitControls look-at target from an Object3D.
   */
  setControlsLookAtObject(e) {
    this.mScene || this.int(), this.mScene && this.mScene.setControlsLookAtObject(e);
  }
  get hooks() {
    return this.mHooks || (this.mHooks = new Ms()), this.mHooks;
  }
  //_______________________________________________________
  setLibraryData(e) {
    this.mLibraryData = e, this.mItems || (this.mItems = new ge(this.mScene, this.mTerrain)), this.mItems.addLibraryData(e);
  }
  //_______________________________________________________
  addItem(e, t, n, s) {
    this.mItems && this.mItems.addItem(e, t, n, s);
  }
  //_______________________________________________________
  dispose() {
    this.mScene && (this.mScene.dispose(), this.mScene = void 0), this.mTerrain && (this.mTerrain.dispose(), this.mTerrain = void 0);
  }
}
export {
  Cs as Manager
};
