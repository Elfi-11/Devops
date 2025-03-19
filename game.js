import chalk from 'chalk';

export async function startGame(player, enemy) {
    console.clear();
    console.log(chalk.bold.yellow(`\n⚔️ === DÉBUT DU COMBAT === ⚔️`));
    
    const playerDisplay = `${getClassEmoji(player.classe)} ${chalk.green(player.name)} (${player.classe})`;
    const enemyDisplay = `${getClassEmoji(enemy.classe)} ${chalk.red(enemy.name)} (${enemy.classe})`;
    
    console.log(chalk.bold(`${playerDisplay} ${chalk.yellow('VS')} ${enemyDisplay}`));
    
    // Réinitialiser les PV des personnages
    player.init();
    enemy.init();
    
    // Petite pause pour l'immersion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return await gameLoop(player, enemy);
}

async function gameLoop(player, enemy) {
    let round = 1;
    
    // Déterminer qui attaque en premier en fonction de la vitesse
    let firstAttacker = player.speed >= enemy.speed ? player : enemy;
    let secondAttacker = firstAttacker === player ? enemy : player;
    
    while (player.isAlive && enemy.isAlive) {
        console.log(chalk.cyan(`\n🔄 --- Round ${round} --- 🔄`));
        
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
    
    return color(`[${'■'.repeat(filledBlocks)}${' '.repeat(emptyBlocks)}] ${Math.round(percentage)}%`);
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