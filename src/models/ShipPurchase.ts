import { ItemBase } from "./ItemBase";

export default class ShipPurchase extends ItemBase{
  Manufacturer!:string;

  constructor(){
    super();
  }

  GetTitle(){
    return `${this.Name} - ${this.Manufacturer}`
  }
}