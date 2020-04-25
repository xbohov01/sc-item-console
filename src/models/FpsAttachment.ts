import { ItemBase } from "./ItemBase";

export default class FpsAttachment extends ItemBase{
  Type!:string;

  constructor(){
    super();
  }

  GetTitle(){
    return `${this.Name} - ${this.Type}`
  }
}