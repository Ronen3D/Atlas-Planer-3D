import { Item } from "./Item";
import { Scene } from "./Scene";
import { Terrain } from "./Terrain";

/**
 * Hooks container for ap3d consumers.
 * TTerrain: concrete terrain object type provided by the engine.
 */
export class Hooks {
    /**
     * Register a callback that will be invoked once the terrain is ready.
     * Implementations may call the callback immediately if the terrain is already available.
     */
    public onTerrainReady(pMethod: () => void): void {
        Terrain.onReadyCallback = pMethod;
    }

    public onClick(pMethod: (item:Item,x:number,y:number,z:number) => void){
        Scene.onClickCallback = pMethod;
    }
}