import { ItemBase } from "./ItemBase";

export class RentalPrice{
  Type!:string;
  Price!:number;

  constructor(type:string, price:number){
    this.Type = type;
    this.Price = price;
  }
}

export class RentalLocation {
  Name!: string;
  Prices!: RentalPrice[];

  constructor(name:string, prices:RentalPrice[]){
    this.Name = name;
    this.Prices = prices;
  }
}

export default class ShipRental extends ItemBase{
  Manufacturer!:string;
  RentalLocations!:RentalLocation[];

  constructor(){
    super()
  }

  GetTitle(){
    return `${this.Name} - ${this.Manufacturer}`
  }
}