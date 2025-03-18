import { input, select } from '@inquirer/prompts';
import { characterList } from './characters.js';

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
        // Création des équipes
        const team1Name = await input({
            message: "Entrez le nom de la première équipe:",
            validate: (input) => input.trim() !== "" || "Le nom ne peut pas être vide"
        });

        const team2Name = await input({
            message: "Entrez le nom de la deuxième équipe:",
            validate: (input) => input.trim() !== "" || "Le nom ne peut pas être vide"
        });

        const team1 = new Team(team1Name);
        const team2 = new Team(team2Name);

        console.log("\nÉquipes créées avec succès!");
        console.log(`Équipe 1: ${team1.name}`);
        console.log(`Équipe 2: ${team2.name}`);

        // Ajout des personnages aux équipes
        for (const character of characterList) {
            const teamChoice = await select({
                message: `Dans quelle équipe voulez-vous placer ${character.name} (${character.classe})?`,
                choices: [
                    { name: team1.name, value: 'team1' },
                    { name: team2.name, value: 'team2' }
                ]
            });

            if (teamChoice === 'team1') {
                team1.addCharacter(character);
            } else {
                team2.addCharacter(character);
            }
        }

        // Affichage des équipes finales
        console.log("\nComposition finale des équipes:");
        team1.displayTeam();
        team2.displayTeam();

        return { team1, team2 };
    } catch (error) {
        console.error("Une erreur est survenue:", error.message);
        throw error;
    }
}
