import { Scene } from './Scene';
import { Terrain } from './Terrain';
import { Items } from './Items';
import * as THREE from 'three';
import { Hooks } from './Hooks';

export class Manager {
    private mScene?: Scene;
    private mTerrain?: Terrain;
    private mItems?: Items;
    private mLibraryData: any;
    private mHooks?: Hooks;


    int(container?: HTMLElement): void {
        if (!this.mScene) {
            this.mScene = new Scene(container);
        }
    }
    //_______________________________________________________

    public setTerrain(pData: number[][], pHorizontalDistance: number, pVerticalDistance: number, pXCenterUUT: number, pYCenterUUT: number): void {
        if (!this.mScene) this.int();
       this.mTerrain = new Terrain();
        this.mTerrain.setTerrain(pData, pHorizontalDistance, pVerticalDistance, new THREE.Vector2(pXCenterUUT, pYCenterUUT));
        const mesh = this.mTerrain.getMesh();
        if (mesh && this.mScene) {
            this.mScene.addToScene(mesh);
        }
    }
    //_______________________________________________________

    public async setTerrainFromImage(url: string, pHorizontalDistance: number, pVerticalDistance: number, pXCenterUUT: number, pYCenterUUT: number): Promise<void> {
        if (!this.mScene) this.int();

        this.mTerrain = new Terrain();
        await this.mTerrain.loadFromImage(url, pHorizontalDistance, pVerticalDistance, new THREE.Vector2(pXCenterUUT, pYCenterUUT));
        const mesh = this.mTerrain.getMesh();
        if (mesh && this.mScene) {
            this.mScene.addToScene(mesh);
        }
    }

    //_______________________________________________________
    /**
     * Forward to Scene to set the OrbitControls look-at target.
     */
    public setControlsLookAt(x: number, y: number, z: number): void {
        if (!this.mScene) this.int();
        if (this.mScene) {
            this.mScene.setControlsLookAt(x, y, z);
        }
    }

    //_______________________________________________________
    /**
     * Forward to Scene to set the OrbitControls look-at target from an Object3D.
     */
    public setControlsLookAtObject(obj: THREE.Object3D): void {
        if (!this.mScene) this.int();
        if (this.mScene) {
            this.mScene.setControlsLookAtObject(obj);
        }
    }

    public get hooks(): Hooks {
        if (!this.mHooks) {
            this.mHooks = new Hooks();
        }
        return this.mHooks;
    }
    //_______________________________________________________

    public setLibraryData(pData: any): void {
        this.mLibraryData = pData;
        if (!this.mItems) this.mItems = new Items(this.mScene, this.mTerrain);
        this.mItems.addLibraryData(pData);
    }
    //_______________________________________________________

    public addItem(pItemId: string, x: number, z: number, y?: number): void {
        if (!this.mItems) {
            return;
        }
        this.mItems.addItem(pItemId, x, z, y);
    }
    //_______________________________________________________

    dispose(): void {
        if (this.mScene) {
            this.mScene.dispose();
            this.mScene = undefined;
        }
        if (this.mTerrain) {
            this.mTerrain.dispose();
            this.mTerrain = undefined;
        }
    }

}

