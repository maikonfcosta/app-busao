// player-management.js
import { updateRanking } from './ranking.js';

// Global variables
export let players = [];
export let activePlayer = null;

export function addPlayer(name) {
    if (!name) return;

    // Limit to 3 players
    if (players.length >= 3) {
        alert('O jogo é limitado a 3 jogadores. Remova um jogador antes de adicionar outro.');
        return;
    }

    const player = {
        id: Date.now().toString(),
        name: name,
        score: 0,
        details: {
            driver: '',
            improvements: [],
            passengers: [],
            cardsInHand: 0
        }
    };

    players.push(player);
    updatePlayersUI();
    updateActivePlayerSelect();
    updateRanking();

    // Set as active player if it's the first one
    if (players.length === 1) {
        setActivePlayer(player.id);
    }
}

export function updatePlayersUI() {
    const container = document.getElementById('players-container');
    container.innerHTML = '';

    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = `player-card ${player.id === activePlayer ? 'active' : ''}`;
        playerCard.dataset.id = player.id;

        const header = document.createElement('div');
        header.className = 'player-header';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name';
        nameSpan.textContent = player.name;

        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'player-score';
        scoreSpan.textContent = player.score;

        header.appendChild(nameSpan);
        header.appendChild(scoreSpan);

        const details = document.createElement('div');
        details.className = 'player-details';

        if (player.details.driver) {
            details.innerHTML += `<div>Motorista: ${player.details.driver}</div>`;
        }

        if (player.details.improvements.length > 0) {
            details.innerHTML += `<div>Melhorias: ${player.details.improvements.join(', ')}</div>`;
        }

        if (player.details.passengers.length > 0) {
            details.innerHTML += `<div>Passageiros: ${player.details.passengers.length}</div>`;
        }

        if (player.details.cardsInHand > 0) {
            details.innerHTML += `<div>Cartas na mão: ${player.details.cardsInHand}</div>`;
        }

        const actions = document.createElement('div');
        actions.className = 'player-actions';

        const selectBtn = document.createElement('button');
        selectBtn.className = 'bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700';
        selectBtn.textContent = 'Selecionar';
        selectBtn.addEventListener('click', () => setActivePlayer(player.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700';
        deleteBtn.textContent = 'Remover';
        deleteBtn.addEventListener('click', () => removePlayer(player.id));

        actions.appendChild(selectBtn);
        actions.appendChild(deleteBtn);

        playerCard.appendChild(header);
        playerCard.appendChild(details);
        playerCard.appendChild(actions);

        container.appendChild(playerCard);
    });

    // Update add player button state
    document.getElementById('add-player-btn').disabled = players.length >= 3;
    if (players.length >= 3) {
        document.getElementById('add-player-btn').classList.add('bg-gray-400');
        document.getElementById('add-player-btn').classList.remove('bg-blue-600', 'hover:bg-blue-700');
    } else {
        document.getElementById('add-player-btn').classList.remove('bg-gray-400');
        document.getElementById('add-player-btn').classList.add('bg-blue-600', 'hover:bg-blue-700');
    }
}

export function updateActivePlayerSelect() {
    const select = document.getElementById('active-player-select');
    select.innerHTML = '<option value="">Selecione um jogador...</option>';

    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.id;
        option.textContent = player.name;
        option.selected = player.id === activePlayer;
        select.appendChild(option);
    });
}

export function setActivePlayer(playerId) {
    activePlayer = playerId;
    updatePlayersUI();
    document.getElementById('active-player-select').value = playerId;

    // TODO: Implement logic to load player data into the form
    const player = players.find(p => p.id === playerId);
    if (player) {
        // This will be handled by the UI module
    } else {
        // This will be handled by the UI module
    }
}

export function removePlayer(playerId) {
    players = players.filter(player => player.id !== playerId);

    // If we removed the active player, select another one if available
    if (playerId === activePlayer) {
        activePlayer = players.length > 0 ? players[0].id : null;
    }

    updatePlayersUI();
    updateActivePlayerSelect();
    updateRanking();
}