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
        
        endGame(result);
        
        console.log(chalk.cyan('\nAppuyez sur Entrée pour continuer...'));
        await new Promise(resolve => process.stdin.once('data', resolve));
        
        return mainMenu();
      } catch (error) {
        console.error(chalk.red('❌ Erreur lors du combat:', error.message));
        return mainMenu();
      }
    case 'quit':
      console.log(chalk.magenta('\n👋 Au revoir ! À bientôt dans le monde fantastique.\n'));
      return;
  }
}

mainMenu();