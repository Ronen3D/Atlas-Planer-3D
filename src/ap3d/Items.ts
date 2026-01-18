// load item from library and add to scene at position
// the item is in glb format
// if Y is omitted, the item is placed on the terrain at (X,Z)

import { Scene } from "./Scene";
import { Terrain } from "./Terrain";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Items {
    private mScene?: Scene;
    private mTerrain?: Terrain;
    private static sLibraryDataMap: Map<string, any> = new Map<string, any>();

    constructor(scene?: Scene, terrain?: Terrain) {
        this.mScene = scene;
        this.mTerrain = terrain;
    }
    //_______________________________________________________

    public addLibraryData(pData: Array<any>): void {
        if (pData) {
            for (const item of pData) {
                if (item.id) {
                    Items.sLibraryDataMap.set(item.id, item);
                }
            }
        }
    }
    //_______________________________________________________

    public addItem(pItemLibraryId: string, x: number, z: number, y?: number): void {
        // compute Y using terrain if omitted
        if (y == null) {
            if (this.mTerrain) {
                y = this.mTerrain.heightAtPoint(x, z);
            }
            if (y == null) {
                y = 0;
            }
        }

        const itemEntry = Items.sLibraryDataMap.get(pItemLibraryId);
        if (!itemEntry) {
            return;
        }

        // ensure instance list is present on the entry (used to save items ordered by type)
        if (!itemEntry.instances) {
            itemEntry.instances = [];
        }

        const addCloneToScene = (gltf: any) => {
            const obj = gltf.scene.clone(true);
            obj.position.set(x, y!, z);
            this.mScene?.addToScene(obj);
            // save instance: keep a minimal record (object reference and type if available)
            itemEntry.instances.push({ object: obj, type: itemEntry.type ?? null, libId: pItemLibraryId });
        };

        // if already loaded -> clone immediately
        if (itemEntry.gltf) {
            addCloneToScene(itemEntry.gltf);
            return;
        }

        // if loading in progress -> queue clone after load
        if (itemEntry.loadingPromise) {
            itemEntry.loadingPromise.then((gltf: any) => {
                if (gltf) addCloneToScene(gltf);
            }).catch(() => { /* ignore load errors for now */ });
            return;
        }

        // not loaded yet -> start loading and save promise on the entry
        const loader = new GLTFLoader();
        itemEntry.loadingPromise = new Promise((resolve, reject) => {
            loader.load(
                itemEntry.url,
                (gltf) => {
                    // keep the original loaded gltf for future clones
                    itemEntry.gltf = gltf;
                    // resolve promise and add the first clone
                    resolve(gltf);
                    addCloneToScene(gltf);
                },
                undefined,
                (err) => {
                    // clear loadingPromise on error so future attempts can retry
                    itemEntry.loadingPromise = undefined;
                    reject(err);
                }
            );
        });
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

