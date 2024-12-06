import { Game } from './Game.js';
import { DeveloperTools } from './DeveloperTools.js';
import { levels } from './LevelData.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game(levels);

    // Uncomment the following line to enable developer tools during development
    //DeveloperTools.initialize(game);
});

