// bus-layout.js

import { passengersData } from './data.js';

let selectedPassenger = null;

export function setupBusLayout() {
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
            
            // TODO: Implement special effects that happen "on boarding" here
            
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

export function setSelectedPassenger(passengerName) {
    selectedPassenger = passengerName;
}

export function getPassengersOnBus() {
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

export function getAdjacentPassengers(slot, passengers) {
    const adjacentSlots = getAdjacentSlots(slot);
    return passengers.filter(p => adjacentSlots.includes(p.slot));
}

export function getAdjacentSlots(slot) {
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

export function clearBus() {
    const busSlots = document.querySelectorAll('.bus-slot-btn');
    busSlots.forEach(slot => {
        slot.classList.remove('filled');
        slot.textContent = `Assento ${slot.dataset.slot}`;
        delete slot.dataset.passenger;
    });
}

export function fillBus(passengers) {
    clearBus();
    passengers.forEach(p => {
        const slot = document.querySelector(`.bus-slot-btn[data-slot="${p.slot}"]`);
        if (slot) {
            slot.classList.add('filled');
            slot.textContent = p.name;
            slot.dataset.passenger = p.name;
        }
    });
}