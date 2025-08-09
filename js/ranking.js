// ranking.js
import { players, activePlayer } from './player-management.js';
import { currentScore } from './score-calculation.js';

export function savePlayerScore() {
    if (!activePlayer) {
        alert('Selecione um jogador ativo antes de salvar a pontuação.');
        return;
    }
    
    const player = players.find(p => p.id === activePlayer);
    if (!player) {
        alert('Jogador ativo não encontrado.');
        return;
    }
    
    // Update player data with current score
    player.score = currentScore.totalScore;
    
    // TODO: Update player details with current configuration (driver, improvements, passengers)
    // This logic will be moved from the main script.
    
    // Update UI
    // updatePlayersUI(); // This will be called from ui-handlers
    updateRanking();
    
    // Show success message
    alert(`Pontuação de ${player.name} atualizada para ${player.score}!`);
}

export function updateRanking() {
    const container = document.getElementById('ranking-container');
    const noRanking = document.getElementById('no-ranking');
    
    if (players.length === 0 || players.every(p => p.score === 0)) {
        noRanking.classList.remove('hidden');
        container.innerHTML = '';
        container.appendChild(noRanking);
        return;
    }
    
    noRanking.classList.add('hidden');
    container.innerHTML = '';
    
    // Sort players by score (descending)
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    
    sortedPlayers.forEach((player, index) => {
        const position = index + 1;
        const item = document.createElement('div');
        item.className = 'ranking-item bg-gray-100 hover:bg-gray-200';
        
        const positionDiv = document.createElement('div');
        positionDiv.className = `ranking-position ${position === 1 ? 'position-1' : 
                                 position === 2 ? 'position-2' : 'position-3'}`;
        positionDiv.textContent = position;
        
        const trophySpan = document.createElement('span');
        trophySpan.className = 'ranking-trophy';
        trophySpan.textContent = position === 1 ? '🏆' : position === 2 ? '🥈' : '🥉';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'ranking-name';
        nameDiv.textContent = player.name;
        
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'ranking-score';
        scoreDiv.textContent = player.score;
        
        item.appendChild(positionDiv);
        if (position <= 3) item.appendChild(trophySpan);
        item.appendChild(nameDiv);
        item.appendChild(scoreDiv);
        
        container.appendChild(item);
    });
}