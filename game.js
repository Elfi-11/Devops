export async function startGame(player, enemy) {
    console.log(`\n=== DÉBUT DU COMBAT ===`);
    console.log(`${player.name} (${player.classe}) VS ${enemy.name} (${enemy.classe})`);
    
    // Réinitialiser les PV des personnages
    player.init();
    enemy.init();
    
    return await gameLoop(player, enemy);
}

async function gameLoop(player, enemy) {
    let round = 1;
    
    // Déterminer qui attaque en premier en fonction de la vitesse
    let firstAttacker = player.speed >= enemy.speed ? player : enemy;
    let secondAttacker = firstAttacker === player ? enemy : player;
    
    while (player.isAlive && enemy.isAlive) {
        console.log(`\n--- Round ${round} ---`);
        
        // Premier attaquant
        console.log(`${firstAttacker.name} attaque!`);
        firstAttacker.attack(secondAttacker);
        console.log(`${secondAttacker.name}: ${secondAttacker.hp}/${secondAttacker.maxHp} PV`);
        
        // Vérifier si le second attaquant est toujours en vie
        if (!secondAttacker.isAlive) {
            return { winner: firstAttacker, loser: secondAttacker };
        }
        
        // Second attaquant
        console.log(`${secondAttacker.name} attaque!`);
        secondAttacker.attack(firstAttacker);
        console.log(`${firstAttacker.name}: ${firstAttacker.hp}/${firstAttacker.maxHp} PV`);
        
        // Vérifier si le premier attaquant est toujours en vie
        if (!firstAttacker.isAlive) {
            return { winner: secondAttacker, loser: firstAttacker };
        }
        
        round++;
    }
}

export function endGame(result) {
    console.log(`\n=== FIN DU COMBAT ===`);
    console.log(`${result.winner.name} remporte la victoire!`);
    console.log(`${result.loser.name} a été vaincu.`);
    
    return result;
}