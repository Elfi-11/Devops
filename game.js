import chalk from 'chalk';

// Constantes pour les couleurs des équipes
const TEAM1_COLOR = chalk.blue;
const TEAM2_COLOR = chalk.red;

export async function startGame(player, enemy) {
    // console.clear();
    console.log(chalk.bold.yellow(`\n ⚔️  === DÉBUT DU COMBAT ===  ⚔️ \n`));
    
    const playerDisplay = `${getClassEmoji(player.classe)} ${TEAM1_COLOR(player.name)} (${player.classe})`;
    const enemyDisplay = `${getClassEmoji(enemy.classe)} ${TEAM2_COLOR(enemy.name)} (${enemy.classe})`;
    
    console.log(chalk.bold(`${playerDisplay} ${chalk.yellow(' VS ')} ${enemyDisplay}`));
    
    player.init();
    enemy.init();
    
    // Petite pause pour l'immersion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Afficher les barres de vie initiales
    drawBattleScreen(player, enemy);
    
    return await gameLoop(player, enemy);
}

function drawBattleScreen(player, enemy) {
    // console.clear();
    
    // Titre du combat
    console.log(chalk.bold.yellow(`\n ⚔️  === COMBAT EN COURS ===  ⚔️ \n`));
    
    // Afficher les équipes avec leurs couleurs respectives
    const playerName = `${getClassEmoji(player.classe)} ${player.name} (${player.classe})`;
    const enemyName = `${enemy.name} (${enemy.classe}) ${getClassEmoji(enemy.classe)}`;
    
    console.log(`${TEAM1_COLOR(playerName.padEnd(35))}${chalk.yellow(' VS ')}${TEAM2_COLOR(enemyName.padStart(35))}`);
    
    // Barres de santé
    const playerHealthBar = getHealthBar(player.hp, player.maxHp, 20);
    const enemyHealthBar = getHealthBar(enemy.hp, enemy.maxHp, 20);
    
    console.log(`${TEAM1_COLOR(` ❤️  ${player.hp}/${player.maxHp} `)}${playerHealthBar}${' '.repeat(10)}${enemyHealthBar}${TEAM2_COLOR(` ${enemy.hp}/${enemy.maxHp}  ❤️  `)}`);
    
    console.log(chalk.yellow(`\n${'='.repeat(80)}\n`));
}

async function gameLoop(player, enemy) {
    let round = 1;
    
    // Déterminer qui attaque en premier en fonction de la vitesse
    let firstAttacker = player.speed >= enemy.speed ? player : enemy;
    let secondAttacker = firstAttacker === player ? enemy : player;
    
    while (player.isAlive && enemy.isAlive) {
        console.log(chalk.cyan(`\n 🔄  --- Round ${round} ---  🔄 `));
        
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
        
        // Message de fin de round
        console.log(chalk.cyan(`\n ✅  Fin du round ${round} - Patientez... `));
        
        // Pause plus longue à la fin du round pour lire ce qui s'est passé
        await new Promise(resolve => setTimeout(resolve, 3000));
        
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
    
    console.log(`${attackerColor(`${getClassEmoji(attacker.classe)} ${attacker.name}`)} ${chalk.yellow(' ⚔️  attaque! ')} `);
    
    // Execute the attack and store result
    attacker.attack(defender);
    
    // S'assurer que les HP ne sont pas négatifs
    if (defender.hp < 0) {
        defender.hp = 0;
    }
    
    // Calculer les dégâts infligés
    const damage = oldHp - defender.hp;
    
    // Display HP after attack
    const hpPercentage = (defender.hp / defender.maxHp) * 100;
    let hpColor = chalk.green;
    if (hpPercentage < 30) hpColor = chalk.red;
    else if (hpPercentage < 70) hpColor = chalk.yellow;
    
    console.log(`${defenderColor(`${getClassEmoji(defender.classe)} ${defender.name}:`)} ${hpColor(` ❤️  ${defender.hp}/${defender.maxHp} PV `)} ${getHealthBar(defender.hp, defender.maxHp)}`);
    
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
    
    const victoryFrames = [' 🏆 ', ' ✨ ', ' 🎉 ', ' ⭐ ', ' 🏆 '];
    for (let i = 0; i < 3; i++) {         for (const frame of victoryFrames) {
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
    
    console.log(chalk.bold(`\n${'-'.repeat(30)} VAINQUEUR ${'-'.repeat(30)}\n`));
    console.log(winnerColor.bold(`     ${winnerEmoji} ${result.winner.name.toUpperCase()} (${result.winner.classe})  🎖️  `));
    console.log(winnerColor(`     HP restants: ${result.winner.hp}/${result.winner.maxHp} ${getHealthBar(result.winner.hp, result.winner.maxHp)}`));
    
    console.log('\n' + chalk.bold.green(' 🎊 ') + chalk.bold.yellow(' F') + chalk.bold.blue('É') + 
        chalk.bold.red('L') + chalk.bold.magenta('I') + chalk.bold.cyan('C') + 
        chalk.bold.green('I') + chalk.bold.yellow('T') + chalk.bold.blue('A') + 
        chalk.bold.red('T') + chalk.bold.magenta('I') + chalk.bold.cyan('O') + 
        chalk.bold.green('N') + chalk.bold.yellow('S') + chalk.bold.blue(' ') + chalk.bold.green(' 🎊 '));
    
    console.log(chalk.dim(`\n${'-'.repeat(30)} VAINCU ${'-'.repeat(32)}\n`));
    console.log(loserColor(`     ${loserEmoji} ${result.loser.name} (${result.loser.classe})  💀  `));
    
    console.log(chalk.cyan(`\nRetour au menu principal dans 7 secondes... `));
    await new Promise(resolve => setTimeout(resolve, 7000));
    
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
    
    return color(`[${'■'.repeat(filledBlocks)}${' '.repeat(emptyBlocks)}] ${Math.round(percentage)}%`);
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