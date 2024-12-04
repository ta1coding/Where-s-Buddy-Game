const levels = [
    {
        image: 'levels/level1.jpg',
        targetPosition: { x: 820, y: 450, width: 11, height: 22 }
    },
    {
        image: 'levels/level2.jpg',
        targetPosition: { x: 840, y: 389, width: 11, height: 22 }
    },
    {
        image: 'levels/level3.jpg',
        targetPosition: { x: 224, y: 424, width: 10, height: 22 }
    },
    {
        image: 'levels/level4.jpg',
        targetPosition: { x: 374, y: 374, width: 10, height: 20 }
    },
    {
        image: 'levels/level5.jpg',
        targetPosition: { x: 840, y: 395, width: 6, height: 15 }
    },
    {
        image: 'levels/level6.jpg',
        targetPosition: { x: 300, y: 486, width: 10, height: 20 }
    }
];

class WaldoGame {
    constructor() {
        this.currentLevel = 0;
        this.gameBoard = document.getElementById('game-board');
        this.gameImage = document.getElementById('game-image');
        this.levelTitle = document.getElementById('level-title');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.restartBtn = document.getElementById('restart-btn');

        this.initializeGame();
    }

    initializeGame() {
        this.loadLevel(this.currentLevel);
        this.gameImage.addEventListener('click', this.handleClick.bind(this));
        this.restartBtn.addEventListener('click', this.restartGame.bind(this));

        // Add developer mode toggle
        this.createDeveloperModeElements();
    }

    createDeveloperModeElements() {
        // Create coordinates display
        this.coordDisplay = document.createElement('div');
        this.coordDisplay.id = 'coord-display';
        this.coordDisplay.style.position = 'fixed';
        this.coordDisplay.style.top = '10px';
        this.coordDisplay.style.left = '10px';
        this.coordDisplay.style.background = 'rgba(0,0,0,0.7)';
        this.coordDisplay.style.color = 'white';
        this.coordDisplay.style.padding = '10px';
        this.coordDisplay.style.display = 'none';
        this.coordDisplay.style.zIndex = '1000';
        document.body.appendChild(this.coordDisplay);

        // Create developer mode toggle button
        this.devModeButton = document.createElement('button');
        this.devModeButton.textContent = 'Toggle Dev Mode';
        this.devModeButton.style.position = 'fixed';
        this.devModeButton.style.top = '10px';
        this.devModeButton.style.right = '10px';
        this.devModeButton.style.zIndex = '1000';
        document.body.appendChild(this.devModeButton);

        // Create target zone visualization
        this.targetZone = document.createElement('div');
        this.targetZone.style.position = 'absolute';
        this.targetZone.style.border = '2px solid red';
        this.targetZone.style.display = 'none';
        this.gameBoard.appendChild(this.targetZone);

        // Add event listeners
        this.devModeButton.addEventListener('click', this.toggleDeveloperMode.bind(this));
        this.gameImage.addEventListener('mousemove', this.updateCoordinates.bind(this));
    }

    toggleDeveloperMode() {
        const isDevMode = this.coordDisplay.style.display === 'none';

        this.coordDisplay.style.display = isDevMode ? 'block' : 'none';

        // Visualize current level's target zone
        const target = levels[this.currentLevel].targetPosition;
        this.targetZone.style.left = `${target.x}px`;
        this.targetZone.style.top = `${target.y}px`;
        this.targetZone.style.width = `${target.width}px`;
        this.targetZone.style.height = `${target.height}px`;
        this.targetZone.style.display = isDevMode ? 'block' : 'none';
    }

    updateCoordinates(event) {
        if (this.coordDisplay.style.display === 'none') return;

        const rect = this.gameImage.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.coordDisplay.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
    }

    loadLevel(levelIndex) {
        this.gameImage.src = levels[levelIndex].image;
        this.levelTitle.textContent = `Find the Character - Level ${levelIndex + 1}`;
    }

    handleClick(event) {
        const rect = this.gameImage.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const target = levels[this.currentLevel].targetPosition;

        if (
            x >= target.x &&
            x <= target.x + target.width &&
            y >= target.y &&
            y <= target.y + target.height
        ) {
            this.advanceLevel();
        }
    }

    advanceLevel() {
        this.currentLevel++;

        if (this.currentLevel < levels.length) {
            this.loadLevel(this.currentLevel);
        } else {
            this.endGame();
        }
    }

    endGame() {
        this.gameOverModal.classList.remove('hidden');
    }

    restartGame() {
        this.currentLevel = 0;
        this.loadLevel(this.currentLevel);
        this.gameOverModal.classList.add('hidden');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WaldoGame();
});