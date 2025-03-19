import chalk from 'chalk';
import CLI from 'clui';
import clc from 'cli-color';
const { Line } = CLI;


export async function startGame(teams) {

    const team1 = teams[0];
    const team2 = teams[1];

    console.clear();
    console.log(chalk.bold.yellow(`\n⚔️ === DÉBUT DU COMBAT === ⚔️`));
    
    // Petite pause pour l'immersion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return await gameLoop(teams);
}

async function gameLoop(teams) {
    let round = 1;
    
    // Déterminer qui attaque en premier en fonction de la vitesse
    let firstAttacker = player.speed >= enemy.speed ? player : enemy;
    let secondAttacker = firstAttacker === player ? enemy : player;
    
    while (player.isAlive && enemy.isAlive) {
        console.log(chalk.cyan(`\n🔄 --- Round ${round} --- 🔄`));

        displayGameState(teams);
        
        // Petite pause entre les rounds
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Premier attaquant
        await processAttack(firstAttacker, secondAttacker);
        
        // Vérifier si le second attaquant est toujours en vie
        if (!secondAttacker.isAlive) {
            return { winner: firstAttacker, loser: secondAttacker };
        }
        
        // Petite pause entre les attaques
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Second attaquant
        await processAttack(secondAttacker, firstAttacker);
        
        // Vérifier si le premier attaquant est toujours en vie
        if (!firstAttacker.isAlive) {
            return { winner: secondAttacker, loser: firstAttacker };
        }
        
        round++;
    }
}

async function processAttack(attacker, defender) {
    const oldHp = defender.hp;
    const isPlayer = attacker === global.player;
    const attackerColor = isPlayer ? chalk.green : chalk.red;
    const defenderColor = isPlayer ? chalk.red : chalk.green;
    
    console.log(`${attackerColor(`${getClassEmoji(attacker.classe)} ${attacker.name}`)} ${chalk.yellow('⚔️ attaque!')} `);
    
    attacker.attack(defender);
    
    const damage = oldHp - defender.hp;
    console.log(`${chalk.bold(damage > 0 ? `💥 Dégâts: ${damage}` : '❌ Esquivé!')} `);
    
    const hpPercentage = (defender.hp / defender.maxHp) * 100;
    let hpColor = chalk.green;
    if (hpPercentage < 30) hpColor = chalk.red;
    else if (hpPercentage < 70) hpColor = chalk.yellow;
    
    console.log(`${defenderColor(`${getClassEmoji(defender.classe)} ${defender.name}:`)} ${hpColor(`❤️ ${defender.hp}/${defender.maxHp} PV`)} ${getHealthBar(defender.hp, defender.maxHp)}`);
    
    // Petite pause pour l'immersion
    await new Promise(resolve => setTimeout(resolve, 300));
}

export function endGame(result) {
    console.log(chalk.bold.yellow(`\n🏆 === FIN DU COMBAT === 🏆`));
    
    const winnerEmoji = getClassEmoji(result.winner.classe);
    const loserEmoji = getClassEmoji(result.loser.classe);
    
    console.log(`\n${chalk.bold.green(`${winnerEmoji} ${result.winner.name} remporte la victoire! 🎉`)}`);
    console.log(`${chalk.red(`${loserEmoji} ${result.loser.name} a été vaincu... 💀`)}\n`);
    
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

function displayGameState(teams) {
    const team1 = teams[0];
    const team2 = teams[1];

    var totalLines;

    if (team1.characters.length > team2.characters.length) {
        totalLines = team1.characters.length
    } else {
        totalLines = team2.characters.length
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
        const character1 = team1.characters[l] ?? null;
        const character2 = team2.characters[l] ?? null;
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
                .column(`${character1.hp}/${character1.maxHp} HP`, 10, [clc.red])
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