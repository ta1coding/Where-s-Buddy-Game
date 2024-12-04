# TechSpec.md

## Overview

This application is a browser-based interactive "Find the Character" game. The objective is to locate specific targets on various images across multiple levels. It includes developer tools for debugging and customization purposes.

---

## Features

1. **Core Gameplay**:
   - Display images across multiple levels.
   - Detect user clicks on the target area to validate successful identification.
   - Progress through levels upon success.
   - Display a "Game Over" modal upon completion.

2. **Developer Tools**:
   - Toggle developer mode to display coordinates and highlight target areas.
   - Dynamic updates to developer overlays during gameplay.

3. **Responsive Design**:
   - Optimized for various screen sizes with responsive styling.
   - Ensures visibility of all game elements.

---

## File Structure

### 1. `DeveloperTools.js`
- **Purpose**: Implements tools for debugging and development.
- **Key Methods**:
  - `initialize(game)`: Initializes developer tools, including UI components for coordinate display and target zone highlighting.
  - `updateTargetZone(targetZone, game)`: Dynamically updates the highlighted target zone based on the current level.
- **Interactive Elements**:
  - Coordinate display overlay.
  - Target zone overlay.

### 2. `Game.js`
- **Purpose**: Core game logic and state management.
- **Key Methods**:
  - `initializeGame()`: Sets up the game by loading the first level and attaching event listeners.
  - `loadLevel(levelIndex)`: Loads the level data and updates the UI.
  - `handleClick(event)`: Handles user clicks to check if the target was found.
  - `advanceLevel()`: Proceeds to the next level.
  - `endGame()`: Displays the "Game Over" modal.
  - `restartGame()`: Resets the game to the first level.
- **Game State**:
  - `currentLevel`: Tracks the current level.
  - `levels`: Stores level data (e.g., images, target positions).

### 3. `LevelData.js`
- **Purpose**: Contains static data for game levels.
- **Data Structure**:
  ```javascript
  [
      { image: 'path/to/image.jpg', targetPosition: { x, y, width, height } },
      ...
  ]
