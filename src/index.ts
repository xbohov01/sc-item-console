import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';
import fs from 'fs';
import csv from 'csv-parse';
import readline from 'readline';
import FpsWeapon from './models/FpsWeapon';
import { ParseFpsWeapons } from './parsers';
import { emit } from 'cluster';
import { ItemBase } from './models/ItemBase';

const fpsPath = "./sheets/fps-weapons.csv"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'ICLI>'
})

let data:any[] = [];
let fpsWeapons:FpsWeapon[] = [];

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
  console.log(chalk.redBright('FPS Weapons sheet missing in /sheets folder'));
}

//User interface
console.log('Enter your search phase bellow');
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
  Output(found, 'FPS Weapons', 'fps');
  //Search and output Attachments

  //Search and output Armors

  console.log(chalk.greenBright('-----------------------------------------'))
  console.log(chalk.greenBright('End of found items'))
  console.log(chalk.greenBright('-----------------------------------------'))
}

///give the item classes a print method, retype based on argument and use the classes print to log title
function Output(items:ItemBase[], title:string, type:string = ''){
  console.log(chalk.greenBright('-----------------------------------------'))
  console.log(chalk.greenBright(`${title}`))
  console.log(chalk.greenBright('-----------------------------------------'))
  let itemTitle:string;
  for (let item of items){
    switch (type) {
      case 'fps':
        itemTitle = (item as FpsWeapon).GetTitle();
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








