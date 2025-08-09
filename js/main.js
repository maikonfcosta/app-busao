// main.js

import { setupEventListeners, loadPlayerConfig } from './ui-handlers.js';
import { updatePlayersUI } from './player-management.js';
import { setupBusLayout } from './bus-layout.js';
import { updateRanking } from './ranking.js';

// Initialize the app
function init() {
    // Setup event listeners for the entire application
    setupEventListeners();

    // Setup the bus layout with its functionality
    setupBusLayout();

    // Load initial data (if any) or clear the UI
    loadPlayerConfig();
    
    // Update player and ranking UI on startup
    updatePlayersUI();
    updateRanking();
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);