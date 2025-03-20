import chalk from 'chalk';
import CLI from 'clui';
import clc from 'cli-color';
import { Character } from './characters.js';
const { Line } = CLI;
import { getEquipment, equipmentList } from './equipment.js';
import { select } from '@inquirer/prompts';


export async function startGame(teams) {
    // const playerDisplay = `${getClassEmoji(player.classe)} ${TEAM1_COLOR(player.name)} (${player.classe})`;
    // const enemyDisplay = `${getClassEmoji(enemy.classe)} ${TEAM2_COLOR(enemy.name)} (${enemy.classe})`;
    // console.log(chalk.bold(`${playerDisplay} ${chalk.yellow('VS')} ${enemyDisplay}`));

    const team1 = teams[0].characters;
    const team2 = teams[1].characters;

    // console.clear();
    console.log(chalk.bold.yellow(`\n ⚔️  === DÉBUT DU COMBAT ===  ⚔️ \n`));
    
    // Offrir l'option d'équiper les deux personnages
    for (const character of team1) {
        await equipCharacter(character, chalk.green);
    }
    for (const character of team2) {
        await equipCharacter(character, chalk.red);
    }
    // const playerDisplay = `${getClassEmoji(player.classe)} ${TEAM1_COLOR(player.name)} (${player.classe})`;
    // const enemyDisplay = `${getClassEmoji(enemy.classe)} ${TEAM2_COLOR(enemy.name)} (${enemy.classe})`;
    
    // console.log(chalk.bold(`${playerDisplay} ${chalk.yellow(' VS ')} ${enemyDisplay}`));
    
    // Réinitialiser les PV des personnages APRÈS l'équipement pour que les bonus s'appliquent
    // player.init();
    // enemy.init();
    
    // Petite pause pour l'immersion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return await gameLoop(team1, team2);
}

/**
 * Permet au joueur de choisir un équipement
 * @param {Character} character - Le personnage à équiper
 * @param {Function} colorFunction - Fonction de couleur pour l'affichage (bleu pour joueur, rouge pour ennemi)
 */
async function equipCharacter(character, colorFunction) {
    console.log(colorFunction(`\n🛡️  === ÉQUIPEMENT DE ${character.name.toUpperCase()} === 🛡️\n`));
    
    // Créer les choix d'équipement
    const equipChoices = equipmentList.map(equip => {
        const statsText = Object.entries(equip.stats)
            .map(([stat, value]) => {
                const prefix = value > 0 ? '+' : '';
                const statDisplay = stat === 'hp' ? 'PV' : (stat === 'damage' ? 'ATK' : 'VIT');
                return `${statDisplay}: ${prefix}${value}`;
            })
            .join(', ');
            
        return {
            name: `${equip.name} (${statsText})`,
            value: equip.name,
            description: `Équiper ${equip.name}`
        };
    });
    
    // Ajouter l'option "Aucun équipement"
    equipChoices.push({
        name: "Aucun équipement",
        value: "none",
        description: "Combattre sans équipement"
    });
    
    const selectedEquipName = await select({
        message: colorFunction(`Choisissez un équipement pour ${character.name}:`),
        choices: equipChoices
    });
    
    if (selectedEquipName !== "none") {
        const selectedEquip = getEquipment(selectedEquipName);
        if (selectedEquip) {
            character.equip(selectedEquip);
            
            // Afficher les bonus
            console.log(chalk.green("\nBonus d'équipement:"));
            Object.entries(selectedEquip.stats).forEach(([stat, value]) => {
                const statName = stat === 'hp' ? 'PV' : (stat === 'damage' ? 'Dégâts' : 'Vitesse');
                console.log(`${statName}: ${value > 0 ? '+' + value : value}`);
            });
            
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    } else {
        console.log(colorFunction(`\n${character.name} combattra sans équipement.`));
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function drawBattleScreen(player, enemy) {
    // Constantes pour les couleurs des équipes
    const TEAM1_COLOR = chalk.blue;
    const TEAM2_COLOR = chalk.red;
    
    // Titre du combat
    console.log(chalk.bold.yellow(`\n ⚔️  === COMBAT EN COURS ===  ⚔️ \n`));
    
    // Afficher les équipes avec leurs couleurs respectives
    const playerName = `${getClassEmoji(player.classe)} ${player.name} (${player.classe})`;
    const enemyName = `${enemy.name} (${enemy.classe}) ${getClassEmoji(enemy.classe)}`;
    
    console.log(`${TEAM1_COLOR(playerName.padEnd(35))}${chalk.yellow(' VS ')}${TEAM2_COLOR(enemyName.padStart(35))}`);
    
    // Afficher les équipements
    let playerEquipText = player.equipment ? `[🛡️  ${player.equipment.name}]` : '';
    let enemyEquipText = enemy.equipment ? `[🛡️  ${enemy.equipment.name}]` : '';
    console.log(`${TEAM1_COLOR(playerEquipText.padEnd(35))}${' '.repeat(4)}${TEAM2_COLOR(enemyEquipText.padStart(35))}`);
    
    // Barres de santé
    const playerHealthBar = getHealthBar(player.hp, player.getMaxHp(), 20);
    const enemyHealthBar = getHealthBar(enemy.hp, enemy.getMaxHp(), 20);
    
    console.log(`${TEAM1_COLOR(` ❤️  ${player.hp}/${player.getMaxHp()} `)}${playerHealthBar}${' '.repeat(10)}${enemyHealthBar}${TEAM2_COLOR(` ${enemy.hp}/${enemy.getMaxHp()}  ❤️  `)}`);
    
    // Stats avec équipement
    const playerDamage = player.getDamage();
    const playerSpeed = player.getSpeed();
    const enemyDamage = enemy.getDamage();
    const enemySpeed = enemy.getSpeed();
    
    console.log(`${TEAM1_COLOR(` 🗡️  ${playerDamage} `)}${' '.repeat(35)}${TEAM2_COLOR(` ${enemyDamage}  🗡️  `)}`);
    console.log(`${TEAM1_COLOR(` 👟  ${playerSpeed} `)}${' '.repeat(35)}${TEAM2_COLOR(` ${enemySpeed}  👟  `)}`);
    
    console.log(chalk.yellow(`\n${'='.repeat(80)}\n`));
}

async function gameLoop(team1, team2) {
    let round = 1;

    team1 = team1.map((character, index) => {
        const characterObj = new Character(character.name, character.class, character.maxHp, character.damage, character.speed, character.type);
        characterObj.indexes = [0, index];
        return characterObj;
    })
    
    team2 = team2.map((character, index) => {
        const characterObj = new Character(character.name, character.class, character.maxHp, character.damage, character.speed, character.type);
        characterObj.indexes = [1, index];
        return characterObj;
    })

    var team1alive = true;
    var team2alive = true;

    while(team1alive && team2alive) {

        console.log(chalk.cyan(`\n🔄 --- Round ${round} --- 🔄`));

        // Ordonner les personnages par vitesse d'attaque
        const contenders = team1
        .concat(team2)
        .filter(contender => contender.hp > 0)
        .sort((a, b) => {
            const speedA = a.speed;
            const speedB = b.speed;

            return speedB - speedA;
        }); 

        console.table(contenders);

        while(contenders.length > 0) {
    
            var fastest = contenders[0];
    
            var equivalents = contenders.filter(character => character.speed == fastest.speed);
    
            var player;
            if (equivalents.length > 1) {
                const random = generateRandomBetween(0, equivalents.length-1);
                player = contenders[random];
                contenders.splice(random, 1);
            } else {
                player = fastest;
                contenders.splice(0, 1);
            }

            var attacker = new Character(player.name, player.classe, player.maxHp, player.damage, player.speed, player.type);

            if(player.hp > 0) {

                
                if(player.indexes[0] == 0) {
                    var opponent = team2[generateRandomBetween(0, team2.length)];
                    const playersToHeal = team1.filter(character => character.hp < character.maxHp)
                        .sort((a, b) => { return a.hp - b.hp})
                        .map(character => new Character(character.name, character.class, character.maxHp, character.damage, character.speed, character.type));
                    if (playersToHeal && attacker.type == 'healer') {
                        attacker.Heal(playersToHeal[0]);
                    } else {
                        attacker.attack(opponent);
                    }
                }
                if(player.indexes[0] == 1) {
                    var opponent = team1[generateRandomBetween(0, team1.length)];
                    const playersToHeal = team1.filter(character => character.hp < character.maxHp)
                        .sort((a, b) => { return a.hp - b.hp})
                        .map(character => new Character(character.name, character.class, character.maxHp, character.damage, character.speed, character.type));
                    if (playersToHeal && attacker.type == 'healer') {
                        attacker.Heal(playersToHeal[0]);
                    } else {
                        attacker.attack(opponent);
                    }
                }

                displayGameState(team1, team2);
                // drawBattleScreen(player, opponent);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        round++;

        var team1hp = team1.reduce((prev, act) => {
            return prev + act.hp;
        }, 0);
        if(team1hp < 1) {
            team1alive = false;
        }
        var team2hp = team2.reduce((prev, act) => {
            return prev + act.hp;
        }, 0);
        if(team2hp < 1) {
            team2alive = false;
        }
    }
    

        // // Petite pause entre les rounds
        
        // // Premier attaquant
        // await processAttack(firstAttacker, secondAttacker, player);
        
        // // Vérifier si le second attaquant est toujours en vie
        // if (!secondAttacker.isAlive) {
        //     return { winner: firstAttacker, loser: secondAttacker };
        // }
        
        // // Petite pause entre les attaques
        // await new Promise(resolve => setTimeout(resolve, 500));
        
        // // Second attaquant
        // await processAttack(secondAttacker, firstAttacker, player);
        
        // // Vérifier si le premier attaquant est toujours en vie
        // if (!firstAttacker.isAlive) {
        //     return { winner: secondAttacker, loser: firstAttacker };
        // }
        
        // round++;
        
        // Redessiner l'écran de combat à la fin du round
}

async function processAttack(attacker, defender, player) {
    const oldHp = defender.hp;
    const isPlayerTeam = attacker === player;
    const attackerColor = isPlayerTeam ? TEAM1_COLOR : TEAM2_COLOR;
    const defenderColor = isPlayerTeam ? TEAM2_COLOR : TEAM1_COLOR;
    
    console.log(`${attackerColor(`${getClassEmoji(attacker.classe)} ${attacker.name}`)} ${chalk.yellow(' ⚔️  attaque! ')} `);
    
    // Execute the attack and store result
    attacker.attack(defender);
    
    // S'assurer que les HP ne sont pas négatifs
    if (defender.hp < 0) {
        defender.hp = 0;
    }
    
    // Calculer les dégâts infligés
    const damage = oldHp - defender.hp;
    
    // Afficher les HP après l'attaque en utilisant getMaxHp()
    const hpPercentage = (defender.hp / defender.getMaxHp()) * 100;
    let hpColor = chalk.green;
    if (hpPercentage < 30) hpColor = chalk.red;
    else if (hpPercentage < 70) hpColor = chalk.yellow;
    
    console.log(`${defenderColor(`${getClassEmoji(defender.classe)} ${defender.name}:`)} ${hpColor(` ❤️  ${defender.hp}/${defender.getMaxHp()} PV `)} ${getHealthBar(defender.hp, defender.getMaxHp())}`);
    
    // Petite animation d'impact si des dégâts sont infligés
    if (damage > 0) {
        await animateImpact(defenderColor, damage);
    }
    
    // Petite pause pour l'immersion
    await new Promise(resolve => setTimeout(resolve, 300));
}

async function animateImpact(color, damage) {
    const impactFrames = [' 💥 ', ' ✨ ', ' 💫 ', ' ⚡ '];
    for (const frame of impactFrames) {
        process.stdout.write(`\r${color(`${frame} -${damage} PV ${frame}`)}  `);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('\n');
}

export async function endGame(result) {
    console.clear();
    
    // Animation de victoire
    const victoryFrames = [' 🏆 ', ' ✨ ', ' 🎉 ', ' ⭐ ', ' 🏆 '];
    for (let i = 0; i < 3; i++) {  // Répéter l'animation 3 fois
        for (const frame of victoryFrames) {
            console.clear();
            console.log(chalk.bold.yellow(`\n${frame} === FIN DU COMBAT === ${frame}\n`));
            await new Promise(resolve => setTimeout(resolve, 150));
        }
    }
    
    // console.clear();
    console.log(chalk.bold.yellow(`\n 🏆  === FIN DU COMBAT ===  🏆 \n`));
    
    const winnerEmoji = getClassEmoji(result.winner.classe);
    const loserEmoji = getClassEmoji(result.loser.classe);
    
    const winnerColor = result.winner === global.player ? TEAM1_COLOR : TEAM2_COLOR;
    const loserColor = result.loser === global.player ? TEAM1_COLOR : TEAM2_COLOR;
    
    // Affichage du vainqueur avec effet spécial
    console.log(chalk.bold(`\n${'-'.repeat(30)} VAINQUEUR ${'-'.repeat(30)}\n`));
    console.log(winnerColor.bold(`     ${winnerEmoji} ${result.winner.name.toUpperCase()} (${result.winner.classe})  🎖️  `));
    console.log(winnerColor(`     HP restants: ${result.winner.hp}/${result.winner.getMaxHp()} ${getHealthBar(result.winner.hp, result.winner.getMaxHp())}`));
    
    // Remplacer chalk.rainbow par une alternance de couleurs
    console.log('\n' + chalk.bold.green(' 🎊 ') + chalk.bold.yellow(' F') + chalk.bold.blue('É') + 
        chalk.bold.red('L') + chalk.bold.magenta('I') + chalk.bold.cyan('C') + 
        chalk.bold.green('I') + chalk.bold.yellow('T') + chalk.bold.blue('A') + 
        chalk.bold.red('T') + chalk.bold.magenta('I') + chalk.bold.cyan('O') + 
        chalk.bold.green('N') + chalk.bold.yellow('S') + chalk.bold.blue(' ') + chalk.bold.green(' 🎊 '));
    
    console.log(chalk.dim(`\n${'-'.repeat(30)} VAINCU ${'-'.repeat(32)}\n`));
    console.log(loserColor(`     ${loserEmoji} ${result.loser.name} (${result.loser.classe})  💀  `));
    
    // Pause longue pour apprécier le résultat
    console.log(chalk.cyan(`\nRetour au menu principal dans 7 secondes... `));
    await new Promise(resolve => setTimeout(resolve, 7000));
    
    // Définir cette variable pour le prochain combat
    global.player = undefined;
    
    return result;
}

function getHealthBar(current, max, size = 20) {
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));
    const filledBlocks = Math.round((percentage / 100) * size);
    const emptyBlocks = size - filledBlocks;
    
    let color = chalk.green;
    if (percentage < 30) color = chalk.red;
    else if (percentage < 70) color = chalk.yellow;
    
    return `[${'■'.repeat(filledBlocks)}${' '.repeat(emptyBlocks)}]`;
}

function getClassEmoji(classe) {
    switch (classe.toLowerCase()) {
        case 'mage': return ' 🧙‍♂️ ';
        case 'mage noir': return ' 🧙‍♀️ ';
        case 'voleur': return ' 🥷 ';
        case 'guerrier': return ' ⚔️ ';
        case 'barbare': return ' 🪓 ';
        case 'golem': return ' 🗿 ';
        default: return ' 👤 ';
    }
}

function displayGameState(team1, team2) {
    var totalLines;
    console.clear();

    if (team1.length > team2.length) {
        totalLines = team1.length
    } else {
        totalLines = team2.length
    }

    console.log(totalLines);

    const outputBuffer = new CLI.LineBuffer({
        x: 0,
        y: 0,
        width: 'console',
        height: 'console'
    });

    var line;
    for(var l = 0; l < totalLines; l++) {
        const character1 = team1[l] ?? null;
        const character2 = team2[l] ?? null;
        line = new Line(outputBuffer);

        if (character1) {
            line = line
                .column(character1.name, 10, [clc.green])
                .column(getHealthBar(character1.hp, character1.maxHp, 15), 17, [clc.green])
                .column(`${character1.hp}/${character1.maxHp} HP`, 10, [clc.green]);
        } else {
            line = line
                .column('', 20, [clc.green])
                .column('', 20, [clc.green])
                .column('', 20, [clc.green]);
        }

        line = line.column('', 3)
        
        if (character2) {
            line = line
                .column(`${character2.hp}/${character2.maxHp} HP`, 10, [clc.red])
                .column(getHealthBar(character2.hp, character2.maxHp, 15), 17, [clc.red])
                .column(character2.name, 10, [clc.red]);
        } else {
            line = line
                .column('', 20, [clc.red])
                .column('', 20, [clc.red])
                .column('', 20, [clc.red]);
        }
            line.fill()
            .store();
    }

    outputBuffer.output();
}

function generateRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}