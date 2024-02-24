

// to fix:
// - DOM individual calls -> update HUD function
// - XP calculation & levels, attributes
// - Damage calculation
// - Dodge functionality (gives extra attack on success etc.)
// - don't take damage on successful attack
// - check inventory

// Player Data
const player = {
    xp: 0,
    health: 100
};

// Inventory Data
const inventory = {
    gold: 50,
    currentWeapon: 0,
    items: ["stick"],
    weapons: []
};

// Battle Data
let fighting;
let monsterHealth;

// DOM Elements
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// images
dragonImage = document.createElement("img");
dragonImage.src = "img/dragon.jpg";

townImage = document.createElement("img");
townImage.src = "img/town.jpg";

caveImage = document.createElement("img");
caveImage.src = "img/cave.jpg";

storeImage = document.createElement("img");
storeImage.src = "img/store.jpg";

monsterImage = document.createElement("img");
monsterImage.src = "img/monster.jpg";

defeatedMonsterImage = document.createElement("img");
defeatedMonsterImage.src = "img/defeatedMonster.jpg";

gameOverImage = document.createElement("img");
gameOverImage.src = "img/gameover.jpg";

winImage = document.createElement("img");
winImage.src = "img/win.jpg";



// World Information

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters = [
    {name: "slime", level: 2, health: 15},
    {name: "fanged beast", level: 8, health: 60},
    {name: "dragon", level: 20, health: 300}
]

const locations = [{
    name: "town",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\".",
    image: townImage
},
{
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
    image: storeImage
},
{
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters.",
    image: caveImage
},
{name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
    image: monsterImage
},
{name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Stay in cave"],
    "button functions": [goTown, goTown, goCave],
    text: "The monster screams Arg! as it dies. You gain experience points and find gold.",
    image: defeatedMonsterImage
},
{name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;",
    image: gameOverImage
},
{name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;",
    image: winImage
}
];


// Location change functions
function update(location) {
    monsterStats.style.display = 'none';

    button1.innerHTML = location["button text"][0];
    button2.innerHTML = location["button text"][1];
    button3.innerHTML = location["button text"][2];

    text.innerHTML = location.text;

    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];

    document.querySelector("#screen-container").removeChild(document.querySelector("#screen-container").firstChild);
    document.querySelector("#screen-container").appendChild(location.image);
}

function goTown() {  
    update(locations[0]); 
}

function goStore() {
    update(locations[1]); 
}

function goCave() {
    update(locations[2]);
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;

    monsterStats.style.display = 'block';

    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsters[fighting].health;
}


// Store functions
function buyHealth() {
    if (inventory.gold >= 10) {
        inventory.gold -= 10;
        player.health += 10;
        goldText.innerText = inventory.gold;
        healthText.innerText = player.health;
        text.innerText = "Health purchased.";
    }
    else {
        text.innerText = "You don't have enough gold to buy health.";
    }
}

function buyWeapon() {
    if (inventory.currentWeapon < weapons.length - 1) {
        if (inventory.gold >= 30) {
          inventory.gold -= 30;
          inventory.currentWeapon++;
          goldText.innerText = inventory.gold;
          let newWeapon = weapons[inventory.currentWeapon].name;
          text.innerText = "You now have a " + newWeapon + ".";
          inventory.items.push(newWeapon);
          text.innerText += " In your inventory you have: " + inventory.items;
        } else {
          text.innerText = "You do not have enough gold to buy a weapon.";
        }
      } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
      } 
}

function sellWeapon() {
    if (inventory.length > 1) {
        inventory.gold += 15;
        goldText.innerText = inventory.gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
      } else {
        text.innerText = "Don't sell your only weapon!";
    }
}


// Battle functions
function fightSlime() {
 fighting = 0;
 goFight();
}

function fightBeast() {
 fighting = 1;
 goFight();
}

function fightDragon() {
 fighting = 2;
 goFight();
}

function attack() {
    text.innerText = `The ${monsters[fighting].name} attacks.`
    text.innerText += ` You attack it with your ${weapons[inventory.currentWeapon].name}.`

    if (isMonsterHit()) {
        monsterHealth -= weapons[inventory.currentWeapon].power + Math.floor(Math.random() * player.xp) + 1;
    } else {text.innerText += " You miss."}

    healthText.innerText = player.health;
    monsterHealthText.innerText = monsterHealth;

    if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame();
        } else {defeatMonster();}
      } 
    else {monsterAttack();}
}

function monsterAttack() {
    player.health -= getMonsterAttackValue(monsters[fighting].level);
    healthText.innerText = player.health;
    if (player.health <= 0) {
        lose();
    }
}

function isMonsterHit() {
    return Math.random() > .2 || player.health < 20;
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * player.xp));

    return hit > 0 ? hit : 0;
}

function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
    inventory.gold += Math.floor(monsters[fighting].level * 6.7);
    player.xp += monsters[fighting].level;

    goldText.innerText = inventory.gold;
    xpText.innerText = player.xp;

    update(locations[4]);
}


// Game Over functions
function lose() {
    update(locations[5]);
}

function restart() {
    player.xp = 0;
    player.health = 100;
    inventory.gold = 50;
    inventory.currentWeapon = 0;
    inventory.items = ['stick'];

    goldText.innerText = inventory.gold;
    healthText.innerText = player.health;
    xpText.innerText = player.xp;

    goTown();
}

function winGame() {
    update(locations[6]);
}



