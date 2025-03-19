import chalk from 'chalk';
import CLI from 'clui';
import clc from 'cli-color';
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
    console.clear();
    
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

async function gameLoop(player, enemy) {
    // Constantes pour les couleurs des équipes
    const TEAM1_COLOR = chalk.blue;
    const TEAM2_COLOR = chalk.red;

    let round = 1;
    
    // Ordonner les personnages par vitesse d'attaque
    
    
    while (player.isAlive && enemy.isAlive) {
        console.log(chalk.cyan(`\n🔄 --- Round ${round} --- 🔄`));

        displayGameState(teams);
        
        // Petite pause entre les rounds
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Premier attaquant
        await processAttack(firstAttacker, secondAttacker, player);
        
        // Vérifier si le second attaquant est toujours en vie
        if (!secondAttacker.isAlive) {
            return { winner: firstAttacker, loser: secondAttacker };
        }
        
        // Petite pause entre les attaques
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Second attaquant
        await processAttack(secondAttacker, firstAttacker, player);
        
        // Vérifier si le premier attaquant est toujours en vie
        if (!firstAttacker.isAlive) {
            return { winner: secondAttacker, loser: firstAttacker };
        }
        
        round++;
        
        // Redessiner l'écran de combat à la fin du round
        drawBattleScreen(player, enemy);
    }
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