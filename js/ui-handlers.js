// ui-handlers.js

import { driversData, improvementsData, passengersData } from './data.js';
import { players, activePlayer, addPlayer, setActivePlayer, removePlayer } from './player-management.js';
import { setSelectedPassenger, getPassengersOnBus, clearBus, fillBus } from './bus-layout.js';
import { calculateScore, currentScore } from './score-calculation.js';
import { savePlayerScore, updateRanking } from './ranking.js';

// Global variables for UI state
export let selectedImprovements = [];

export function setupEventListeners() {
    // Player management
    document.getElementById('add-player-btn').addEventListener('click', () => {
        const nameInput = document.getElementById('new-player-name');
        addPlayer(nameInput.value.trim());
        nameInput.value = '';
    });

    document.getElementById('new-player-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const nameInput = document.getElementById('new-player-name');
            addPlayer(nameInput.value.trim());
            nameInput.value = '';
        }
    });

    document.getElementById('active-player-select').addEventListener('change', (e) => {
        setActivePlayer(e.target.value);
        loadPlayerConfig();
    });

    // Driver selection
    document.getElementById('driver-select').addEventListener('change', updateDriverInfo);

    // Improvements selection
    document.getElementById('add-improvement-btn').addEventListener('click', addImprovement);

    // Passenger selection
    document.getElementById('passenger-select').addEventListener('change', updatePassengerInfo);

    // Score calculation
    document.getElementById('calculate-btn').addEventListener('click', () => {
        const result = calculateScore();
        if (result.success) {
            displayResults(result.score);
            updatePassengerListUI(getPassengersOnBus());
        } else {
            showErrors(result.errors);
        }
    });
    
    document.getElementById('save-score-btn').addEventListener('click', savePlayerScore);

    // Ranking
    document.getElementById('calculate-ranking-btn').addEventListener('click', updateRanking);
}

// --- Player management UI updates ---

export function loadPlayerConfig() {
    const player = players.find(p => p.id === activePlayer);
    if (player) {
        // Set driver
        document.getElementById('driver-select').value = player.details.driver || '';
        updateDriverInfo();

        // Set improvements
        selectedImprovements = [...player.details.improvements];
        updateSelectedImprovementsUI();

        // Set passengers on the bus
        fillBus(player.details.passengers);
        updatePassengerListUI(player.details.passengers);

        // Set cards in hand
        document.getElementById('cards-in-hand').value = player.details.cardsInHand || 0;
    } else {
        // Clear form if no player selected
        document.getElementById('driver-select').value = '';
        document.getElementById('driver-info').textContent = '';
        selectedImprovements = [];
        updateSelectedImprovementsUI();
        clearBus();
        updatePassengerListUI([]);
        document.getElementById('cards-in-hand').value = 0;
    }
}

// --- Driver selection UI updates ---

export function updateDriverInfo() {
    const driverSelect = document.getElementById('driver-select');
    const driverInfo = document.getElementById('driver-info');
    
    const driver = driverSelect.value;
    if (driver && driversData[driver]) {
        driverInfo.textContent = driversData[driver].description;
    } else {
        driverInfo.textContent = '';
    }
}

// --- Improvements selection UI updates ---

function addImprovement() {
    const improvementSelect = document.getElementById('improvement-select');
    const improvement = improvementSelect.value;
    
    if (!improvement) return;
    
    // Check if already selected
    if (selectedImprovements.includes(improvement)) {
        alert('Esta melhoria já foi selecionada!');
        return;
    }
    
    // Check max improvements (3)
    if (selectedImprovements.length >= 3) {
        alert('Você só pode selecionar no máximo 3 melhorias!');
        return;
    }
    
    selectedImprovements.push(improvement);
    updateSelectedImprovementsUI();
    improvementSelect.value = '';
}

export function updateSelectedImprovementsUI() {
    const list = document.getElementById('selected-improvements-list');
    list.innerHTML = '';
    
    selectedImprovements.forEach((improvement, index) => {
        const item = document.createElement('li');
        item.className = 'selected-improvement';
        
        const text = document.createElement('span');
        text.textContent = improvement;
        
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-improvement';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', () => removeImprovement(index));
        
        item.appendChild(text);
        item.appendChild(removeBtn);
        list.appendChild(item);
    });
    
    // Update add button state
    document.getElementById('add-improvement-btn').disabled = selectedImprovements.length >= 3;
}

function removeImprovement(index) {
    selectedImprovements.splice(index, 1);
    updateSelectedImprovementsUI();
}

// --- Passenger selection UI updates ---

export function updatePassengerInfo() {
    const passengerSelect = document.getElementById('passenger-select');
    const passengerInfo = document.getElementById('passenger-info');
    
    const passenger = passengerSelect.value;
    if (passenger && passengersData[passenger]) {
        const data = passengersData[passenger];
        passengerInfo.innerHTML = `
            <div><strong>Faixa Etária:</strong> ${data.faixa_etaria}</div>
            <div><strong>Temperamento:</strong> ${data.temperamento}</div>
            <div><strong>Comportamento:</strong> ${data.comportamento}</div>
            <div><strong>Pontos Base:</strong> ${data.base_points}</div>
            <div><strong>Efeito:</strong> ${data.effect}</div>
        `;
        
        // Store the selected passenger for bus placement in the bus-layout module
        setSelectedPassenger(passenger);
    } else {
        passengerInfo.textContent = '';
        setSelectedPassenger(null);
    }
}

export function updatePassengerListUI(passengers) {
    const container = document.getElementById('passenger-list');
    container.innerHTML = '';
    
    if (passengers.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Nenhum passageiro no busão.</p>';
        return;
    }
    
    passengers.forEach(passenger => {
        const passengerData = passengersData[passenger.name];
        if (!passengerData) return;
        
        const card = document.createElement('div');
        card.className = 'passenger-card';
        
        const name = document.createElement('div');
        name.className = 'passenger-name';
        name.textContent = passenger.name;
        
        const traits = document.createElement('div');
        traits.className = 'passenger-traits';
        
        const ageTrait = document.createElement('span');
        ageTrait.className = 'trait';
        ageTrait.textContent = passengerData.faixa_etaria;
        
        const tempTrait = document.createElement('span');
        tempTrait.className = 'trait';
        tempTrait.textContent = passengerData.temperamento;
        
        const behavTrait = document.createElement('span');
        behavTrait.className = 'trait';
        behavTrait.textContent = passengerData.comportamento;
        
        traits.appendChild(ageTrait);
        traits.appendChild(tempTrait);
        traits.appendChild(behavTrait);
        
        const effect = document.createElement('div');
        effect.className = 'passenger-effect';
        effect.textContent = `Efeito: ${passengerData.effect}`;
        
        const basePoints = document.createElement('div');
        basePoints.className = 'passenger-effect';
        basePoints.textContent = `Pontos Base: ${passengerData.base_points}`;
        
        const slotInfo = document.createElement('div');
        slotInfo.className = 'adjacent-info';
        slotInfo.textContent = `Assento: ${passenger.slot}`;
        
        card.appendChild(name);
        card.appendChild(traits);
        card.appendChild(effect);
        card.appendChild(basePoints);
        card.appendChild(slotInfo);
        
        container.appendChild(card);
    });
}

// --- Results and Errors UI updates ---

export function displayResults(score) {
    document.getElementById('driver-score').textContent = score.driverScore;
    document.getElementById('improvements-score').textContent = score.improvementsScore;
    document.getElementById('passengers-score').textContent = score.passengersScore;
    document.getElementById('hand-penalty').textContent = score.handPenalty;
    document.getElementById('total-score').textContent = score.totalScore;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('error-messages').innerHTML = '';
}

export function showErrors(errors) {
    const errorContainer = document.getElementById('error-messages');
    errorContainer.innerHTML = '';
    
    errors.forEach(error => {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = error;
        errorContainer.appendChild(errorElement);
    });
    
    document.getElementById('results').classList.add('hidden');
}