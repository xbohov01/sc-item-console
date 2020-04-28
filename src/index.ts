import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import fs from 'fs';
import csv from 'csv-parse';
import readline from 'readline';
import FpsWeapon from './models/FpsWeapon';
import { ParseFpsWeapons, ParseFpsAttachments, ParseShipPurchases, ParseShipRentals } from './parsers';
import { ItemBase } from './models/ItemBase';
import FpsAttachment from './models/FpsAttachment';
import ShipPurchase from './models/ShipPurchase';
import ShipRental from './models/ShipRental';

const fpsPath = './sheets/fps-weapons.csv';
const fpsAttachmentsPath = './sheets/fps-attachments.csv';
const shipPurchasePath = './sheets/ship-purchase.csv';
const shipRentalPath = './sheets/ship-rental.csv';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'ICLI>'
})

let fpsWeapons:FpsWeapon[] = [];
let fpsAttachments:FpsAttachment[] = [];
let shipPurchases:ShipPurchase[] = [];
let shipRentals:ShipRental[] = [];

clear();
console.log(
  chalk.blueBright(
    figlet.textSync('item-cli', { 
      horizontalLayout: 'full',
    })
  )
);

//console.log('Loading fps weapons sheet');
try {
  let data:any[] = [];
  if (fs.existsSync(fpsPath)){
    //console.log('FPS Weapons sheet loaded');
    fs.createReadStream(fpsPath)
    .pipe(csv({
      from_line: 3, columns: true
    }))
    .on('data', (row:any) => data.push(row))
    .on('end', () => {
      //FPS Weapons parse
      fpsWeapons = ParseFpsWeapons(data);
      //console.log(chalk.greenBright('FPS Weapons sheet parsed'));
    });
  }
}
catch(err){
  console.error('FPS Weapons sheet missing in /sheets folder');
}

try {
  let data:any[] = [];
  if (fs.existsSync(fpsAttachmentsPath)){
    //console.log('FPS Attachments sheet loaded');
    fs.createReadStream(fpsAttachmentsPath)
    .pipe(csv({
      from_line: 3, columns: true
    }))
    .on('data', (row:any) => data.push(row))
    .on('end', () => {
      //FPS Attachments parse
      fpsAttachments = ParseFpsAttachments(data);
      //console.log(chalk.greenBright('FPS Attachments sheet parsed'));
    });
  }
} catch(err){
  console.error('FPS Attachments sheet missing in /sheets folder');
}

try {
  let data:any[] = [];
  if (fs.existsSync(shipPurchasePath)){
    //console.log('Ship purchase sheet loaded');
    fs.createReadStream(shipPurchasePath)
    .pipe(csv({
      from_line: 3, columns: true
    }))
    .on('data', (row:any) => data.push(row))
    .on('end', () => {
      //Ship purchase parse
      shipPurchases = ParseShipPurchases(data);
      //console.log(chalk.greenBright('Ship purchase sheet parsed'));
    });
  }
} catch(err){
  console.error('Ship purchases sheet missing in /sheets folder');
}

try {
  let data:any[] = [];
  if (fs.existsSync(shipRentalPath)){
    //console.log('Ship renta; sheet loaded');
    fs.createReadStream(shipRentalPath)
    .pipe(csv({
      from_line: 3, columns: true
    }))
    .on('data', (row:any) => data.push(row))
    .on('end', () => {
      //Ship purchase parse
      shipRentals = ParseShipRentals(data);
      //console.log(chalk.greenBright('Ship purchase sheet parsed'));
    });
  }
} catch(err){
  console.error('Ship rentals sheet missing in /sheets folder');
}

//User interface
console.log('Enter your search phase below');
console.log('Supports partial or complete item names');
console.log('Close the window or type "quit" to exit.');
console.log(chalk.greenBright('----------------------------------------'));

GetInput();

function GetInput(){
  rl.question('Full or partial name of the item you are searching for:\n', (input:string) => {
    if(input == 'quit'){
      console.log('Exiting');
      process.exit(0);
    }

    if(input != ''){
      SearchAndOutput(input);
    }
    
    GetInput();
  });
}

function SearchAndOutput(searchPhrase:string){
  //Search and output FPS Weapons
  let found:ItemBase[] = fpsWeapons.filter(w => w.Name.toLowerCase().includes(searchPhrase.toLowerCase()));
  if (found.length > 0){
    Output(found, 'FPS Weapons', 'fps');
  }
  //Search and output Attachments
  found = fpsAttachments.filter(w => w.Name.toLowerCase().includes(searchPhrase.toLowerCase()));
  if (found.length > 0){
    Output(found, 'Attachments', 'atts');
  }
  //Search and output Ship purchases
  found = shipPurchases.filter(s => 
    s.Name.toLowerCase().includes(searchPhrase.toLowerCase()) 
    || s.Manufacturer.toLowerCase().includes(searchPhrase.toLowerCase()));
  if (found.length > 0){
    Output(found, 'Ships', 'shp');
  }

  //Search and output Ship rentals
  found = shipRentals.filter(s => 
    s.Name.toLowerCase().includes(searchPhrase.toLowerCase()) 
    || s.Manufacturer.toLowerCase().includes(searchPhrase.toLowerCase()));
  if (found.length > 0){
    Output(found, 'Rentals', 'rnt');
  }


  console.log(chalk.greenBright('-----------------------------------------'))
  console.log(chalk.greenBright('End of found items'))
  console.log(chalk.greenBright('-----------------------------------------'))
}

function OutputRentals(items:ShipRental[]){
  for (let item of items){
    console.log(chalk.yellowBright(item.GetTitle()));
    for(let location of item.RentalLocations){
      console.log(`   ${location.Name}`);
      for (let price of location.Prices){
        console.log(`     ${price.Type} - ${price.Price} aUEC`);
      }
    }
    if (item.RentalLocations.length == 0){
      console.log(chalk.red('   Rental not available at any location'));
    }
  }
}

function Output(items:ItemBase[], title:string, type:string = ''){
  console.log(chalk.greenBright('-----------------------------------------'))
  console.log(chalk.greenBright(`${title}`))
  console.log(chalk.greenBright('-----------------------------------------'))

  if (type == 'rnt'){
    OutputRentals(items as ShipRental[]);
    console.log('-----------------------------------------');
    return;
  }

  let itemTitle:string;
  for (let item of items){
    switch (type) {
      case 'fps':
        itemTitle = (item as FpsWeapon).GetTitle();
        break;

      case 'atts':
        itemTitle = (item as FpsAttachment).GetTitle();
        break;

      case 'shp':
        itemTitle = (item as ShipPurchase).GetTitle();
        break;
    
      default:
        itemTitle = item.Name;
        break;
    }
    console.log(chalk.yellowBright(itemTitle));
    for (let location of item.Locations){
      console.log(`   ${location.Name} - ${location.Price} aUEC`);
    }
    if (item.Locations.length == 0){
      console.log(chalk.red('   Item not available at any location'));
    }
    console.log('-----------------------------------------')
  }
}








