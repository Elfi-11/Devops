import chalk from 'chalk';

export class Character {
    constructor(name, classe, maxHp, damage, speed) {
        this.name = name;
        this.classe = classe;
        this.maxHp = maxHp;
        this.damage = damage;
        this.speed = speed;
        this.init();
    };
    
    attack(target) {
        const diceValue = Math.floor(Math.random() * 20) + 1;
        console.log(`Résultat du dé 20 : ${diceValue}`);
        switch (diceValue) {
            case 1:
                console.log(chalk.red(`${this.name} se blesse lui-même !`));
                this.hp -= this.damage;
                break;
            case 2:
                console.log(chalk.green(`${this.name} rate le coup porté à ${target.name} !`));
                break;
            case 19:
                console.log(chalk.yellow(`${this.name} attaque ${target.name} et inflige ${this.damage} points de dégâts !`));
                target.hp -= this.damage;
                break;
            case 20:
                console.log(chalk.green(`${this.name} inflige un coup critique à ${target.name} !`));
                target.hp -= this.damage * 2;
                break;
            default:
                const damagePerDiceFace = this.damage / 20;
                console.log(chalk.yellow(`${this.name} attaque ${target.name} et inflige ${Math.floor(damagePerDiceFace * diceValue)} points de dégâts !`));
                target.hp -= Math.floor(damagePerDiceFace * diceValue);
                break;
        }
    };
    
    init(){
        this.hp = this.maxHp;
    }
    
    get isAlive(){
        return this.hp > 0;
    }
}

export const characterList = [
    new Character("Mathys", "Mage", 60, 8, 10),
    new Character("Rémi", "Mage noir", 60, 13, 8),
    new Character("Micael", "Voleur", 50, 15, 20),
    new Character("Romain", "Guerrier", 150, 9, 10),
    new Character("Marina", "Barbare", 100, 15, 12),
    new Character("François", "Golem", 300, 4, 1),
];