// Game data
const driversData = {
    "Bigode": {
        bonus_categories: ["Jovem", "Caótico", "Barulhento"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Jovem, Caótico ou Barulhento"
    },
    "Lucinha": {
        bonus_categories: ["Adulto", "Tranquilo", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto, Tranquilo ou Silencioso"
    },
    "Montanha": {
        bonus_categories: ["Idoso", "Equilibrado", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso, Equilibrado ou Comunicativo"
    },
    "Paty": {
        bonus_categories: ["Jovem", "Tranquilo", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Jovem, Tranquilo ou Comunicativo"
    },
    "Pedrinho": {
        bonus_categories: ["Adulto", "Caótico", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto, Caótico ou Silencioso"
    },
    "Pereirão": {
        bonus_categories: ["Idoso", "Equilibrado", "Barulhento"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso, Equilibrado ou Barulhento"
    },
    "Seu Zé (O Experiente)": {
        bonus_categories: ["Idoso", "Equilibrado", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso, Equilibrado ou Silencioso"
    },
    "Juca (O Apressado)": {
        bonus_categories: ["Jovem", "Impulsivo", "Barulhento"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Jovem, Impulsivo ou Barulhento"
    },
    "Dona Marta (A Simpática)": {
        bonus_categories: ["Adulto", "Equilibrado", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto, Equilibrado ou Comunicativo"
    },
    "Seu Jorge (O Paciente)": {
        bonus_categories: ["Idoso", "Equilibrado", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso, Equilibrado ou Comunicativo"
    },
    "Dona Cleide (A Atenciosa)": {
        bonus_categories: ["Adulto", "Equilibrado", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto, Equilibrado ou Silencioso"
    },
    "Marcelo (O Novato)": {
        bonus_categories: ["Jovem", "Equilibrado", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Jovem, Equilibrado ou Silencioso"
    },
    "Robson (O Animado)": {
        bonus_categories: ["Jovem", "Impulsivo", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Jovem, Impulsivo ou Comunicativo"
    }
};

const improvementsData = {
    "Wi-Fi e tomadas": {
        bonus_categories: ["Jovem", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Jovem ou Comunicativo"
    },
    "Acessibilidade": {
        bonus_categories: ["Idoso", "Tranquilo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso ou Tranquilo"
    },
    "Assentos Reclináveis": {
        bonus_categories: ["Adulto", "Barulhento"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto ou Barulhento"
    },
    "Ar-condicionado": {
        bonus_categories: ["Caótico", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Caótico ou Silencioso"
    },
    "Banheiro": {
        bonus_categories: ["Adulto", "Silencioso"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Adulto ou Silencioso"
    },
    "Sistema de Som": {
        bonus_categories: ["Barulhento", "Caótico"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Barulhento ou Caótico"
    },
    "TV de bordo": {
        bonus_categories: ["Equilibrado", "Comunicativo"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Equilibrado ou Comunicativo"
    },
    "Cortinas": {
        bonus_categories: ["Idoso", "Caótico"],
        description: "Ganha 1 ponto para cada característica de passageiro que seja Idoso ou Caótico"
    }
};

const passengersData = {
    "Caio (O Estudante)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Silencioso",
        base_points: 4,
        effect: "+1 Ponto para cada Silencioso adjacente."
    },
    "Leandro (O Dorminhoco)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Silencioso",
        base_points: 3,
        effect: "+1 Ponto para cada Silencioso adjacente."
    },
    "Sol (O Good Vibes)": {
        faixa_etaria: "Jovem",
        temperamento: "Tranquilo",
        comportamento: "Silencioso",
        base_points: 2,
        effect: "+1 Ponto por cada Equilibrado e cada Comunicativo no Busão."
    },
    "Rato (O Malandro)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 1,
        effect: "+2 pontos por Idoso no busão."
    },
    "Raul (O Pancada)": {
        faixa_etaria: "Idoso",
        temperamento: "Equilibrado",
        comportamento: "Barulhento",
        base_points: 3,
        effect: "+1 Ponto por cada Jovem e cada Comunicativo Adjacente."
    },
    "Dona Cida (A Tagarela)": {
        faixa_etaria: "Idoso",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 4,
        effect: "+1 Ponto por cada Barulhento adjacente."
    },
    "Fábio (O Vendedor)": {
        faixa_etaria: "Adulto",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 3,
        effect: "Sem efeito."
    },
    "Seu Amadeu (O Irritado)": {
        faixa_etaria: "Idoso",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 5,
        effect: "+1 Ponto por cada Barulhento adjacente."
    },
    "Wesley (DJ do busão)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 3,
        effect: "Ao embarcar, todos os Silenciosos adjacentes desembarcam."
    },
    "Sophia (A Blogueira)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 2,
        effect: "Se houver Wi-Fi e Tomadas, +2 pontos por cada Jovem no Busão."
    },
    "Seu Horácio (O Antisocial)": {
        faixa_etaria: "Idoso",
        temperamento: "Equilibrado",
        comportamento: "Silencioso",
        base_points: 3,
        effect: "+3 Pontos para cada espaço vazio adjacente."
    },
    "Sheila (A Barraqueira)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 4,
        effect: "Ao embarcar, uma coluna inteira desembarca."
    },
    "Célio (O Claustrofóbico)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Silencioso",
        base_points: 3,
        effect: "-1 para cara passageiro adjacente."
    },
    "Márcia e Enzo (A Mãe e o Pestinha)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Barulhento",
        base_points: 2,
        effect: "-2 Pontos para cada Silencioso no Busão."
    },
    "Luíz (Motolover)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Silencioso",
        base_points: 3,
        effect: "-2 Pontos por passageiro entre ele e o motorista."
    },
    "Fabão (O Grandão)": {
        faixa_etaria: "Adulto",
        temperamento: "Caótico",
        comportamento: "Silencioso",
        base_points: 1,
        effect: "Ao embarcar, faz a coluna inteira desembarcar."
    },
    "Waldisnei (O Cheiroso)": {
        faixa_etaria: "Jovem",
        temperamento: "Caótico",
        comportamento: "Comunicativo",
        base_points: 0,
        effect: "-1 Ponto para qualquer passageiro adjacente."
    },
    "Cláudio (O Pastor)": {
        faixa_etaria: "Adulto",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 2,
        effect: "-1 ponto para cada Silencioso no busão."
    },
    "Roberto (O Bonzinho)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Comunicativo",
        base_points: 6,
        effect: "Se um Idoso ou Gestante embarcar depois, ele desembarca."
    },
    "Charles (O Maromba)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Barulhento",
        base_points: 4,
        effect: "-1 ponto para cada passageiro adjacente. -3 se Fabão estiver no Busão."
    },
    "Ana (A Gestante)": {
        faixa_etaria: "Adulto",
        temperamento: "Tranquilo",
        comportamento: "Comunicativo",
        base_points: 5,
        effect: "Só embarca se tiver Assentos Reclináveis."
    },
    "João (PCD)": {
        faixa_etaria: "Jovem",
        temperamento: "Equilibrado",
        comportamento: "Silencioso",
        base_points: 6,
        effect: "Só embarca se tiver Acessibilidade."
    },
    "Peter (O Playboy)": {
        faixa_etaria: "Jovem",
        temperamento: "Equilibrado",
        comportamento: "Barulhento",
        base_points: 7,
        effect: "Só embarca se tiver todas as 3 melhorias."
    },
    "Mari (A Conectada)": {
        faixa_etaria: "Jovem",
        temperamento: "Tranquilo",
        comportamento: "Silencioso",
        base_points: 4,
        effect: "Só embarca se houver Wi-Fi e Tomadas."
    },
    "Wilson (O Pai de Planta)": {
        faixa_etaria: "Adulto",
        temperamento: "Equilibrado",
        comportamento: "Comunicativo",
        base_points: 5,
        effect: "Ocupa 2 lugares. +1 Ponto para cada Idoso adjacente."
    },
    "Dona Mirtes (A Fofoqueira)": {
        faixa_etaria: "Adulto",
        temperamento: "Tranquilo",
        comportamento: "Comunicativo",
        base_points: 5,
        effect: "Só pontua se estiver adjacente a pelo menos um Comunicativo."
    },
    "Cara Misterioso": {
        faixa_etaria: "Adulto",
        temperamento: "Tranquilo",
        comportamento: "Silencioso",
        base_points: 4,
        effect: "Só embarca no fundo do Busão (assentos 6 ou 12)."
    },
    "Jorge (O Perdido)": {
        faixa_etaria: "Adulto",
        temperamento: "Caótico",
        comportamento: "Barulhento",
        base_points: 4,
        effect: "Embarque imediato em qualquer espaço vago."
    },
    "Dabs (A Board Gamer)": {
        faixa_etaria: "Adulto",
        temperamento: "Tranquilo",
        comportamento: "Comunicativo",
        base_points: 6,
        effect: "Pode fazer até dois passageiros com Penalidade desembarcarem."
    },
    "Dona Fausta (A Desconfiada)": {
        faixa_etaria: "Idoso",
        temperamento: "Caótico",
        comportamento: "Silencioso",
        base_points: 1,
        effect: "Cancela pontos de melhorias se estiver no busão no final."
    }
};

// Global variables
let selectedPassenger = null;
let selectedImprovements = [];
let errorMessages = [];
let players = [];
let activePlayer = null;
let currentScore = {
    driverScore: 0,
    improvementsScore: 0,
    passengersScore: 0,
    handPenalty: 0,
    totalScore: 0
};

// Player management functions
function addPlayer(name) {
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

function updatePlayersUI() {
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

function updateActivePlayerSelect() {
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

function setActivePlayer(playerId) {
    activePlayer = playerId;
    updatePlayersUI();
    document.getElementById('active-player-select').value = playerId;
    
    // Reset the form with the player's data if available
    const player = players.find(p => p.id === playerId);
    if (player) {
        // Set driver
        document.getElementById('driver-select').value = player.details.driver || '';
        updateDriverInfo();
        
        // Set improvements
        selectedImprovements = [...player.details.improvements];
        updateSelectedImprovementsUI();
        
        // Set passengers (this would need to update the bus layout)
        // For now just update the passenger list display
        updatePassengerListUI(player.details.passengers);
        
        // Set cards in hand
        document.getElementById('cards-in-hand').value = player.details.cardsInHand || 0;
    } else {
        // Clear form if no player selected
        document.getElementById('driver-select').value = '';
        document.getElementById('driver-info').textContent = '';
        selectedImprovements = [];
        updateSelectedImprovementsUI();
        updatePassengerListUI([]);
        document.getElementById('cards-in-hand').value = 0;
    }
}

function removePlayer(playerId) {
    players = players.filter(player => player.id !== playerId);
    
    // If we removed the active player, select another one if available
    if (playerId === activePlayer) {
        activePlayer = players.length > 0 ? players[0].id : null;
    }
    
    updatePlayersUI();
    updateActivePlayerSelect();
    updateRanking();
}

// Driver selection functions
function updateDriverInfo() {
    const driverSelect = document.getElementById('driver-select');
    const driverInfo = document.getElementById('driver-info');
    
    const driver = driverSelect.value;
    if (driver && driversData[driver]) {
        driverInfo.textContent = driversData[driver].description;
    } else {
        driverInfo.textContent = '';
    }
}

// Improvements selection functions
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

function removeImprovement(index) {
    selectedImprovements.splice(index, 1);
    updateSelectedImprovementsUI();
}

function updateSelectedImprovementsUI() {
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

// Passenger selection functions
function updatePassengerInfo() {
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
        
        // Store the selected passenger for bus placement
        selectedPassenger = passenger;
    } else {
        passengerInfo.textContent = '';
        selectedPassenger = null;
    }
}

// Bus layout functions
function setupBusLayout() {
    const busSlots = document.querySelectorAll('.bus-slot-btn');
    
    busSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            if (!selectedPassenger) {
                alert('Selecione um passageiro antes de colocá-lo no busão!');
                return;
            }
            
            // Check if slot is already occupied
            if (slot.classList.contains('filled')) {
                alert('Este assento já está ocupado!');
                return;
            }
            
            // Check passenger requirements
            const passengerData = passengersData[selectedPassenger];
            if (!passengerData) return;
            
            // Check special requirements
            if (passengerData.effect.includes("Só embarca se")) {
                if (passengerData.effect.includes("Assentos Reclináveis") && !selectedImprovements.includes("Assentos Reclináveis")) {
                    alert('Este passageiro só embarca se tiver Assentos Reclináveis!');
                    return;
                }
                if (passengerData.effect.includes("Acessibilidade") && !selectedImprovements.includes("Acessibilidade")) {
                    alert('Este passageiro só embarca se tiver Acessibilidade!');
                    return;
                }
                if (passengerData.effect.includes("todas as 3 melhorias") && selectedImprovements.length < 3) {
                    alert('Este passageiro só embarca se tiver todas as 3 melhorias!');
                    return;
                }
                if (passengerData.effect.includes("Wi-Fi e Tomadas") && !selectedImprovements.includes("Wi-Fi e tomadas")) {
                    alert('Este passageiro só embarca se tiver Wi-Fi e tomadas!');
                    return;
                }
            }
            
            if (passengerData.effect.includes("fundo do Busão") && ![6, 12].includes(parseInt(slot.dataset.slot))) {
                alert('Este passageiro só pode sentar no fundo do busão (assentos 6 ou 12)!');
                return;
            }
            
            // Place passenger in the slot
            slot.classList.add('filled');
            slot.textContent = selectedPassenger;
            slot.dataset.passenger = selectedPassenger;
            
            // Reset selection
            document.getElementById('passenger-select').value = '';
            document.getElementById('passenger-info').textContent = '';
            selectedPassenger = null;
        });
    });
    
    // Clear bus button
    document.getElementById('clear-bus-btn').addEventListener('click', () => {
        busSlots.forEach(slot => {
            slot.classList.remove('filled');
            slot.textContent = `Assento ${slot.dataset.slot}`;
            delete slot.dataset.passenger;
        });
    });
}

function getPassengersOnBus() {
    const busSlots = document.querySelectorAll('.bus-slot-btn.filled');
    const passengers = [];
    
    busSlots.forEach(slot => {
        passengers.push({
            name: slot.dataset.passenger,
            slot: parseInt(slot.dataset.slot)
        });
    });
    
    return passengers;
}

// Passenger list display functions
function updatePassengerListUI(passengers) {
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

// Score calculation functions
function calculateScore() {
    errorMessages = [];
    currentScore = {
        driverScore: 0,
        improvementsScore: 0,
        passengersScore: 0,
        handPenalty: 0,
        totalScore: 0
    };
    
    // Validate active player
    if (!activePlayer) {
        errorMessages.push('Selecione um jogador ativo antes de calcular a pontuação.');
        showErrors();
        return;
    }
    
    const player = players.find(p => p.id === activePlayer);
    if (!player) {
        errorMessages.push('Jogador ativo não encontrado.');
        showErrors();
        return;
    }
    
    // Get current setup
    const driver = document.getElementById('driver-select').value;
    const passengersOnBus = getPassengersOnBus();
    const cardsInHand = parseInt(document.getElementById('cards-in-hand').value) || 0;
    
    // Validate required fields
    if (!driver) {
        errorMessages.push('Selecione um motorista antes de calcular a pontuação.');
    }
    
    if (passengersOnBus.length === 0) {
        errorMessages.push('Adicione pelo menos um passageiro ao busão antes de calcular a pontuação.');
    }
    
    if (errorMessages.length > 0) {
        showErrors();
        return;
    }
    
    // Calculate driver score
    currentScore.driverScore = calculateDriverScore(driver, passengersOnBus);
    
    // Calculate improvements score
    currentScore.improvementsScore = calculateImprovementsScore(selectedImprovements, passengersOnBus);
    
    // Calculate passengers score
    currentScore.passengersScore = calculatePassengersScore(passengersOnBus);
    
    // Calculate hand penalty
    currentScore.handPenalty = -cardsInHand;
    
    // Calculate total score
    currentScore.totalScore = currentScore.driverScore + currentScore.improvementsScore + 
                              currentScore.passengersScore + currentScore.handPenalty;
    
    // Handle special cases that affect the entire score
    if (passengersOnBus.some(p => p.name === "Dona Fausta (A Desconfiada)")) {
        // Cancels all improvements points
        currentScore.improvementsScore = 0;
        currentScore.totalScore = currentScore.driverScore + currentScore.passengersScore + currentScore.handPenalty;
    }
    
    // Display results
    displayResults();
}

function calculateDriverScore(driver, passengers) {
    if (!driver || !driversData[driver]) return 0;
    
    const bonusCategories = driversData[driver].bonus_categories;
    let score = 0;
    
    passengers.forEach(passenger => {
        const passengerData = passengersData[passenger.name];
        if (!passengerData) return;
        
        // Check all passenger traits against bonus categories
        if (bonusCategories.includes(passengerData.faixa_etaria)) score++;
        if (bonusCategories.includes(passengerData.temperamento)) score++;
        if (bonusCategories.includes(passengerData.comportamento)) score++;
    });
    
    return score;
}

function calculateImprovementsScore(improvements, passengers) {
    let score = 0;
    
    improvements.forEach(improvement => {
        if (!improvementsData[improvement]) return;
        
        const bonusCategories = improvementsData[improvement].bonus_categories;
        
        passengers.forEach(passenger => {
            const passengerData = passengersData[passenger.name];
            if (!passengerData) return;
            
            // Check all passenger traits against bonus categories
            if (bonusCategories.includes(passengerData.faixa_etaria)) score++;
            if (bonusCategories.includes(passengerData.temperamento)) score++;
            if (bonusCategories.includes(passengerData.comportamento)) score++;
        });
    });
    
    return score;
}

function calculatePassengersScore(passengers) {
    let totalScore = 0;
    
    passengers.forEach(passenger => {
        const passengerData = passengersData[passenger.name];
        if (!passengerData) return;
        
        let passengerScore = passengerData.base_points;
        
        // Calculate adjacency effects
        const adjacentPassengers = getAdjacentPassengers(passenger.slot, passengers);
        
        // Apply passenger-specific effects
        switch(passenger.name) {
            case "Caio (O Estudante)":
            case "Leandro (O Dorminhoco)":
                // +1 para cada passageiro Silencioso adjacente
                passengerScore += adjacentPassengers.filter(p => 
                    passengersData[p.name].comportamento === "Silencioso").length;
                break;
                
            case "Sol (O Good Vibes)":
                // +1 para cada passageiro Equilibrado e Comunicativo no BUSÃO
                passengerScore += passengers.filter(p => 
                    passengersData[p.name].temperamento === "Equilibrado" && 
                    passengersData[p.name].comportamento === "Comunicativo").length;
                break;
                
            case "Rato (O Malandro)":
                // +2 para cada passageiro Idoso no BUSÃO
                passengerScore += 2 * passengers.filter(p => 
                    passengersData[p.name].faixa_etaria === "Idoso").length;
                break;
                
            case "Raul (O Pancada)":
                // +1 para cada passageiro Jovem e Comunicativo adjacente
                passengerScore += adjacentPassengers.filter(p => 
                    passengersData[p.name].faixa_etaria === "Jovem" && 
                    passengersData[p.name].comportamento === "Comunicativo").length;
                break;
                
            case "Dona Cida (A Tagarela)":
            case "Seu Amadeu (O Irritado)":
                // +1 para cada passageiro Barulhento adjacente
                passengerScore += adjacentPassengers.filter(p => 
                    passengersData[p.name].comportamento === "Barulhento").length;
                break;
                
            case "Sophia (A Blogueira)":
                // +2 para cada passageiro Jovem no BUSÃO (se tiver Wi-Fi)
                if (selectedImprovements.includes("Wi-Fi e tomadas")) {
                    passengerScore += 2 * passengers.filter(p => 
                        passengersData[p.name].faixa_etaria === "Jovem").length;
                }
                break;
                
            case "Seu Horácio (O Antisocial)":
                // +3 para cada assento adjacente vazio
                const adjacentSlots = getAdjacentSlots(passenger.slot);
                const occupiedSlots = passengers.map(p => p.slot);
                const emptyAdjacent = adjacentSlots.filter(slot => !occupiedSlots.includes(slot));
                passengerScore += 3 * emptyAdjacent.length;
                break;
                
            case "Célio (O Claustrofóbico)":
            case "Waldisnei (O Cheiroso)":
                // -1 para cada passageiro adjacente
                passengerScore -= adjacentPassengers.length;
                break;
                
            case "Márcia e Enzo (A Mãe e o Pestinha)":
                // -2 para cada passageiro Silencioso no BUSÃO
                passengerScore -= 2 * passengers.filter(p => 
                    passengersData[p.name].comportamento === "Silencioso").length;
                break;
                
            case "Luíz (Motolover)":
                // -2 para cada passageiro entre ele e o motorista (mesma coluna)
                const column = (passenger.slot - 1) % 6 + 1;
                const slotsInColumn = [column, column + 6];
                const passengerSlotIndex = slotsInColumn.indexOf(passenger.slot);
                
                if (passengerSlotIndex > 0) {
                    // Check if there's a passenger in front
                    const frontSlot = slotsInColumn[passengerSlotIndex - 1];
                    const frontPassenger = passengers.find(p => p.slot === frontSlot);
                    if (frontPassenger) {
                        passengerScore -= 2;
                    }
                }
                break;
                
            case "Cláudio (O Pastor)":
                // -1 ponto para cada Silencioso no busão
                passengerScore -= passengers.filter(p => 
                    passengersData[p.name].comportamento === "Silencioso").length;
                break;
                
            case "Charles (O Maromba)":
                // -1 para cada passageiro adjacente, -3 se Fabão estiver no BUSÃO
                passengerScore -= adjacentPassengers.length;
                if (passengers.some(p => p.name === "Fabão (O Grandão)")) {
                    passengerScore -= 3;
                }
                break;
                
            case "Dona Mirtes (A Fofoqueira)":
                // Só pontua se estiver adjacente a pelo menos 1 Comunicativo
                if (!adjacentPassengers.some(p => 
                    passengersData[p.name].comportamento === "Comunicativo")) {
                    passengerScore = 0;
                }
                break;
                
            case "Wilson (O Pai de Planta)":
                // +1 para cada passageiro Idoso adjacente (ocupa 2 lugares na coluna)
                passengerScore += adjacentPassengers.filter(p => 
                    passengersData[p.name].faixa_etaria === "Idoso").length;
                break;
        }
        
        totalScore += passengerScore;
    });
    
    return totalScore;
}

function getAdjacentPassengers(slot, passengers) {
    const adjacentSlots = getAdjacentSlots(slot);
    return passengers.filter(p => adjacentSlots.includes(p.slot));
}

function getAdjacentSlots(slot) {
    // Bus layout is 2 rows of 6 seats (12 total)
    // Seats are numbered left to right, top to bottom
    const adjacent = [];
    
    // Same column (front or back)
    if (slot <= 6) {
        // Front row - check back
        adjacent.push(slot + 6);
    } else {
        // Back row - check front
        adjacent.push(slot - 6);
    }
    
    // Same row - left and right
    const rowStart = slot <= 6 ? 1 : 7;
    const positionInRow = slot - rowStart + 1;
    
    if (positionInRow > 1) {
        adjacent.push(slot - 1);
    }
    
    if (positionInRow < 6) {
        adjacent.push(slot + 1);
    }
    
    return adjacent;
}

function displayResults() {
    document.getElementById('driver-score').textContent = currentScore.driverScore;
    document.getElementById('improvements-score').textContent = currentScore.improvementsScore;
    document.getElementById('passengers-score').textContent = currentScore.passengersScore;
    document.getElementById('hand-penalty').textContent = currentScore.handPenalty;
    document.getElementById('total-score').textContent = currentScore.totalScore;
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('error-messages').innerHTML = '';
    
    // Update passenger list with current bus passengers
    updatePassengerListUI(getPassengersOnBus());
}

function showErrors() {
    const errorContainer = document.getElementById('error-messages');
    errorContainer.innerHTML = '';
    
    errorMessages.forEach(error => {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = error;
        errorContainer.appendChild(errorElement);
    });
    
    document.getElementById('results').classList.add('hidden');
}

function savePlayerScore() {
    if (!activePlayer) {
        alert('Selecione um jogador ativo antes de salvar a pontuação.');
        return;
    }
    
    const player = players.find(p => p.id === activePlayer);
    if (!player) {
        alert('Jogador ativo não encontrado.');
        return;
    }
    
    // Update player data
    player.score = currentScore.totalScore;
    player.details = {
        driver: document.getElementById('driver-select').value,
        improvements: [...selectedImprovements],
        passengers: [...getPassengersOnBus()],
        cardsInHand: parseInt(document.getElementById('cards-in-hand').value) || 0
    };
    
    // Update UI
    updatePlayersUI();
    updateRanking();
    
    // Show success message
    alert(`Pontuação de ${player.name} atualizada para ${player.score}!`);
}

// Ranking functions
function updateRanking() {
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

// Event listeners
function setupEventListeners() {
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
    });
    
    // Driver selection
    document.getElementById('driver-select').addEventListener('change', updateDriverInfo);
    
    // Improvements selection
    document.getElementById('add-improvement-btn').addEventListener('click', addImprovement);
    
    // Passenger selection
    document.getElementById('passenger-select').addEventListener('change', updatePassengerInfo);
    
    // Score calculation
    document.getElementById('calculate-btn').addEventListener('click', calculateScore);
    document.getElementById('save-score-btn').addEventListener('click', savePlayerScore);
    
    // Ranking
    document.getElementById('calculate-ranking-btn').addEventListener('click', updateRanking);
}

// Initialize the app
function init() {
    setupEventListeners();
    setupBusLayout();
    updateRanking();
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);