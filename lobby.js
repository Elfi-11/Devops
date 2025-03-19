import { select } from '@inquirer/prompts';
import { characterList } from './characters.js';

export async function createLobby() {
    console.log("\n=== Création du lobby ===");
    
    const playerCharacter = await select({
        message: 'Choisissez votre personnage:',
        choices: characterList.map(char => ({
            name: `${char.name.padEnd(10)} | ${char.classe.padEnd(12)} | HP: ${String(char.maxHp).padEnd(4)} | ATK: ${String(char.damage).padEnd(3)} | VIT: ${char.speed}`,
            value: char
        }))
    });
    
    const enemyChoices = characterList.filter(char => char !== playerCharacter);
    const enemyCharacter = await select({
        message: 'Choisissez votre adversaire:',
        choices: enemyChoices.map(char => ({
            name: `${char.name.padEnd(10)} | ${char.classe.padEnd(12)} | HP: ${String(char.maxHp).padEnd(4)} | ATK: ${String(char.damage).padEnd(3)} | VIT: ${char.speed}`,
            value: char
        }))
    });
    
    return { player: playerCharacter, enemy: enemyCharacter };
}