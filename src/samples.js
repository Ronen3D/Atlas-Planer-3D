import { add } from "three/tsl";
import { Manager } from "/ap3d/index.ts";

console.log("Sample JS file");

// Example usage of the ap3d module
// init a new scene
const div3D = document.getElementById('app');
const moduleManager = new Manager();
if (div3D) {
    moduleManager.int(div3D);
}



// or load terrain from an image

moduleManager.setTerrainFromImage('/images/Terrain07.png', 2, 30, 0, 0);

// create a simple terrain
/*
const terrainData = [
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0]
];
moduleManager.setTerrain(terrainData, 1,1);

*/

// load library's JSON as library data once terrain is ready for getting items' height according to the terrain
const data = await loadLibraryDataAsync('/Data/library.json');
moduleManager.setLibraryData(data);

moduleManager.hooks.onTerrainReady(async () => {
    console.log("Terrain is ready!");
    addRandomItems();
});

function addRandomItems() {
    // Add random items to the scene
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomX = Math.random() * 400 - 200;
        const randomY = Math.random() * 400 - 200;
        moduleManager.addItem(data[5 /*randomIndex*/ ].id, randomX, randomY);
    }
}

async function loadLibraryDataAsync(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading library data:', error);
    }
}



