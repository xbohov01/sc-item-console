import FpsWeapon from "./models/FpsWeapon";
import { DataItem } from "./models/DataItem";
import { Location } from "./models/Location";
import FpsAttachment from "./models/FpsAttachment";
import ShipPurchase from "./models/ShipPurchase";
import ShipRental, { RentalLocation, RentalPrice } from "./models/ShipRental";

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

export function ParseShipPurchases(data:DataItem[]):ShipPurchase[]{
  let parsed:ShipPurchase[] = []

  for (let item of data){
    let parsedItem = new ShipPurchase();
    let keys = Object.keys(item);

    let locationKeys = keys.filter(k => k != 'Name' && k != 'Manufacturer');

    parsedItem.Name = item['Name']; 
    parsedItem.Manufacturer = item['Manufacturer'];

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

export function ParseShipRentals(data:DataItem[]):ShipRental[]{
  let parsed:ShipRental[] = []

  for (let item of data){
    let parsedItem = new ShipRental();
    let keys = Object.keys(item);

    let priceKeys = ['1 Day', '3 Days', '7 Days', '30 Days'];

    let locationKeys = keys.filter(k => k != 'Name' && k != 'Manufacturer' && !priceKeys.includes(k));

    parsedItem.Name = item['Name']; 
    parsedItem.Manufacturer = item['Manufacturer'];

    let locations: RentalLocation[] = [];

    for (let key of locationKeys){
      if (item[key] == 'y'){
        let prices:RentalPrice[] = [];

        for (let price of priceKeys){
          prices.push(new RentalPrice(price, parseInt(item[price])));
        }

        locations.push(new RentalLocation(key, prices));
      }
    }
    parsedItem.RentalLocations = locations.sort((a,b) => a.Prices[0].Price > b.Prices[0].Price ? 1 : -1);
    parsed.push(parsedItem);
  }
  return parsed;
}