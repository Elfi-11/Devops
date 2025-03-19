import { select, Separator } from '@inquirer/prompts';
import { createTeams } from './creationEquipe.js';
import { createLobby } from './lobby.js';
import { startGame, endGame } from './game.js';
import chalk from 'chalk';

async function mainMenu() {
  console.clear();
  console.log(chalk.bold.magenta('\n🎮 === RPG FANTASY === 🎮\n'));
  
  const answer = await select({
    message: chalk.cyan('🏰 Bienvenue dans le RPG !'),
    choices: [
      {
        name: chalk.green('⚔️ Lancer un combat'),
        value: 'start_battle',
        description: 'Lancer un combat entre deux personnages.',
      },
      new Separator(),
      {
        name: chalk.red('🚪 Quitter'),
        value: 'quit',
        description: 'Quitter le jeu.',
      },
    ],
  });

  switch (answer) {
    case 'start_battle':
      console.log(chalk.yellow('\n🔥 Préparation du combat... 🔥'));
      try {
        const { player, enemy } = await createLobby();
        
        const result = await startGame(player, enemy);
        await endGame(result);  // Ajout de 'await' pour attendre la fin de l'animation
        
        // Pas besoin d'attendre 3 secondes supplémentaires ici puisque endGame a déjà une pause
        return mainMenu();
      } catch (error) {
        console.error(chalk.red('❌ Erreur lors du combat:', error.message));
        console.log(chalk.cyan('\nRetour au menu principal dans 3 secondes...'));
        await new Promise(resolve => setTimeout(resolve, 3000));
        return mainMenu();
      }
    case 'quit':
      console.log(chalk.magenta('\n👋 Au revoir ! À bientôt dans le monde fantastique.\n'));
      return;
  }
}

mainMenu();