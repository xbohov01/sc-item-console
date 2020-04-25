import { ItemBase } from "./ItemBase";

export default class FpsWeapon extends ItemBase{
  Type!:string;

  constructor(){
    super();
  }

  GetTitle(){
    return `${this.Name} - ${this.Type}`
  }
}