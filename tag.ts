import { Picture } from "./picture";

export class Tag {
  tag: string;
  slides: Picture[];

  constructor(object?: any) {
    if (object) {
      for (const key of Object.keys(object)) {
        this[key] = object[key];
      }
    }
  }

  get nOccurency(): number {
    return this.slides.length;
  }
}