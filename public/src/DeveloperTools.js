import { levels } from './LevelData.js';

export class DeveloperTools {
    static initialize(game) {
        console.log('Developer Tools Initialized');

        // Create a button to toggle developer mode
        const devModeButton = document.createElement('button');
        devModeButton.textContent = 'Toggle Dev Mode';
        devModeButton.style.position = 'fixed';
        devModeButton.style.top = '10px';
        devModeButton.style.right = '10px';
        devModeButton.style.zIndex = '1000';
        document.body.appendChild(devModeButton);

        // Add coordinate display
        const coordDisplay = document.createElement('div');
        coordDisplay.id = 'coord-display';
        coordDisplay.style.position = 'fixed';
        coordDisplay.style.top = '10px';
        coordDisplay.style.left = '10px';
        coordDisplay.style.background = 'rgba(0,0,0,0.7)';
        coordDisplay.style.color = 'white';
        coordDisplay.style.padding = '10px';
        coordDisplay.style.zIndex = '1000';
        coordDisplay.style.display = 'none';
        document.body.appendChild(coordDisplay);

        // Add target zone overlay
        const targetZone = document.createElement('div');
        targetZone.style.position = 'absolute';
        targetZone.style.border = '2px solid red';
        targetZone.style.backgroundColor = 'rgba(255,0,0,0.2)';
        targetZone.style.display = 'none';
        targetZone.style.pointerEvents = 'none';
        targetZone.style.zIndex = '1000';
        document.body.appendChild(targetZone);

        // Event listeners for developer mode
        devModeButton.addEventListener('click', () => {
            const isDevModeActive = coordDisplay.style.display === 'none';
            coordDisplay.style.display = isDevModeActive ? 'block' : 'none';
            
            if (isDevModeActive) {
                DeveloperTools.updateTargetZone(targetZone, game);
            } else {
                targetZone.style.display = 'none';
            }
        });

        game.gameImage.addEventListener('mousemove', (event) => {
            if (coordDisplay.style.display === 'none') return;

            const rect = game.gameImage.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            coordDisplay.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
        });

        // Hook into the game's loadLevel method to update the target zone dynamically
        const originalLoadLevel = game.loadLevel.bind(game);
        game.loadLevel = (levelIndex) => {
            originalLoadLevel(levelIndex);
            if (coordDisplay.style.display === 'block') {
                DeveloperTools.updateTargetZone(targetZone, game);
            }
        };

        console.log('Hover over the game image to see coordinates.');
    }

    static updateTargetZone(targetZone, game) {
        const level = levels[game.currentLevel];
        const imageRect = game.gameImage.getBoundingClientRect();
        
        // Set the target zone position and size directly
        targetZone.style.left = `${imageRect.left + level.targetPosition.x}px`;
        targetZone.style.top = `${imageRect.top + level.targetPosition.y}px`;
        targetZone.style.width = `${level.targetPosition.width}px`;
        targetZone.style.height = `${level.targetPosition.height}px`;
        targetZone.style.display = 'block';
    }
}
