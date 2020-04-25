import FpsWeapon from "./models/FpsWeapon";
import { DataItem } from "./models/DataItem";
import { Location } from "./models/Location";
import FpsAttachment from "./models/FpsAttachment";

export function ParseFpsWeapons(data:DataItem[]):FpsWeapon[]{
  let parsed:FpsWeapon[] = []

  for (let item of data){
    let parsedItem = new FpsWeapon();
    let keys = Object.keys(item);

    let locationKeys = keys.filter(k => k != 'Name' && k != 'Type');

    parsedItem.Name = item['Name']; 
    parsedItem.Type = item['Type'];

    let locations: Location[] = [];
    for (let key of locationKeys){
      if (item[key] !== ''){
        locations.push(new Location(key, parseInt(item[key])));
      }
    }
    parsedItem.Locations = locations.sort((a,b) => a.Price > b.Price ? 1 : -1);
    parsed.push(parsedItem);
  }

  return parsed;
}

export function ParseFpsAttachments(data:DataItem[]):FpsAttachment[]{
  let parsed:FpsAttachment[] = []

  for (let item of data){
    let parsedItem = new FpsAttachment();
    let keys = Object.keys(item);

    let locationKeys = keys.filter(k => k != 'Name' && k != 'Type');

    parsedItem.Name = item['Name']; 
    parsedItem.Type = item['Type'];

    let locations: Location[] = [];
    for (let key of locationKeys){
      if (item[key] !== ''){
        locations.push(new Location(key, parseInt(item[key])));
      }
    }
    parsedItem.Locations = locations.sort((a,b) => a.Price > b.Price ? 1 : -1);
    parsed.push(parsedItem);
  }

  return parsed;
}