import { select, Separator } from '@inquirer/prompts';
import { createTeams } from './creationEquipe.js';

const answer = await select({
  message: 'Bienvenue dans le RPG !',
  choices: [
    {
      name: 'Nouvelle partie',
      value: 'new_game',
      description: 'Créer une nouvelle partie.',
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
  case 'new_game':
    console.log('Démarrage d\'une nouvelle partie...');
    try {
      await createTeams();
    } catch (error) {
      console.error('Erreur lors de la création des équipes:', error.message);
    }
    break;
  case 'quit':
    console.log('Au revoir !');
    break;
}