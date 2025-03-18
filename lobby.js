import { select } from '@inquirer/prompts';
import { characterList } from './characters.js';

export async function createLobby() {
    console.log("\n=== Création du lobby ===");
    
    // Sélection du personnage du joueur
    const playerCharacter = await select({
        message: 'Choisissez votre personnage:',
        choices: characterList.map(char => ({
            name: `${char.name} (${char.classe}) - HP: ${char.maxHp}, ATK: ${char.damage}, VIT: ${char.speed}`,
            value: char
        }))
    });
    
    // Sélection de l'adversaire
    const enemyChoices = characterList.filter(char => char !== playerCharacter);
    const enemyCharacter = await select({
        message: 'Choisissez votre adversaire:',
        choices: enemyChoices.map(char => ({
            name: `${char.name} (${char.classe}) - HP: ${char.maxHp}, ATK: ${char.damage}, VIT: ${char.speed}`,
            value: char
        }))
    });
    
    return { player: playerCharacter, enemy: enemyCharacter };
}