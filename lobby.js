import { select } from '@inquirer/prompts';
import { characterList } from './characters.js';
import chalk from 'chalk';

export async function createLobby() {
    console.log(chalk.yellow("\n🏛️ === Création du lobby === 🏛️"));
    
    // Sélection du personnage du joueur
    const playerCharacter = await select({
        message: chalk.green('👑 Choisissez votre personnage:'),
        choices: characterList.map(char => ({
            name: getCharacterDisplayText(char, true),
            value: char
        }))
    });
    
    // Sélection de l'adversaire
    const enemyChoices = characterList.filter(char => char !== playerCharacter);
    const enemyCharacter = await select({
        message: chalk.red('👹 Choisissez votre adversaire:'),
        choices: enemyChoices.map(char => ({
            name: getCharacterDisplayText(char, false),
            value: char
        }))
    });
    
    return { player: playerCharacter, enemy: enemyCharacter };
}

function getCharacterDisplayText(char, isPlayer) {
    const classEmoji = getClassEmoji(char.classe);
    const statColor = isPlayer ? chalk.green : chalk.red;
    const nameColor = isPlayer ? chalk.bold.green : chalk.bold.red;
    
    return `${classEmoji} ${nameColor(char.name)} (${chalk.italic(char.classe)}) - ${statColor('❤️ ' + char.maxHp)} - ${statColor('⚔️ ' + char.damage)} - ${statColor('💨 ' + char.speed)}`;
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