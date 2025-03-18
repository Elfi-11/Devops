import { select, Separator } from '@inquirer/prompts';
import { createTeams } from './creationEquipe.js';
import { createLobby } from './lobby.js';
import { startGame, endGame } from './game.js';

async function mainMenu() {
  const answer = await select({
    message: 'Bienvenue dans le RPG !',
    choices: [
      {
        name: 'Lancer un combat',
        value: 'start_battle',
        description: 'Lancer un combat entre deux personnages.',
      },
      new Separator(),
      {
        name: 'Quitter',
        value: 'quit',
        description: 'Quitter le jeu.',
      },
    ],
  });

  switch (answer) {
    case 'start_battle':
      console.log('Préparation du combat...');
      try {
        const { player, enemy } = await createLobby();
        
        const result = await startGame(player, enemy);
        
        endGame(result);
        
        return mainMenu();
      } catch (error) {
        console.error('Erreur lors du combat:', error.message);
        return mainMenu();
      }
    case 'quit':
      console.log('Au revoir !');
      return;
  }
}

mainMenu();