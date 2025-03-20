import chalk from 'chalk';
import CLI from 'clui';
import clc from 'cli-color';
import { Character } from './characters.js';
const { Line } = CLI;


export async function startGame(teams) {
    // const playerDisplay = `${getClassEmoji(player.classe)} ${TEAM1_COLOR(player.name)} (${player.classe})`;
    // const enemyDisplay = `${getClassEmoji(enemy.classe)} ${TEAM2_COLOR(enemy.name)} (${enemy.classe})`;
    // console.log(chalk.bold(`${playerDisplay} ${chalk.yellow('VS')} ${enemyDisplay}`));

    const team1 = teams[0];
    const team2 = teams[1];

    console.clear();
    console.log(chalk.bold.yellow(`\n⚔️ === DÉBUT DU COMBAT === ⚔️`));
    
    // Petite pause pour l'immersion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return await gameLoop(teams);
}

function drawBattleScreen(player, enemy) {
    // Constantes pour les couleurs des équipes
    const TEAM1_COLOR = chalk.blue;
    const TEAM2_COLOR = chalk.red;
    
    // Titre du combat
    console.log(chalk.bold.yellow(`\n⚔️ === COMBAT EN COURS === ⚔️\n`));
    
    // Afficher les équipes avec leurs couleurs respectives
    const playerName = `${getClassEmoji(player.classe)} ${player.name} (${player.classe})`;
    const enemyName = `${enemy.name} (${enemy.classe}) ${getClassEmoji(enemy.classe)}`;
    
    console.log(`${TEAM1_COLOR(playerName.padEnd(35))}${chalk.yellow('VS')}${TEAM2_COLOR(enemyName.padStart(35))}`);
    
    // Barres de santé
    const playerHealthBar = getHealthBar(player.hp, player.maxHp, 20);
    const enemyHealthBar = getHealthBar(enemy.hp, enemy.maxHp, 20);
    
    console.log(`${TEAM1_COLOR(`❤️ ${player.hp}/${player.maxHp} `)}${playerHealthBar}${' '.repeat(10)}${enemyHealthBar}${TEAM2_COLOR(` ${enemy.hp}/${enemy.maxHp} ❤️`)}`);
    
    console.log(chalk.yellow(`\n${'='.repeat(80)}\n`));
}

async function gameLoop(teams) {
    let round = 1;

    const team1 = teams[0].characters
        .map((character, index) => {
            character.indexes = [0, index];
            return {...character};
        })
    
    const team2 = teams[1].characters
        .map((character, index) => {
            character.indexes = [1, index];
            return {...character};
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

            var attacker = new Character(player.name, player.classe, player.maxHp, player.damage, player.speed);

            console.log(attacker);

            if(player.hp > 0) {

                if(player.indexes[0] == 0) {
                    var opponent = team2[generateRandomBetween(0, team2.length)];
                    attacker.attack(opponent);
                }
                if(player.indexes[0] == 1) {
                    var opponent = team1[generateRandomBetween(0, team1.length)];
                    attacker.attack(opponent);
                }

                displayGameState(team1, team2);
                // drawBattleScreen(player, opponent);
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
        // await new Promise(resolve => setTimeout(resolve, 500));
        
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
    
    console.log(`${attackerColor(`${getClassEmoji(attacker.classe)} ${attacker.name}`)} ${chalk.yellow('⚔️ attaque!')} `);
    
    // Execute the attack and store result
    attacker.attack(defender);
    
    // Calculer les dégâts infligés
    const damage = oldHp - defender.hp;
    
    // Display HP after attack
    const hpPercentage = (defender.hp / defender.maxHp) * 100;
    let hpColor = chalk.green;
    if (hpPercentage < 30) hpColor = chalk.red;
    else if (hpPercentage < 70) hpColor = chalk.yellow;
    
    console.log(`${defenderColor(`${getClassEmoji(defender.classe)} ${defender.name}:`)} ${hpColor(`❤️ ${defender.hp}/${defender.maxHp} PV`)} ${getHealthBar(defender.hp, defender.maxHp)}`);
    
    // Petite animation d'impact si des dégâts sont infligés
    if (damage > 0) {
        await animateImpact(defenderColor, damage);
    }
    
    // Petite pause pour l'immersion
    await new Promise(resolve => setTimeout(resolve, 300));
}

async function animateImpact(color, damage) {
    const impactFrames = ['💥', '✨', '💫', '⚡'];
    for (const frame of impactFrames) {
        process.stdout.write(`\r${color(`${frame} -${damage} PV ${frame}`)}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('\n');
}

export function endGame(result) {
    console.clear();
    console.log(chalk.bold.yellow(`\n🏆 === FIN DU COMBAT === 🏆`));
    
    const winnerEmoji = getClassEmoji(result.winner.classe);
    const loserEmoji = getClassEmoji(result.loser.classe);
    
    const winnerColor = result.winner === global.player ? TEAM1_COLOR : TEAM2_COLOR;
    const loserColor = result.loser === global.player ? TEAM1_COLOR : TEAM2_COLOR;
    
    console.log(`\n${winnerColor(`${winnerEmoji} ${result.winner.name} remporte la victoire! 🎉`)}`);
    console.log(`${loserColor(`${loserEmoji} ${result.loser.name} a été vaincu... 💀`)}\n`);
    
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
        case 'mage': return '🧙‍♂️';
        case 'mage noir': return '🧙‍♀️';
        case 'voleur': return '🥷';
        case 'guerrier': return '⚔️';
        case 'barbare': return '🪓';
        case 'golem': return '🗿';
        default: return '👤';
    }
}

function displayGameState(team1, team2) {
    var totalLines;

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