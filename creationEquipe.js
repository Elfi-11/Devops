import { checkbox, input, select } from '@inquirer/prompts';
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

        const team1 = new Team(team1Name);

        const team1characters = await checkbox({
            message: `Sélectionner les personnages à intégrer à l'équipe ${team1.name}`,
            choices: characterList.map((character) => {
                return {
                    name: character.name,
                    value: character
                }
            })
        });

        const team2Name = await input({
            message: "Entrez le nom de la deuxième équipe:",
            validate: (input) => input.trim() !== "" || "Le nom ne peut pas être vide"
        });

        const team2 = new Team(team2Name);

        const team2characters = await checkbox({
            message: `Sélectionner les personnages à intégrer à l'équipe ${team1.name}`,
            choices: characterList.map((character) => {
                return {
                    name: character.name,
                    value: character
                }
            })
        });

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

        return { team1, team2 };
    } catch (error) {
        console.error("Une erreur est survenue:", error.message);
        throw error;
    }
}
