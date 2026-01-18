import { Manager } from "/ap3d/index.ts";

console.log("Sample JS file");

export class Atlas3DPlanerSample {
    constructor() {
        this.moduleManager = new Manager();
        this.data = null;

    }
    //_______________________________________________________

    async init() {
        // Initialize the 3D scene
        const div3D = document.getElementById('app');
        if (div3D) {
            this.moduleManager.int(div3D);
        }

        // Load library data
        this.data = await this.loadLibraryDataAsync('/Data/library.json');
        this.moduleManager.setLibraryData(this.data);

        // Setup terrain ready callback
        this.moduleManager.hooks.onTerrainReady(async () => {
            console.log("Terrain is ready!");
            this.addRandomItems();
        });

        // Load terrain from image
        await this.moduleManager.setTerrainFromImage('/images/Terrain07.png', 2, 50, 0, 0);
    }
    //_______________________________________________________

    focuseOnItemById(itemId) {
        this.moduleManager.focusOnItemById(itemId);
    }
    //_______________________________________________________

    addRandomItems() {
        // Add random items to the scene
        for (let i = 0; i < 50; i++) {
            const randomIndex = Math.floor(Math.random() * this.data.length);
            const randomX = Math.random() * 4000 - 2000;
            const randomY = Math.random() * 4000 - 2000;
            this.moduleManager.addItem(this.data[randomIndex].id, randomX, randomY);
        }
    }
    //_______________________________________________________

    async loadLibraryDataAsync(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading library data:', error);
        }
    }
    //_______________________________________________________

    getItemsList() {
        return this.moduleManager.getItemsList();
    }
}



