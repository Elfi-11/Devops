import { select, Separator } from '@inquirer/prompts';
// Or

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

console.log(answer);