// score-calculation.js
import { driversData, improvementsData, passengersData } from './data.js';
import { getAdjacentPassengers, getAdjacentSlots, getPassengersOnBus } from './bus-layout.js';
import { selectedImprovements } from './ui-handlers.js';

export let currentScore = {
    driverScore: 0,
    improvementsScore: 0,
    passengersScore: 0,
    handPenalty: 0,
    totalScore: 0
};

export function calculateScore() {
    console.log("--- Iniciando o cálculo de pontuação ---");
    let errorMessages = [];

    // Get current setup
    const driver = document.getElementById('driver-select').value;
    const passengersOnBus = getPassengersOnBus();
    const cardsInHand = parseInt(document.getElementById('cards-in-hand').value) || 0;

    console.log(`Configuração da rodada:`);
    console.log(`- Motorista: ${driver || 'Nenhum selecionado'}`);
    console.log(`- Melhorias: ${selectedImprovements.length > 0 ? selectedImprovements.join(', ') : 'Nenhuma'}`);
    console.log(`- Passageiros no busão: ${passengersOnBus.length}`);
    console.log(`- Cartas na mão: ${cardsInHand}`);

    // Validate required fields
    if (!driver) {
        errorMessages.push('Selecione um motorista antes de calcular a pontuação.');
    }

    if (passengersOnBus.length === 0) {
        errorMessages.push('Adicione pelo menos um passageiro ao busão antes de calcular a pontuação.');
    }

    if (errorMessages.length > 0) {
        return { success: false, errors: errorMessages };
    }

    // Calculate individual scores
    currentScore.driverScore = calculateDriverScore(driver, passengersOnBus);
    
    // LÓGICA DO VOVÔ MICHEL
    const vovoMichel = passengersOnBus.find(p => p.name === "Vovô Michel (O Guia do Busão)");
    if (vovoMichel) {
        console.log(`Efeito de Vovô Michel: Pontos do motorista (${currentScore.driverScore}) serão dobrados.`);
        currentScore.driverScore *= 2;
        errorMessages.push('Vovô Michel está no busão, os pontos do motorista foram dobrados.');
    }
    
    currentScore.improvementsScore = calculateImprovementsScore(selectedImprovements, passengersOnBus);
    currentScore.passengersScore = calculatePassengersScore(passengersOnBus);
    currentScore.handPenalty = -cardsInHand;

    // Calculate total score
    currentScore.totalScore = currentScore.driverScore + currentScore.improvementsScore +
        currentScore.passengersScore + currentScore.handPenalty;

    // Handle special cases that affect the entire score after all calculations
    const donaFausta = passengersOnBus.find(p => p.name === "Dona Fausta (A Desconfiada)");
    if (donaFausta) {
        console.log(`Efeito de Dona Fausta: Pontos de melhorias (${currentScore.improvementsScore}) serão cancelados.`);
        currentScore.improvementsScore = 0;
        currentScore.totalScore = currentScore.driverScore + currentScore.passengersScore + currentScore.handPenalty;
        errorMessages.push(`Dona Fausta está no busão, os pontos de melhorias foram cancelados.`);
    }
    
    return { success: true, score: currentScore, errors: errorMessages };
}

function calculateDriverScore(driver, passengers) {
    console.log(`\n> Calculando pontuação do motorista (${driver})...`);
    if (!driver || !driversData[driver]) return 0;

    const bonusCategories = driversData[driver].bonus_categories;
    console.log(`  Categorias de bônus do motorista: ${bonusCategories.join(', ')}`);
    let score = 0;

    passengers.forEach(passenger => {
        const passengerData = passengersData[passenger.name];
        if (!passengerData) return;
        
        let passengerPoints = 0;

        // Check all passenger traits against bonus categories
        if (bonusCategories.includes(passengerData.faixa_etaria)) {
            passengerPoints++;
            console.log(`  - Passageiro ${passenger.name}: +1 ponto pela faixa etária "${passengerData.faixa_etaria}".`);
        }
        if (bonusCategories.includes(passengerData.temperamento)) {
            passengerPoints++;
            console.log(`  - Passageiro ${passenger.name}: +1 ponto pelo temperamento "${passengerData.temperamento}".`);
        }
        if (bonusCategories.includes(passengerData.comportamento)) {
            passengerPoints++;
            console.log(`  - Passageiro ${passenger.name}: +1 ponto pelo comportamento "${passengerData.comportamento}".`);
        }
        score += passengerPoints;
    });
    
    console.log(`  Pontuação total do motorista: ${score}`);
    return score;
}

function calculateImprovementsScore(improvements, passengers) {
    console.log(`\n> Calculando pontuação das melhorias...`);
    let score = 0;
    
    if (improvements.length === 0) {
        console.log('  Nenhuma melhoria selecionada. Pontos: 0');
    }

    improvements.forEach(improvement => {
        if (!improvementsData[improvement]) return;
        
        const bonusCategories = improvementsData[improvement].bonus_categories;
        console.log(`  - Melhoria "${improvement}": Categorias de bônus: ${bonusCategories.join(', ')}`);
        
        passengers.forEach(passenger => {
            const passengerData = passengersData[passenger.name];
            if (!passengerData) return;
            
            let passengerPoints = 0;

            // Check all passenger traits against bonus categories
            if (bonusCategories.includes(passengerData.faixa_etaria)) {
                passengerPoints++;
                console.log(`    Passageiro ${passenger.name}: +1 ponto para "${improvement}" (faixa etária: ${passengerData.faixa_etaria}).`);
            }
            if (bonusCategories.includes(passengerData.temperamento)) {
                passengerPoints++;
                console.log(`    Passageiro ${passenger.name}: +1 ponto para "${improvement}" (temperamento: ${passengerData.temperamento}).`);
            }
            if (bonusCategories.includes(passengerData.comportamento)) {
                passengerPoints++;
                console.log(`    Passageiro ${passenger.name}: +1 ponto para "${improvement}" (comportamento: ${passengerData.comportamento}).`);
            }
            score += passengerPoints;
        });
    });
    
    console.log(`  Pontuação total das melhorias: ${score}`);
    return score;
}

function calculatePassengersScore(passengers) {
    console.log(`\n> Calculando pontuação dos passageiros...`);
    let totalScore = 0;

    passengers.forEach(passenger => {
        const passengerData = passengersData[passenger.name];
        if (!passengerData) return;

        let passengerScore = passengerData.base_points;
        console.log(`  Passageiro ${passenger.name} (assento ${passenger.slot}):`);
        console.log(`    - Pontos base: ${passengerData.base_points}`);
        
        const adjacentPassengers = getAdjacentPassengers(passenger.slot, passengers);

        // Apply passenger-specific effects
        switch(passenger.name) {
            case "Caio (O Estudante)":
            case "Leandro (O Dorminhoco)":
                // +1 para cada passageiro Silencioso adjacente
                const adjacentSilenciosos = adjacentPassengers.filter(p => passengersData[p.name].comportamento === "Silencioso").length;
                if (adjacentSilenciosos > 0) {
                    passengerScore += adjacentSilenciosos;
                    console.log(`    - Efeito: +${adjacentSilenciosos} ponto(s) por passageiro(s) Silencioso(s) adjacente(s).`);
                }
                break;

            case "Sol (O Good Vibes)":
                // +1 para cada passageiro Equilibrado e cada Comunicativo no Busão
                const equilibrados = passengers.filter(p => passengersData[p.name].temperamento === "Equilibrado").length;
                const comunicativos = passengers.filter(p => passengersData[p.name].comportamento === "Comunicativo").length;
                if (equilibrados > 0) {
                     passengerScore += equilibrados;
                     console.log(`    - Efeito: +${equilibrados} ponto(s) por passageiro(s) Equilibrado(s) no busão.`);
                }
                if (comunicativos > 0) {
                    passengerScore += comunicativos;
                    console.log(`    - Efeito: +${comunicativos} ponto(s) por passageiro(s) Comunicativo(s) no busão.`);
                }
                break;
                
            case "Rato (O Malandro)":
                // +2 para cada passageiro Idoso no Busão
                const idososCount = passengers.filter(p => passengersData[p.name].faixa_etaria === "Idoso").length;
                if (idososCount > 0) {
                    passengerScore += 2 * idososCount;
                    console.log(`    - Efeito: +${2 * idososCount} ponto(s) por Idoso(s) no busão.`);
                }
                break;

            case "Raul (O Pancada)":
                // +1 para cada passageiro Jovem e cada Comunicativo Adjacente
                const adjacentsJovemComunicativo = adjacentPassengers.filter(p => 
                    passengersData[p.name].faixa_etaria === "Jovem" && 
                    passengersData[p.name].comportamento === "Comunicativo").length;
                if (adjacentsJovemComunicativo > 0) {
                    passengerScore += adjacentsJovemComunicativo;
                    console.log(`    - Efeito: +${adjacentsJovemComunicativo} ponto(s) por passageiro(s) Jovem e Comunicativo adjacente(s).`);
                }
                break;

            case "Dona Cida (A Tagarela)":
            case "Seu Amadeu (O Irritado)":
                // +1 para cada passageiro Barulhento adjacente
                const adjacentBarulhentos = adjacentPassengers.filter(p => passengersData[p.name].comportamento === "Barulhento").length;
                if (adjacentBarulhentos > 0) {
                    passengerScore += adjacentBarulhentos;
                    console.log(`    - Efeito: +${adjacentBarulhentos} ponto(s) por passageiro(s) Barulhento(s) adjacente(s).`);
                }
                break;

            case "Sophia (A Blogueira)":
                // +2 para cada passageiro Jovem no Busão (se tiver Wi-Fi)
                if (selectedImprovements.includes("Wi-Fi e tomadas")) {
                    const jovensCount = passengers.filter(p => passengersData[p.name].faixa_etaria === "Jovem").length;
                    if (jovensCount > 0) {
                        passengerScore += 2 * jovensCount;
                        console.log(`    - Efeito: +${2 * jovensCount} ponto(s) por Jovem(s) no busão (Wi-Fi presente).`);
                    }
                }
                break;

            case "Seu Horácio (O Antisocial)":
                // +3 para cada assento adjacente vazio
                const occupiedSlots = passengers.map(p => p.slot);
                const adjacentSlots = getAdjacentSlots(passenger.slot);
                const emptyAdjacent = adjacentSlots.filter(slot => !occupiedSlots.includes(slot));
                if (emptyAdjacent.length > 0) {
                    passengerScore += 3 * emptyAdjacent.length;
                    console.log(`    - Efeito: +${3 * emptyAdjacent.length} ponto(s) por assento(s) vazio(s) adjacente(s).`);
                }
                break;

            case "Célio (O Claustrofóbico)":
            case "Waldisnei (O Cheiroso)":
                // -1 para cada passageiro adjacente
                if (adjacentPassengers.length > 0) {
                    passengerScore -= adjacentPassengers.length;
                    console.log(`    - Efeito: -${adjacentPassengers.length} ponto(s) por passageiro(s) adjacente(s).`);
                }
                break;

            case "Márcia e Enzo (A Mãe e o Pestinha)":
                // -2 para cada passageeiro Silencioso no Busão
                const silenciososCount = passengers.filter(p => passengersData[p.name].comportamento === "Silencioso").length;
                if (silenciososCount > 0) {
                    passengerScore -= 2 * silenciososCount;
                    console.log(`    - Efeito: -${2 * silenciososCount} ponto(s) por passageiro(s) Silencioso(s) no busão.`);
                }
                break;

            case "Luíz (Motolover)":
                // --- LÓGICA ATUALIZADA DO LUÍZ ---
                const luizColumn = (passenger.slot - 1) % 6;
                const passengersInFront = passengers.filter(p => {
                    const pColumn = (p.slot - 1) % 6;
                    return p.slot < passenger.slot && pColumn !== luizColumn;
                }).length;
                if (passengersInFront > 0) {
                    passengerScore -= 2 * passengersInFront;
                    console.log(`    - Efeito: -${2 * passengersInFront} ponto(s) por passageiro(s) em assento de número menor e em coluna diferente.`);
                }
                // --- FIM DA LÓGICA ATUALIZADA DO LUÍZ ---
                break;

            case "Cláudio (O Pastor)":
                // -1 ponto para cada Silencioso no busão
                const silenciososPastor = passengers.filter(p => passengersData[p.name].comportamento === "Silencioso").length;
                if (silenciososPastor > 0) {
                    passengerScore -= silenciososPastor;
                    console.log(`    - Efeito: -${silenciososPastor} ponto(s) por passageiro(s) Silencioso(s) no busão.`);
                }
                break;

            case "Charles (O Maromba)":
                // -1 para cada passageiro adjacente, -3 se Fabão estiver no Busão
                if (adjacentPassengers.length > 0) {
                    passengerScore -= adjacentPassengers.length;
                    console.log(`    - Efeito: -${adjacentPassengers.length} ponto(s) por passageiro(s) adjacente(s).`);
                }
                if (passengers.some(p => p.name === "Fabão (O Grandão)")) {
                    passengerScore -= 3;
                    console.log(`    - Efeito: -3 pontos adicionais por Fabão estar no busão.`);
                }
                break;

            case "Dona Mirtes (A Fofoqueira)":
                // Só pontua se estiver adjacente a pelo menos 1 Comunicativo
                if (!adjacentPassengers.some(p => passengersData[p.name].comportamento === "Comunicativo")) {
                    passengerScore = 0;
                    console.log(`    - Efeito: Pontos cancelados, pois não há passageiro Comunicativo adjacente.`);
                } else {
                    console.log(`    - Efeito: Condição de pontuação cumprida (Comunicativo adjacente).`);
                }
                break;

            case "Wilson (O Pai de Planta)":
                // +1 para cada passageiro Idoso adjacente (ocupa 2 lugares na coluna)
                const adjacentIdosos = adjacentPassengers.filter(p => passengersData[p.name].faixa_etaria === "Idoso").length;
                if (adjacentIdosos > 0) {
                    passengerScore += adjacentIdosos;
                    console.log(`    - Efeito: +${adjacentIdosos} ponto(s) por Idoso(s) adjacente(s).`);
                }
                break;

            case "Costelinha (O Caramelo)":
                // +1 para cada passageiro no busão.
                passengerScore += passengers.length;
                console.log(`    - Efeito: +${passengers.length} ponto(s) por cada passageiro no busão.`);
                break;
            
            // Passageiros com efeitos de embarque não precisam de lógica aqui
            case "Wesley (DJ do busão)":
            case "Sheila (A Barraqueira)":
            case "Fabão (O Grandão)":
            case "Roberto (O Bonzinho)":
            case "Dabs (A Board Gamer)":
            case "Dona Fausta (A Desconfiada)":
            case "Jorge (O Perdido)":
            case "João (PCD)":
            case "Peter (O Playboy)":
            case "Mari (A Conectada)":
            case "Alison (O Mago de Araque)":
            case "Vovô Michel (O Guia do Busão)":
                break;

            default:
                break;
        }

        console.log(`    -> Pontuação final de ${passenger.name}: ${passengerScore}`);
        totalScore += passengerScore;
    });

    console.log(`  Pontuação total de todos os passageiros: ${totalScore}`);
    return totalScore;
}