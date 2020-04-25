import { Location } from "./Location";
export abstract class ItemBase {
  Name!: string;
  Locations: Location[];
  constructor() {
    this.Locations = [];
  }

  abstract GetTitle():string;
}
