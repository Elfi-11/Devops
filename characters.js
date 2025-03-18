const characterList = [
    new Character("Mathys", "Mage", 100, 10, 10),
    new Character("Rémi", "Mage noir", 150, 10, 15),
    new Character("Micael", "Voleur", 200, 10, 5),
    new Character("Romain", "Guerrier", 200, 10, 5),
    new Character("Marina", "Barbare", 200, 10, 5),
    new Character("François", "Golem", 200, 10, 5),
];
class Character{
    hp;
    constructor(name, classe, maxHp, damage, speed) {
        this.name = name;
        this.classe = classe;
        this.maxHp = maxHp;
        this.damage = damage;
        this.speed = speed;
        this.init();
    };
    
    attack(target) {
        target.hp -= (Math.random() * this.damage).floor();
    };
    init(){
        this.hp = this.maxHp;
    }
    get isAlive(){
        return this.hp > 0;
    }
}