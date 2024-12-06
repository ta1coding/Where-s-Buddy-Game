import { levels } from "./LevelData.js";
import { battlePassTiers } from "./BattlePassData.js";

export class Game {
  constructor(levels = levels) {
    this.levels = levels;
    this.currentLevel = 0;
    this.gameBoard = document.getElementById("game-board");
    this.gameImage = document.getElementById("game-image");
    this.levelTitle = document.getElementById("level-title");
    this.gameOverModal = document.getElementById("game-over-modal");
    this.restartBtn = document.getElementById("restart-btn");
    this.startTime = null;

    // Battle Pass-related properties
    this.xp = 0;
    this.currentTier = 1; // Start at tier 1
    this.unlockedIcons = []; // Track unlocked icons

    // Profile UI elements
    this.profileContainer = document.getElementById("profile-container");
    this.profileIconsContainer = document.getElementById("profile-icons");
    this.profileToggleBtn = document.getElementById("profile-toggle-btn");

    this.initializeGame();
  }

  initializeGame() {
    this.loadLevel(this.currentLevel);
    this.gameImage.addEventListener("click", this.handleClick.bind(this));
    this.restartBtn.addEventListener("click", this.restartGame.bind(this));
    this.profileToggleBtn.addEventListener("click", this.toggleProfile.bind(this));
    this.startTime = Date.now();

    // Grant Tier 1 rewards right at the start
    this.handleTierUnlocked();

    this.updateBattlePassUI();
  }

  loadLevel(levelIndex) {
    const level = this.levels[levelIndex];
    this.gameImage.src = level.image;
    this.levelTitle.textContent = `Find the Character - Level ${levelIndex + 1}`;
  }

  handleClick(event) {
    const rect = this.gameImage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const target = this.levels[this.currentLevel].targetPosition;

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
    // Award XP for completing a level
    this.awardXP(50); // For example, give 50 XP per level completion

    this.currentLevel++;
    if (this.currentLevel < this.levels.length) {
      this.loadLevel(this.currentLevel);
    } else {
      this.endGame();
    }
  }

  endGame() {
    const endTime = Date.now();
    const totalTime = ((endTime - this.startTime) / 1000).toFixed(2);

    this.gameOverModal.classList.remove("hidden");

    const timeDisplay = document.getElementById("time-display");
    timeDisplay.textContent = `Total Time: ${totalTime} seconds`;

    const audio = document.getElementById("completion-sound");
    audio.play();
  }

  restartGame() {
    this.currentLevel = 0;
    this.startTime = Date.now();
    this.loadLevel(this.currentLevel);

    this.gameOverModal.classList.add("hidden");
    const timeDisplay = document.getElementById("time-display");
    timeDisplay.textContent = "";
  }

  awardXP(amount) {
    this.xp += amount;
    this.checkForBattlePassTierUp();
    this.updateBattlePassUI();
  }

  checkForBattlePassTierUp() {
    let newTier = this.currentTier;
    for (const tierData of battlePassTiers) {
      if (this.xp >= tierData.xpRequired && tierData.tier > newTier) {
        newTier = tierData.tier;
      }
    }
    if (newTier !== this.currentTier) {
      this.currentTier = newTier;
      this.handleTierUnlocked();
    }
  }

  handleTierUnlocked() {
    const tierData = battlePassTiers.find(t => t.tier === this.currentTier);
    if (tierData) {
      // Unlock the icon if it exists
      if (tierData.iconUrl && !this.unlockedIcons.includes(tierData.iconUrl)) {
        this.unlockedIcons.push(tierData.iconUrl);
        this.updateProfileUI();
      }
      // Only show alert if it's after the initial game start,
      // otherwise you might want to remove this alert to avoid confusion.
      if (this.xp > 0) {
        alert(`Congratulations! You've unlocked Tier ${this.currentTier}: ${tierData.reward}`);
      }
    }
  }

  updateBattlePassUI() {
    const bpContainer = document.getElementById("battle-pass-container");
    if (bpContainer) {
      const nextTierData = battlePassTiers.find(t => t.tier === this.currentTier + 1);

      let html = `<h2>Battle Pass</h2>`;
      html += `<p>Current Tier: ${this.currentTier}</p>`;
      html += `<p>Current XP: ${this.xp}</p>`;

      if (nextTierData) {
        const xpNeeded = nextTierData.xpRequired - this.xp;
        html += `<p>XP to next Tier: ${xpNeeded}</p>`;
      } else {
        html += `<p>All Tiers Unlocked!</p>`;
      }

      bpContainer.innerHTML = html;
    }
  }

  updateProfileUI() {
    // Clear current icons
    this.profileIconsContainer.innerHTML = "";

    // Display all unlocked icons
    this.unlockedIcons.forEach(iconUrl => {
      const img = document.createElement("img");
      img.src = iconUrl;
      img.alt = "Unlocked Icon";
      this.profileIconsContainer.appendChild(img);
    });
  }

  toggleProfile() {
    const isHidden = this.profileContainer.classList.contains("hidden");
    if (isHidden) {
      this.profileContainer.classList.remove("hidden");
      this.profileToggleBtn.textContent = "Close Profile";
    } else {
      this.profileContainer.classList.add("hidden");
      this.profileToggleBtn.textContent = "Show Profile";
    }
  }
}
