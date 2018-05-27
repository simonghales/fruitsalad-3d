import {JSONLoader} from 'three-full';

let loader = new JSONLoader();

export const ASSET_FRUIT_BANANA_ID = 'banana';

export interface FruitAssets {
  geometry: {},
  materials: [],
}

export class ThreeJSAssets {

  fruit: {
    [key: string]: FruitAssets,
  } = {
    [ASSET_FRUIT_BANANA_ID]: {
      geometry: null,
      materials: null,
    }
  };

  getFruitAssets(fruit: string): FruitAssets {
    return this.fruit[fruit];
  }

  storeFruitAssets(fruit: string, assets) {
    this.fruit[fruit] = assets;
  }

  loadBananaAssets() {

    return new Promise((resolve) => {

      loader.load(`${process.env.PUBLIC_URL}/assets/models/Banana/Banana_re25.json`, (geometry, materials) => {
        materials.forEach(function (material) {
          material.skinning = true;
          material.morphTargets = true;
          material.flatShading = true;
        });
        this.storeFruitAssets(ASSET_FRUIT_BANANA_ID, {geometry, materials});
        resolve({
          geometry,
          materials,
        });
      });

    });

  }

  loadRequiredAssets() {

    return this.loadBananaAssets();

  }

}

export const threejsAssets = new ThreeJSAssets();