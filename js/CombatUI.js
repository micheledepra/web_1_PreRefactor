/**
 * RISK COMBAT UI
 * 
 * Handles the user interface aspects of the combat system
 * Connects the core combat logic with the visual elements
 */

/**
 * Combat UI System
 * Manages visual interactions with the combat system
 */
class CombatUI {
    /**
     * Create a new combat UI manager
     * @param {CombatSystem} combatSystem - The combat system instance
     * @param {Object} gameUtils - Game utilities for safe DOM access
     */
    constructor(combatSystem, gameUtils) {
        this.combatSystem = combatSystem;
        this.gameUtils = gameUtils;
        this.currentAttackingTerritory = null;
        this.currentDefendingTerritory = null;
        
        // Make sure modals exist in the DOM
        this.ensureModalsExist();
        
        // UI elements with fallback mechanism
        this.elements = {
            // Attack modal elements
            attackModal: gameUtils.safeGetElement('attack-modal') || document.getElementById('attack-modal'),
            attackerName: gameUtils.safeGetElement('attack-modal-attacking-name') || document.getElementById('attack-modal-attacking-name'),
            attackerArmies: gameUtils.safeGetElement('attack-modal-attacking-armies') || document.getElementById('attack-modal-attacking-armies'),
            defenderName: gameUtils.safeGetElement('attack-modal-defending-name') || document.getElementById('attack-modal-defending-name'),
            defenderArmies: gameUtils.safeGetElement('attack-modal-defending-armies') || document.getElementById('attack-modal-defending-armies'),
            armyInputSection: gameUtils.safeGetElement('attack-modal-army-input') || document.getElementById('attack-modal-army-input'),
            attackerArmyInput: gameUtils.safeGetElement('attack-modal-attacker-armies-input') || document.getElementById('attack-modal-attacker-armies-input'),
            defenderArmyInput: gameUtils.safeGetElement('attack-modal-defender-armies-input') || document.getElementById('attack-modal-defender-armies-input'),
            executeButton: gameUtils.safeGetElement('attack-modal-execute') || document.getElementById('attack-modal-execute'),
            resultsSection: gameUtils.safeGetElement('attack-modal-results') || document.getElementById('attack-modal-results'),
            attackerLossesDisplay: gameUtils.safeGetElement('attack-modal-attacker-losses') || document.getElementById('attack-modal-attacker-losses'),
            defenderLossesDisplay: gameUtils.safeGetElement('attack-modal-defender-losses') || document.getElementById('attack-modal-defender-losses'),
            battleResult: gameUtils.safeGetElement('attack-modal-battle-result') || document.getElementById('attack-modal-battle-result'),
            continueButton: gameUtils.safeGetElement('attack-modal-continue') || document.getElementById('attack-modal-continue'),
            endButton: gameUtils.safeGetElement('attack-modal-end') || document.getElementById('attack-modal-end'),
            resetButton: gameUtils.safeGetElement('attack-modal-reset') || document.getElementById('attack-modal-reset')
        };
        
        // Conquest elements with fallback mechanism
        this.conquestElements = {
            modal: gameUtils.safeGetElement('unit-transfer-modal') || document.getElementById('unit-transfer-modal'),
            sourceName: gameUtils.safeGetElement('transfer-source-name') || document.getElementById('transfer-source-name'),
            sourceArmies: gameUtils.safeGetElement('transfer-source-armies') || document.getElementById('transfer-source-armies'),
            destName: gameUtils.safeGetElement('transfer-destination-name') || document.getElementById('transfer-destination-name'),
            destArmies: gameUtils.safeGetElement('transfer-destination-armies') || document.getElementById('transfer-destination-armies'),
            slider: gameUtils.safeGetElement('transfer-slider') || document.getElementById('transfer-slider'),
            input: gameUtils.safeGetElement('transfer-input') || document.getElementById('transfer-input'),
            sliderMaxLabel: gameUtils.safeGetElement('slider-max-label') || document.getElementById('slider-max-label'),
            transferRange: gameUtils.safeGetElement('transfer-range') || document.getElementById('transfer-range'),
            previewSource: gameUtils.safeGetElement('preview-source-name') || document.getElementById('preview-source-name'),
            previewSourceArmies: gameUtils.safeGetElement('preview-source-armies') || document.getElementById('preview-source-armies'),
            previewDest: gameUtils.safeGetElement('preview-destination-name') || document.getElementById('preview-destination-name'),
            previewDestArmies: gameUtils.safeGetElement('preview-destination-armies') || document.getElementById('preview-destination-armies')
        };
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    /**
     * Make sure all required modal elements exist in the DOM
     * This function ensures the HTML structure is correct
     */
    ensureModalsExist() {
        // Check if attack modal exists
        let attackModal = document.getElementById('attack-modal');
        if (!attackModal) {
            console.log('Attack modal not found, ensuring it exists');
            this.createAttackModal();
        }
        
        // Check if unit transfer modal exists
        let transferModal = document.getElementById('unit-transfer-modal');
        if (!transferModal) {
            console.log('Transfer modal not found, ensuring it exists');
            this.createTransferModal();
        }
        
        // Check for specific elements in attack modal and create if missing
        this.ensureAttackModalElements();
        
        // Check for specific elements in transfer modal and create if missing
        this.ensureTransferModalElements();
    }
    
    /**
     * Ensure all attack modal elements exist
     */
    ensureAttackModalElements() {
        const attackModal = document.getElementById('attack-modal');
        if (!attackModal) return; // Can't add elements if modal doesn't exist
        
        const modalContent = attackModal.querySelector('.modal-content');
        if (!modalContent) return;
        
        // Check and create attacker name
        if (!document.getElementById('attack-modal-attacking-name')) {
            const attackSelection = modalContent.querySelector('.attack-selection');
            if (attackSelection) {
                const attackerDiv = attackSelection.querySelector('.attacker');
                if (attackerDiv && !attackerDiv.querySelector('#attack-modal-attacking-name')) {
                    const nameDiv = document.createElement('div');
                    nameDiv.id = 'attack-modal-attacking-name';
                    nameDiv.className = 'territory-name';
                    nameDiv.textContent = '-';
                    attackerDiv.appendChild(nameDiv);
                }
            }
        }
        
        // Check and create attacker armies
        if (!document.getElementById('attack-modal-attacking-armies')) {
            const attackSelection = modalContent.querySelector('.attack-selection');
            if (attackSelection) {
                const attackerDiv = attackSelection.querySelector('.attacker');
                if (attackerDiv && !attackerDiv.querySelector('#attack-modal-attacking-armies')) {
                    const armiesDiv = document.createElement('div');
                    armiesDiv.id = 'attack-modal-attacking-armies';
                    armiesDiv.className = 'territory-armies';
                    armiesDiv.textContent = '0 armies';
                    attackerDiv.appendChild(armiesDiv);
                }
            }
        }
        
        // Check and create defender name
        if (!document.getElementById('attack-modal-defending-name')) {
            const attackSelection = modalContent.querySelector('.attack-selection');
            if (attackSelection) {
                const defenderDiv = attackSelection.querySelector('.defender');
                if (defenderDiv && !defenderDiv.querySelector('#attack-modal-defending-name')) {
                    const nameDiv = document.createElement('div');
                    nameDiv.id = 'attack-modal-defending-name';
                    nameDiv.className = 'territory-name';
                    nameDiv.textContent = 'Select target';
                    defenderDiv.appendChild(nameDiv);
                }
            }
        }
        
        // Check and create defender armies
        if (!document.getElementById('attack-modal-defending-armies')) {
            const attackSelection = modalContent.querySelector('.attack-selection');
            if (attackSelection) {
                const defenderDiv = attackSelection.querySelector('.defender');
                if (defenderDiv && !defenderDiv.querySelector('#attack-modal-defending-armies')) {
                    const armiesDiv = document.createElement('div');
                    armiesDiv.id = 'attack-modal-defending-armies';
                    armiesDiv.className = 'territory-armies';
                    armiesDiv.textContent = '0 armies';
                    defenderDiv.appendChild(armiesDiv);
                }
            }
        }
        
        // Check and create end button
        if (!document.getElementById('attack-modal-end')) {
            const resultsSection = modalContent.querySelector('.combat-results');
            if (resultsSection) {
                const endBtn = document.createElement('button');
                endBtn.id = 'attack-modal-end';
                endBtn.className = 'attack-btn';
                endBtn.style.background = '#6c757d';
                endBtn.textContent = 'End Attack';
                endBtn.addEventListener('click', () => this.endAttack());
                resultsSection.appendChild(endBtn);
            }
        }
        
        // Check and create reset button
        if (!document.getElementById('attack-modal-reset')) {
            const modalContent = attackModal.querySelector('.modal-content');
            if (modalContent) {
                const resetBtn = document.createElement('button');
                resetBtn.id = 'attack-modal-reset';
                resetBtn.className = 'attack-btn';
                resetBtn.style.display = 'none';
                resetBtn.style.background = '#ffc107';
                resetBtn.style.color = '#000';
                resetBtn.style.marginTop = '10px';
                resetBtn.textContent = 'New Attack';
                resetBtn.addEventListener('click', () => this.resetAttack());
                modalContent.appendChild(resetBtn);
            }
        }
    }
    
    /**
     * Ensure all transfer modal elements exist
     */
    ensureTransferModalElements() {
        const transferModal = document.getElementById('unit-transfer-modal');
        if (!transferModal) return; // Can't add elements if modal doesn't exist
        
        const modalContent = transferModal.querySelector('.modal-content');
        if (!modalContent) return;
        
        // Check and create source name
        if (!document.getElementById('transfer-source-name')) {
            const sourceDiv = modalContent.querySelector('.transfer-territory.source');
            if (sourceDiv) {
                const nameDiv = document.createElement('div');
                nameDiv.id = 'transfer-source-name';
                nameDiv.className = 'territory-name';
                nameDiv.textContent = 'Attacking Territory';
                sourceDiv.appendChild(nameDiv);
            }
        }
        
        // Check and create source armies
        if (!document.getElementById('transfer-source-armies')) {
            const sourceDiv = modalContent.querySelector('.transfer-territory.source');
            if (sourceDiv) {
                const armiesDiv = document.createElement('div');
                armiesDiv.id = 'transfer-source-armies';
                armiesDiv.className = 'territory-armies';
                armiesDiv.textContent = '0 armies';
                sourceDiv.appendChild(armiesDiv);
            }
        }
        
        // Check and create destination name
        if (!document.getElementById('transfer-destination-name')) {
            const destDiv = modalContent.querySelector('.transfer-territory.destination');
            if (destDiv) {
                const nameDiv = document.createElement('div');
                nameDiv.id = 'transfer-destination-name';
                nameDiv.className = 'territory-name';
                nameDiv.textContent = 'Conquered Territory';
                destDiv.appendChild(nameDiv);
            }
        }
        
        // Check and create destination armies
        if (!document.getElementById('transfer-destination-armies')) {
            const destDiv = modalContent.querySelector('.transfer-territory.destination');
            if (destDiv) {
                const armiesDiv = document.createElement('div');
                armiesDiv.id = 'transfer-destination-armies';
                armiesDiv.className = 'territory-armies';
                armiesDiv.textContent = '1 army (minimum)';
                destDiv.appendChild(armiesDiv);
            }
        }
        
        // Check and create preview source name
        if (!document.getElementById('preview-source-name')) {
            const previewDiv = modalContent.querySelector('.transfer-result');
            if (previewDiv) {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                const nameSpan = document.createElement('span');
                nameSpan.id = 'preview-source-name';
                nameSpan.textContent = 'Attacking Territory';
                
                const colonSpan = document.createTextNode(': ');
                
                const armiesSpan = document.createElement('span');
                armiesSpan.id = 'preview-source-armies';
                armiesSpan.textContent = '0 armies remaining';
                
                resultItem.appendChild(nameSpan);
                resultItem.appendChild(colonSpan);
                resultItem.appendChild(armiesSpan);
                previewDiv.appendChild(resultItem);
            }
        }
        
        // Check and create preview destination name
        if (!document.getElementById('preview-destination-name')) {
            const previewDiv = modalContent.querySelector('.transfer-result');
            if (previewDiv) {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                const nameSpan = document.createElement('span');
                nameSpan.id = 'preview-destination-name';
                nameSpan.textContent = 'Conquered Territory';
                
                const colonSpan = document.createTextNode(': ');
                
                const armiesSpan = document.createElement('span');
                armiesSpan.id = 'preview-destination-armies';
                armiesSpan.textContent = '1 army total';
                
                resultItem.appendChild(nameSpan);
                resultItem.appendChild(colonSpan);
                resultItem.appendChild(armiesSpan);
                previewDiv.appendChild(resultItem);
            }
        }
    }
    
    /**
     * Create the attack modal if it doesn't exist
     */
    createAttackModal() {
        // Attack modal already exists in the HTML, this is just a fallback
        // No need to implement as the HTML structure is already present
    }
    
    /**
     * Create the transfer modal if it doesn't exist
     */
    createTransferModal() {
        // Transfer modal already exists in the HTML, this is just a fallback
        // No need to implement as the HTML structure is already present
    }
    
    /**
     * Initialize event listeners for combat UI
     */
    initializeEventListeners() {
        // Make sure these elements exist before attaching listeners
        if (this.elements.executeButton) {
            this.elements.executeButton.addEventListener('click', () => this.executeAttack());
        }
        
        if (this.elements.continueButton) {
            this.elements.continueButton.addEventListener('click', () => this.continueAttack());
        }
        
        if (this.elements.endButton) {
            this.elements.endButton.addEventListener('click', () => this.endAttack());
        }
        
        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener('click', () => this.resetAttack());
        }
        
        // Conquest modal events
        if (this.conquestElements.slider) {
            this.conquestElements.slider.addEventListener('input', () => this.updateTransferPreview());
        }
        
        if (this.conquestElements.input) {
            this.conquestElements.input.addEventListener('input', () => this.updateTransferFromInput());
        }
    }
    
    /**
     * Start a new attack between two territories
     * @param {string} attackingTerritoryId - Attacking territory ID
     * @param {string} defendingTerritoryId - Defending territory ID
     * @returns {boolean} - Whether the attack was started
     */
    startAttack(attackingTerritoryId, defendingTerritoryId) {
        // Start combat in the combat system
        const result = this.combatSystem.startCombat(attackingTerritoryId, defendingTerritoryId);
        
        if (!result.success) {
            console.error('Failed to start attack:', result.error);
            return false;
        }
        
        // Store current combat info
        const combat = result.combat;
        this.currentAttackingTerritory = combat.attackingTerritory;
        this.currentDefendingTerritory = combat.defendingTerritory;
        
        // Update UI with combat info
        this.updateAttackModalInfo(combat);
        
        // Show attack modal
        if (this.elements.attackModal) {
            this.elements.attackModal.style.display = 'flex';
        }
        
        return true;
    }
    
    /**
     * Update attack modal with current combat info
     * @param {Object} combat - Current combat state
     */
    updateAttackModalInfo(combat) {
        // Use consistent gameState access - prefer the CombatSystem's gameState
        const gameState = this.combatSystem.gameState;
        const attackingTerritory = gameState.territories[combat.attackingTerritory];
        const defendingTerritory = gameState.territories[combat.defendingTerritory];
        
        if (!attackingTerritory || !defendingTerritory) {
            console.error('Territory not found:', {
                attacking: combat.attackingTerritory,
                defending: combat.defendingTerritory
            });
            return;
        }
        
        // Update territory names and armies with safe checks
        if (this.elements.attackerName) {
            this.elements.attackerName.textContent = attackingTerritory.name || combat.attackingTerritory;
        }
        
        if (this.elements.attackerArmies) {
            console.log(`DEBUG: Setting attacker armies display to: ${attackingTerritory.armies} armies`);
            this.elements.attackerArmies.textContent = `${attackingTerritory.armies} armies`;
        }
        
        if (this.elements.defenderName) {
            this.elements.defenderName.textContent = defendingTerritory.name || combat.defendingTerritory;
        }
        
        if (this.elements.defenderArmies) {
            console.log(`DEBUG: Setting defender armies display to: ${defendingTerritory.armies} armies`);
            this.elements.defenderArmies.textContent = `${defendingTerritory.armies} armies`;
        }

        // FORCE UPDATE: Override any other systems that might set mock values
        // Use setTimeout to ensure this runs after any competing updates
        setTimeout(() => {
            if (this.elements.attackerArmies) {
                this.elements.attackerArmies.textContent = `${attackingTerritory.armies} armies`;
                console.log(`DEBUG: Force-updated attacker armies to: ${attackingTerritory.armies} armies`);
            }
            if (this.elements.defenderArmies) {
                this.elements.defenderArmies.textContent = `${defendingTerritory.armies} armies`;
                console.log(`DEBUG: Force-updated defender armies to: ${defendingTerritory.armies} armies`);
            }
        }, 100); // Small delay to override competing systems
        
        // Show army input section
        if (this.elements.armyInputSection) {
            this.elements.armyInputSection.style.display = 'block';
        }
        
        // Set default values and max/min for army inputs
        // These represent "remaining armies after battle" - what the user wants left after the fight
        if (this.elements.attackerArmyInput) {
            this.elements.attackerArmyInput.min = 1; // Must leave at least 1 army (attacker cannot lose all)
            this.elements.attackerArmyInput.max = attackingTerritory.armies - 1; // Cannot exceed armies-1 (must leave 1 for territory)
            // Default: suggest losing 1 army (reasonable battle outcome)
            this.elements.attackerArmyInput.value = Math.max(1, attackingTerritory.armies - 1);
        }
        
        if (this.elements.defenderArmyInput) {
            this.elements.defenderArmyInput.min = 0; // Defender can lose all armies (conquest)
            this.elements.defenderArmyInput.max = defendingTerritory.armies; // Cannot have more than current
            // Default: suggest losing 1 army (reasonable battle outcome) 
            this.elements.defenderArmyInput.value = Math.max(0, defendingTerritory.armies - 1);
        }
        
        // Show execute button
        if (this.elements.executeButton) {
            this.elements.executeButton.style.display = 'block';
        }
        
        // Hide results section
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'none';
        }
    }
    
    /**
     * Execute an attack with the user-specified army values
     */
    executeAttack() {
        // Get army input values
        const attackerRemainingArmies = parseInt(this.elements.attackerArmyInput.value);
        const defenderRemainingArmies = parseInt(this.elements.defenderArmyInput.value);
        
        // Debug logging to identify the issue
        const combat = this.combatSystem.currentCombat;
        if (combat) {
            const attackingTerritory = this.combatSystem.gameState.territories[combat.attackingTerritoryId];
            const defendingTerritory = this.combatSystem.gameState.territories[combat.defendingTerritoryId];
            
            console.log('DEBUG: executeAttack values:', {
                attackingTerritory: attackingTerritory?.name,
                currentAttackerArmies: attackingTerritory?.armies,
                inputAttackerRemaining: attackerRemainingArmies,
                defendingTerritory: defendingTerritory?.name,
                currentDefenderArmies: defendingTerritory?.armies,
                inputDefenderRemaining: defenderRemainingArmies
            });
        }
        
        // Execute battle with direct army input
        const result = this.combatSystem.executeBattle(attackerRemainingArmies, defenderRemainingArmies);
        
        if (!result.success) {
            alert('Invalid army values: ' + result.error);
            console.error('Failed to execute battle:', result.error);
            return;
        }
        
        // Update UI with battle results
        this.showBattleResults(result.result);
    }
    
    /**
     * Show battle results in the UI
     * @param {Object} result - Battle result
     */
    showBattleResults(result) {
        // Hide army input section and execute button
        if (this.elements.armyInputSection) {
            this.elements.armyInputSection.style.display = 'none';
        }
        
        if (this.elements.executeButton) {
            this.elements.executeButton.style.display = 'none';
        }
        
        // Show results section
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'block';
        }
        
        // Display losses
        if (this.elements.attackerLossesDisplay) {
            this.elements.attackerLossesDisplay.textContent = `Lost ${result.attackerLosses} armies`;
        }
        
        if (this.elements.defenderLossesDisplay) {
            this.elements.defenderLossesDisplay.textContent = `Lost ${result.defenderLosses} armies`;
        }
        
        // Display battle result text
        let resultText = `Attacker lost ${result.attackerLosses} armies. Defender lost ${result.defenderLosses} armies.`;
        
        if (result.conquered) {
            resultText += '<br><strong>🏆 Territory conquered!</strong>';
        }
        
        this.gameUtils.safeUpdateElement(this.elements.battleResult, 'innerHTML', resultText);
        
        // Update territory armies
        const combat = this.combatSystem.currentCombat.getState();
        const attackingTerritory = this.combatSystem.gameState.territories[combat.attackingTerritory];
        const defendingTerritory = this.combatSystem.gameState.territories[combat.defendingTerritory];
        
        this.gameUtils.safeUpdateElement(this.elements.attackerArmies, 'textContent', `${attackingTerritory.armies} armies`);
        this.gameUtils.safeUpdateElement(this.elements.defenderArmies, 'textContent', `${defendingTerritory.armies} armies`);
        
        // Show continue button if territory not conquered and attacker can continue
        if (!result.conquered && attackingTerritory.armies > 1) {
            this.gameUtils.safeToggleDisplay(this.elements.continueButton, true);
        } else {
            this.gameUtils.safeToggleDisplay(this.elements.continueButton, false);
        }
        
        // Show reset button
        if (this.elements.resetButton) {
            this.elements.resetButton.style.display = 'block';
        }
        
        // Handle conquest
        if (result.conquered) {
            this.showConquestModal();
        }
    }
    
    /**
     * Display dice rolls in the UI
     * @param {HTMLElement} container - Container element
     * @param {Array} rolls - Array of dice values
     */
    displayDiceRolls(container, rolls) {
        if (!container) return;
        
        container.innerHTML = '';
        
        rolls.forEach(roll => {
            const diceEl = document.createElement('span');
            diceEl.className = 'dice-value';
            diceEl.textContent = roll;
            diceEl.style.margin = '0 5px';
            diceEl.style.padding = '3px 8px';
            diceEl.style.background = '#f0f0f0';
            diceEl.style.borderRadius = '3px';
            container.appendChild(diceEl);
        });
    }
    
    /**
     * Continue the attack with new army input
     */
    continueAttack() {
        // Hide results section and reset button
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'none';
        }
        
        if (this.elements.resetButton) {
            this.elements.resetButton.style.display = 'none';
        }
        
        // Show army input section and execute button
        if (this.elements.armyInputSection) {
            this.elements.armyInputSection.style.display = 'block';
        }
        
        if (this.elements.executeButton) {
            this.elements.executeButton.style.display = 'block';
        }
        
        // Update army input fields based on current armies
        const combat = this.combatSystem.currentCombat.getState();
        const attackingTerritory = this.combatSystem.gameState.territories[combat.attackingTerritory];
        const defendingTerritory = this.combatSystem.gameState.territories[combat.defendingTerritory];
        
        // Set default values and max/min for army inputs
        if (this.elements.attackerArmyInput) {
            this.elements.attackerArmyInput.min = 1; // Must leave at least 1 army
            this.elements.attackerArmyInput.max = attackingTerritory.armies - 1;
            this.elements.attackerArmyInput.value = attackingTerritory.armies - 1; // Default to 1 army loss
        }
        
        if (this.elements.defenderArmyInput) {
            this.elements.defenderArmyInput.min = 0; // Defender can lose all armies
            this.elements.defenderArmyInput.max = defendingTerritory.armies;
            this.elements.defenderArmyInput.value = Math.max(0, defendingTerritory.armies - 1); // Default to 1 army loss
        }
    }
    
    /**
     * End the current attack
     */
    endAttack() {
        // Close attack modal
        if (this.elements.attackModal) {
            this.elements.attackModal.style.display = 'none';
        }
        
        // End combat in the combat system
        this.combatSystem.endCombat();
        
        // Reset current territories
        this.currentAttackingTerritory = null;
        this.currentDefendingTerritory = null;
    }
    
    /**
     * Reset attack selection to start a new attack
     */
    resetAttack() {
        // Hide results section
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'none';
        }
        
        // End combat and restart modal
        this.combatSystem.endCombat();
        
        // Reset current territories
        this.currentAttackingTerritory = null;
        this.currentDefendingTerritory = null;
        
        // Close modal
        if (this.elements.attackModal) {
            this.elements.attackModal.style.display = 'none';
        }
    }
    
    /**
     * Show conquest modal for army transfer
     */
    showConquestModal() {
        // Get combat info
        const combat = this.combatSystem.currentCombat;
        
        if (!combat || !combat.isConquered()) return;
        
        const attackingTerritory = this.combatSystem.gameState.territories[combat.getAttackingTerritory()];
        const defendingTerritory = this.combatSystem.gameState.territories[combat.getDefendingTerritory()];
        
        // Set territory names and armies
        this.gameUtils.safeUpdateElement(this.conquestElements.sourceName, 'textContent', attackingTerritory.name || combat.getAttackingTerritory());
        this.gameUtils.safeUpdateElement(this.conquestElements.sourceArmies, 'textContent', `${attackingTerritory.armies} armies`);
        this.gameUtils.safeUpdateElement(this.conquestElements.destName, 'textContent', defendingTerritory.name || combat.getDefendingTerritory());
        this.gameUtils.safeUpdateElement(this.conquestElements.destArmies, 'textContent', `${defendingTerritory.armies} army (minimum)`);
        
        // Set slider range
        const maxArmies = attackingTerritory.armies - 1;
        
        if (this.conquestElements.slider) {
            this.conquestElements.slider.min = 1;
            this.conquestElements.slider.max = maxArmies;
            this.conquestElements.slider.value = 1;
        }
        
        if (this.conquestElements.input) {
            this.conquestElements.input.min = 1;
            this.conquestElements.input.max = maxArmies;
            this.conquestElements.input.value = 1;
        }
        
        this.gameUtils.safeUpdateElement(this.conquestElements.sliderMaxLabel, 'textContent', maxArmies.toString());
        this.gameUtils.safeUpdateElement(this.conquestElements.transferRange, 'textContent', `You can transfer 1-${maxArmies} armies`);
        
        // Set up window.transferState for compatibility with game.html transfer functions
        if (typeof window !== 'undefined' && window.transferState) {
            window.transferState.sourceTerritory = combat.getAttackingTerritory();
            window.transferState.destinationTerritory = combat.getDefendingTerritory();
            window.transferState.maxTransfer = maxArmies;
            window.transferState.minTransfer = 1;
            window.transferState.currentTransfer = 1;
        }
        
        // Update preview
        this.updateTransferPreview();
        
        // Show conquest modal
        if (this.conquestElements.modal) {
            this.conquestElements.modal.style.display = 'flex';
        }
    }
    
    /**
     * Update transfer preview based on slider value
     */
    updateTransferPreview() {
        if (!this.conquestElements.slider) return;
        
        const transferAmount = parseInt(this.conquestElements.slider.value);
        this.updateTransferPreviewWithValue(transferAmount);
        
        // Sync input with slider
        if (this.conquestElements.input) {
            this.conquestElements.input.value = transferAmount;
        }
    }
    
    /**
     * Update transfer preview based on input value
     */
    updateTransferFromInput() {
        if (!this.conquestElements.input) return;
        
        const transferAmount = parseInt(this.conquestElements.input.value);
        const maxArmies = parseInt(this.conquestElements.input.max);
        const validAmount = Math.max(1, Math.min(maxArmies, transferAmount));
        
        this.updateTransferPreviewWithValue(validAmount);
        
        // Sync slider with input if value changed
        if (transferAmount !== validAmount) {
            this.conquestElements.input.value = validAmount;
        }
        
        if (this.conquestElements.slider) {
            this.conquestElements.slider.value = validAmount;
        }
    }
    
    /**
     * Update transfer preview with a specific value
     * @param {number} transferAmount - Number of armies to transfer
     */
    updateTransferPreviewWithValue(transferAmount) {
        const combat = this.combatSystem.currentCombat;
        
        if (!combat || !combat.isConquered()) return;
        
        const attackingTerritory = this.combatSystem.gameState.territories[combat.getAttackingTerritory()];
        const defendingTerritory = this.combatSystem.gameState.territories[combat.getDefendingTerritory()];
        
        // Update window.transferState for compatibility
        if (typeof window !== 'undefined' && window.transferState) {
            window.transferState.currentTransfer = transferAmount;
        }
        
        // Calculate remaining armies
        const sourceRemaining = attackingTerritory.armies - transferAmount;
        const destTotal = defendingTerritory.armies + transferAmount;
        
        // Update preview
        this.gameUtils.safeUpdateElement(this.conquestElements.previewSource, 'textContent', attackingTerritory.name || combat.getAttackingTerritory());
        this.gameUtils.safeUpdateElement(this.conquestElements.previewSourceArmies, 'textContent', `${sourceRemaining} armies remaining`);
        this.gameUtils.safeUpdateElement(this.conquestElements.previewDest, 'textContent', defendingTerritory.name || combat.getDefendingTerritory());
        this.gameUtils.safeUpdateElement(this.conquestElements.previewDestArmies, 'textContent', `${destTotal} armies total`);
    }
    
    /**
     * Confirm army transfer after conquest
     */
    confirmTransfer() {
        const transferAmount = parseInt(this.conquestElements.slider?.value || this.conquestElements.input?.value || 1);
        
        // Complete conquest in combat system
        const result = this.combatSystem.completeConquest(transferAmount);
        
        if (!result.success) {
            console.error('Failed to complete conquest:', result.error);
            return;
        }
        
        // Close conquest modal
        if (this.conquestElements.modal) {
            this.conquestElements.modal.style.display = 'none';
        }
        
        // Close attack modal
        this.endAttack();
    }
    
    /**
     * Use minimum army transfer (1 army)
     */
    cancelTransfer() {
        // Complete conquest with minimum armies
        const result = this.combatSystem.completeConquest(1);
        
        if (!result.success) {
            console.error('Failed to complete conquest:', result.error);
            return;
        }
        
        // Close conquest modal
        if (this.conquestElements.modal) {
            this.conquestElements.modal.style.display = 'none';
        }
        
        // Close attack modal
        this.endAttack();
    }
    
    /**
     * Handle territory click for attack phase
     * @param {string} territoryId - Clicked territory ID
     * @returns {object} - Result with success/error information
     */
    handleTerritoryClick(territoryId) {
        try {
            // Check if combatSystem is properly initialized
            if (!this.combatSystem) {
                return { success: false, error: 'Combat system not initialized' };
            }
            
            // Check if validateAttacker method exists
            if (typeof this.combatSystem.validateAttacker !== 'function') {
                console.error('validateAttacker method not found on combatSystem');
                // Fall back to using validateAttack if available
                if (typeof this.combatSystem.validateAttack === 'function') {
                    return this.handleTerritoryClickFallback(territoryId);
                }
                return { success: false, error: 'Combat validation not available' };
            }
            
            // If no attacking territory selected yet, check if this is a valid attacker
            if (!this.currentAttackingTerritory) {
                const validation = this.combatSystem.validateAttacker(territoryId);
                
                if (validation.valid) {
                    this.currentAttackingTerritory = territoryId;
                    // Highlight attacking territory and potential targets
                    this.highlightAttackingTerritory(territoryId);
                    return { success: true, action: 'attacker_selected', territory: territoryId };
                } else {
                    return { success: false, error: validation.reason || 'Invalid attacker' };
                }
            }
            // If attacking territory already selected, check if this is a valid target
            else if (this.currentAttackingTerritory !== territoryId) {
                const validation = this.combatSystem.validateAttack(this.currentAttackingTerritory, territoryId);
                
                if (validation.valid) {
                    // Start attack between territories
                    const attackResult = this.startAttack(this.currentAttackingTerritory, territoryId);
                    return { success: attackResult, action: 'attack_started' };
                } else {
                    // Check if new territory is a valid attacker
                    const newAttackerValidation = this.combatSystem.validateAttacker(territoryId);
                    
                    if (newAttackerValidation.valid) {
                        // Switch to new attacking territory
                        this.currentAttackingTerritory = territoryId;
                        this.highlightAttackingTerritory(territoryId);
                        return { success: true, action: 'attacker_changed', territory: territoryId };
                    } else {
                        return { success: false, error: validation.reason || 'Invalid target' };
                    }
                }
            }
        } catch (err) {
            console.error('Error in handleTerritoryClick:', err);
            return { success: false, error: 'An error occurred during territory selection' };
        }
        
        return { success: false, error: 'No valid action for this territory' };
    }
    
    /**
     * Fallback handler for territory clicks when validateAttacker is not available
     * Uses validateAttack as an alternative way to determine valid attackers
     * @param {string} territoryId - Clicked territory ID
     * @returns {object} - Result with success/error information
     */
    handleTerritoryClickFallback(territoryId) {
        try {
            const territory = this.combatSystem.gameState.territories[territoryId];
            
            // Basic validation that we can do without validateAttacker
            if (!territory) {
                return { success: false, error: 'Invalid territory' };
            }
            
            const currentPlayer = this.combatSystem.gameState.getCurrentPlayer();
            
            // If no attacking territory selected yet
            if (!this.currentAttackingTerritory) {
                // Check if territory belongs to current player
                if (territory.owner !== currentPlayer) {
                    return { success: false, error: 'Can only attack from your own territories' };
                }
                
                // Check if territory has enough armies to attack
                if (territory.armies < 2) {
                    return { success: false, error: 'Must have at least 2 armies to attack' };
                }
                
                // Check if territory has any valid neighbors to attack
                const hasValidTargets = territory.neighbors && territory.neighbors.some(neighborId => {
                    const neighbor = this.combatSystem.gameState.territories[neighborId];
                    return neighbor && neighbor.owner !== currentPlayer;
                });
                
                if (!hasValidTargets) {
                    return { success: false, error: 'No valid attack targets from this territory' };
                }
                
                // Valid attacker
                this.currentAttackingTerritory = territoryId;
                this.highlightAttackingTerritory(territoryId);
                return { success: true, action: 'attacker_selected', territory: territoryId };
            }
            // If attacking territory already selected
            else if (this.currentAttackingTerritory !== territoryId) {
                const validation = this.combatSystem.validateAttack(this.currentAttackingTerritory, territoryId);
                
                if (validation.valid) {
                    // Start attack between territories
                    const attackResult = this.startAttack(this.currentAttackingTerritory, territoryId);
                    return { success: attackResult, action: 'attack_started' };
                } else {
                    // Check if new territory could be a valid attacker
                    if (territory.owner === currentPlayer && territory.armies >= 2) {
                        // Check if has valid targets
                        const hasValidTargets = territory.neighbors && territory.neighbors.some(neighborId => {
                            const neighbor = this.combatSystem.gameState.territories[neighborId];
                            return neighbor && neighbor.owner !== currentPlayer;
                        });
                        
                        if (hasValidTargets) {
                            // Switch to new attacking territory
                            this.currentAttackingTerritory = territoryId;
                            this.highlightAttackingTerritory(territoryId);
                            return { success: true, action: 'attacker_changed', territory: territoryId };
                        }
                    }
                    
                    return { success: false, error: validation.reason || 'Invalid target' };
                }
            }
            
            return { success: false, error: 'No valid action for this territory' };
        } catch (err) {
            console.error('Error in handleTerritoryClickFallback:', err);
            return { success: false, error: 'An error occurred during territory selection' };
        }
    }
    
    /**
     * Highlight attacking territory and its potential targets
     * @param {string} territoryId - Attacking territory ID
     */
    highlightAttackingTerritory(territoryId) {
        // Implementation would depend on the map visualization system
        console.log(`Highlighting attacking territory: ${territoryId}`);
        
        // Find and highlight potential targets
        const targets = this.combatSystem.getPossibleAttackTargets(territoryId);
        console.log(`Potential targets: ${targets.join(', ')}`);
    }
    
    /**
     * Clear all attack highlights
     */
    clearAttackHighlights() {
        // Implementation would depend on the map visualization system
        console.log('Clearing attack highlights');
    }
}