import { select, Separator } from '@inquirer/prompts';
// Or

const answer = await select({
  message: 'Bienvenue dans le RPG !',
  choices: [
    {
      name: 'Nouvelle partie',
      value: 'new_game',
      description: 'npm is the most popular package manager',
    },
    new Separator(),
    {
      name: 'Quitter',
      value: 'quit',
      description: 'yarn is an awesome package manager',
    },
  ],
});

console.log(answer);