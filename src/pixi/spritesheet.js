import * as PIXI from "pixi.js";

export class SpritesheetHandler {

  texture = null;
  json = null;
  walkingSpritesheet = null;
  walkingFrames = [];
  frames = {
    idle: [],
    running: [],
    walking: [],
    waving: [],
  };

  constructor(texture, json) {
    this.texture = texture;
    this.json = json;
  }

  createFrames(multiple: boolean = false) {

    return new Promise((resolve, reject) => {

      this.walkingSpritesheet = new PIXI.Spritesheet(this.texture, this.json);

      this.walkingSpritesheet.parse(() => {

        this.walkingFrames = Object.keys(this.walkingSpritesheet.textures).map((t) => this.walkingSpritesheet.textures[t]);

        if (multiple) {
          const textures = this.walkingSpritesheet.textures;
          Object.keys(this.walkingSpritesheet.textures).forEach((t) => {
            const splitName = t.split('_');
            const action = splitName[1];
            if (!this.frames[action]) {
              this.frames[action] = [];
            }
            this.frames[action].push(textures[t]);
          });
        }

        resolve();
      });

    });

  }

  getAnimationFrames(animation: string) {
    return this.frames[animation];
  }

}