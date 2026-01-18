import { Scene } from './Scene';
import { Terrain } from './Terrain';
import { Item } from './Item';
import { Items } from './Items';
import * as THREE from 'three';
import { Hooks } from './Hooks';

export class Manager {
    private mScene?: Scene;
    private mTerrain?: Terrain;
    private mItems?: Items;
    private mHooks?: Hooks;


    int(container?: HTMLElement): void {
        if (!this.mScene) {
            this.mScene = new Scene(container);
        }
        if (!this.mTerrain) {
        this.mTerrain = new Terrain();
        }
        if (!this.mItems) {
            this.mItems = new Items(this.mScene, this.mTerrain);
        }
    }
    //_______________________________________________________

    public setTerrain(pData: number[][], pHorizontalDistance: number, pVerticalDistance: number, pXCenterUUT: number, pYCenterUUT: number): void {
        this.mTerrain?.setTerrain(pData, pHorizontalDistance, pVerticalDistance, new THREE.Vector2(pXCenterUUT, pYCenterUUT));
        const mesh = this.mTerrain?.getMesh();
        if (mesh && this.mScene) {
            this.mScene.addToScene(mesh);
        }
    }
    //_______________________________________________________

    public async setTerrainFromImage(url: string, pHorizontalDistance: number, pVerticalDistance: number, pXCenterUUT: number, pYCenterUUT: number): Promise<void> {
        await this.mTerrain?.loadFromImage(url, pHorizontalDistance, pVerticalDistance, new THREE.Vector2(pXCenterUUT, pYCenterUUT));
        const mesh = this.mTerrain?.getMesh();
        if (mesh && this.mScene) {
            this.mScene.addToScene(mesh);
        }
    }
    //_______________________________________________________

    /**
     * Forward to Scene to set the OrbitControls look-at target.
     */
    public setControlsLookAt(x: number, y: number, z: number): void {
        if (this.mScene) {
            this.mScene.setControlsLookAt(x, y, z);
        }
    }
    //_______________________________________________________

    /**
     * Forward to Scene to set the OrbitControls look-at target from an Object3D.
     */
    public setControlsLookAtObject(obj: THREE.Object3D): void {
        if (this.mScene) {
            this.mScene.setControlsLookAtObject(obj);
        }
    }
    //_______________________________________________________

    public get hooks(): Hooks {
        if (!this.mHooks) {
            this.mHooks = new Hooks();
        }
        return this.mHooks;
    }
    //_______________________________________________________

    public setLibraryData(pData: any): void {
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

    public getItemsList(): Item[] {
        if (!this.mItems)
            return [];
        return this.mItems.getItemsList();
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
    //_______________________________________________________
    public focusOnItemById(itemId: string): void {
        if (!this.mItems || !this.mScene) {
            return;
        }
        const item = this.mItems.getItemById(itemId);
        if (item && item.object) {
            this.mScene.setControlsLookAtObject(item.object);
        }
    }   
}

