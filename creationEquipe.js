import { checkbox, input, select } from '@inquirer/prompts';
import { characterList } from './characters.js';
import chalk from 'chalk';

class Team {
    constructor(name) {
        this.name = name;
        this.characters = [];
    }

    addCharacter(character) {
        this.characters.push(character);
    }

    displayTeam() {
        console.log(`\nÉquipe: ${this.name}`);
        if (this.characters.length === 0) {
            console.log("Aucun personnage dans cette équipe");
        } else {
            this.characters.forEach((char, index) => {
                console.log(`${index + 1}. ${char.name} (${char.classe})`);
            });
        }
    }
}

export async function createTeams() {
    try {
        console.clear();
        // Création des équipes
        const team1Name = await input({
            message: "Entrez le nom de la première équipe:",
            validate: (input) => input.trim() !== "" || "Le nom ne peut pas être vide"
        });

        const team1 = new Team(team1Name);

        const team1characters = await checkbox({
            message: `Sélectionner les personnages à intégrer à l'équipe ${team1.name}`,
            choices: characterList.map((character) => {
                return {                    
                    name: getCharacterDisplayText(character, true),
                    value: character
                }
            })
        });

        console.clear();

        const team2Name = await input({
            message: "Entrez le nom de la deuxième équipe:",
            validate: (input) => input.trim() !== "" || "Le nom ne peut pas être vide"
        });

        const team2 = new Team(team2Name);

        const team2characters = await checkbox({
            message: `Sélectionner les personnages à intégrer à l'équipe ${team1.name}`,
            choices: characterList.map((character) => {
                return {
                    name: getCharacterDisplayText(character, false),
                    value: character
                }
            })
        });

        console.clear();

        if (team1characters.length == 0 || team2characters.length == 0) {
            console.log(chalk.redBright('Attention ! Vous ne pouvez pas avoir une équipe vide ! Veuillez recommencer la création.'));
            return await createTeams();
        }

        console.log("\nÉquipes créées avec succès!");
        console.log(`Équipe 1: ${team1.name}`);
        console.log(`Équipe 2: ${team2.name}`);

        // Ajout des personnages aux équipes
        team1characters.forEach((character) => team1.addCharacter(character));
        team2characters.forEach((character) => team2.addCharacter(character));

        // Affichage des équipes finales
        console.log("\nComposition finale des équipes:");
        team1.displayTeam();
        team2.displayTeam();

        return [team1, team2];
    } catch (error) {
        console.error("Une erreur est survenue:", error.message);
        throw error;
    }
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
