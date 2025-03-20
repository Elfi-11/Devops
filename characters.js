import chalk from 'chalk';

export class Character {
    constructor(name, classe, maxHp, damage, speed, type) {
        this.name = name;
        this.classe = classe;
        this.maxHp = maxHp;
        this.damage = damage;
        this.speed = speed;
        this.type = type;
        this.init();
    };
    
    attackText(target, damage) {
        if(this.classe === "Mage") {
            console.log(chalk.yellow(`${this.name} lance une boule de feu sur ${target.name} et inflige ${damage} points de dégâts !`));
        } else if(this.classe === "Mage noir") {
            console.log(chalk.yellow(`${this.name} lance une boule de ténèbres sur ${target.name} et inflige ${damage} points de dégâts !`));
        }
        else if(this.classe === "Voleur") {
            console.log(chalk.yellow(`${this.name} attaque ${target.name} par derrière et inflige ${damage} points de dégâts !`));
        }
        else if(this.classe === "Guerrier") {
            console.log(chalk.yellow(`${this.name} attaque ${target.name} avec son épée et inflige ${damage} points de dégâts !`));
        }
        else if(this.classe === "Barbare") {
            console.log(chalk.yellow(`${this.name} attaque ${target.name} avec sa hache et inflige ${damage} points de dégâts !`));
        }
        else if(this.classe === "Golem") {
            console.log(chalk.yellow(`${this.name} attaque ${target.name} avec son poing et inflige ${damage} points de dégâts !`));
        }else{
            console.log(chalk.yellow(`${this.name} attaque ${target.name} inflige ${damage} points de dégâts !`));
        }
    };
    takeDamage(damage){
        this.hp -= damage;
        if(this.hp < 0){
            this.hp = 0;
        }
        if(this.hp > this.maxHp){
            this.hp = this.maxHp;
        }
    }
    attack(target) {
        const diceValue = Math.floor(Math.random() * 20) + 1;
        console.log(`Résultat du dé 20 : ${diceValue}`);
        switch (diceValue) {
            case 1:
                console.log(chalk.red(`${this.name} se blesse lui-même ! 💥 (Échec critique)`));
                this.takeDamage(this.damage);
                break;
            case 2:
                console.log(chalk.green(`${this.name} rate le coup porté à ${target.name} ! 💨`));
                break;
            case 19:
                this.attackText(target, this.damage)
                target.takeDamage(this.damage);
                break;
            case 20:
                console.log(chalk.green(`${this.name} inflige un coup critique à ${target.name} ! ⚡ (Coup critique)`));
                target.takeDamage(this.damage * 2);
                break;
            default:
                const damagePerDiceFace = this.damage / 20;
                this.attackText(target, Math.floor(damagePerDiceFace * diceValue));
                target.takeDamage(Math.floor(damagePerDiceFace * diceValue));
                break;
        }
    };

    Heal(target) {
        const diceValue = Math.floor(Math.random() * 20) + 1;
        console.log(`Résultat du dé 20 : ${diceValue}`);
        switch (diceValue) {
            case 1:
                console.log(chalk.red(`${this.name} blesse son allié ! 💥 (Échec critique)`));
                target.takeDamage(this.damage);
                break;
            case 2:
                console.log(chalk.green(`${this.name} n'arrive pas a soigné ${target.name} ! 💨`));
                break;
            case 19:
                console.log(chalk.red(`${this.name} Soigne son allié pour ${this.damage} PV`));
                target.takeDamage(-this.damage);
                break;
            case 20:
                console.log(chalk.green(`${this.name} soigne très fort ${target.name} ! ⚡ (Coup critique)`));
                target.takeDamage(this.damage * -2);
                break;
            default:
                const damagePerDiceFace = this.damage / 20;
                console.log(chalk.red(`${this.name} Soigne son allié pour ${this.damage} PV`));
                target.takeDamage(Math.floor(damagePerDiceFace * diceValue));
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
    new Character("Mathys", "Mage", 60, 8, 10, "dps"),
    new Character("Rémi", "Mage noir", 999, 666, 33,"dps"),
    new Character("Micael", "Voleur", 50, 15, 20, "dps"),
    new Character("Romain", "Guerrier", 150, 9, 10, "dps"),
    new Character("Marina", "Prêtre", 30, 10, 12, "healer"),
    new Character("François", "Golem", 300, 4, 1, "dps"),
];