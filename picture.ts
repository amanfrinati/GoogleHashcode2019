export class Picture {
  id: string;
  type: string;
  nTag: number;
  tags: string[];

  constructor(object?: any) {
    if (object) {
      for (const key of Object.keys(object)) {
        this[key] = object[key];
      }
    }
  }
}