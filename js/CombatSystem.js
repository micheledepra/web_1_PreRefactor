/**
 * RISK COMBAT SYSTEM ARCHITECTURE
 * 
 * CLEAN, UNIFIED COMBAT SYSTEM FOR RISK GAME
 * Modified to use direct army input instead of dice rolling
 */

/**
 * Core Combat System - Single Source of Truth
 * Handles all attack logic, direct army input, and combat resolution
 */
class CombatSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.currentCombat = null;
        this.directCombat = new DirectCombat(); // Use direct army input system
        
        // Core Rules Constants
        this.RULES = {
            MIN_ATTACKING_ARMIES: 2, // Need 2+ armies to attack (1 must stay)
            MIN_ARMIES_TO_LEAVE: 1   // Must leave 1 army in attacking territory
        };
    }

    /**
     * Validate if a territory can be used as an attacker
     * @param {string} territoryId - Territory ID to validate
     * @returns {object} - {valid: boolean, reason?: string}
     */
    validateAttacker(territoryId) {
        const territory = this.gameState.territories[territoryId];
        
        // Territory existence validation
        if (!territory) {
            return { valid: false, reason: 'Invalid territory' };
        }
        
        // Ownership validation
        const currentPlayer = this.gameState.getCurrentPlayer();
        if (territory.owner !== currentPlayer) {
            return { valid: false, reason: 'Can only attack from your own territories' };
        }
        
        // Army count validation
        if (territory.armies < this.RULES.MIN_ATTACKING_ARMIES) {
            return { valid: false, reason: 'Must have at least 2 armies to attack' };
        }
        
        // Check if there are any potential targets
        const hasValidTargets = this.getPossibleAttackTargets(territoryId).length > 0;
        if (!hasValidTargets) {
            return { valid: false, reason: 'No valid attack targets from this territory' };
        }
        
        return { valid: true };
    }
    
    /**
     * Validate if an attack is legal
     * @param {string} attackingTerritoryId - Source territory
     * @param {string} defendingTerritoryId - Target territory
     * @returns {object} - {valid: boolean, reason?: string}
     */
    validateAttack(attackingTerritoryId, defendingTerritoryId) {
        const attacker = this.gameState.territories[attackingTerritoryId];
        const defender = this.gameState.territories[defendingTerritoryId];
        
        // Territory existence validation
        if (!attacker || !defender) {
            return { valid: false, reason: 'Invalid territory' };
        }
        
        // Ownership validation
        const currentPlayer = this.gameState.getCurrentPlayer();
        if (attacker.owner !== currentPlayer) {
            return { valid: false, reason: 'Can only attack from your own territories' };
        }
        
        if (attacker.owner === defender.owner) {
            return { valid: false, reason: 'Cannot attack your own territory' };
        }
        
        // Army count validation
        if (attacker.armies < this.RULES.MIN_ATTACKING_ARMIES) {
            return { valid: false, reason: 'Must have at least 2 armies to attack' };
        }
        
        // Adjacency validation
        if (!attacker.neighbors || !attacker.neighbors.includes(defendingTerritoryId)) {
            return { valid: false, reason: 'Can only attack adjacent territories' };
        }
        
        return { valid: true };
    }

    /**
     * Calculate maximum dice for attacker/defender
     * @param {string} territoryId - Territory ID
     * @param {string} role - 'attacker' or 'defender'
     * @returns {number} - Maximum dice count
     */
    getMaxDice(territoryId, role) {
        const territory = this.gameState.territories[territoryId];
        if (!territory) return 0;
        
        if (role === 'attacker') {
            const availableArmies = territory.armies - this.RULES.MIN_ARMIES_TO_LEAVE;
            return Math.min(this.RULES.MAX_ATTACKER_DICE, Math.max(0, availableArmies));
        } else {
            return Math.min(this.RULES.MAX_DEFENDER_DICE, territory.armies);
        }
    }
    
    /**
     * Get all possible territories that can be attacked from the given territory
     * @param {string} territoryId - Source territory ID
     * @returns {Array} - Array of territory IDs that can be attacked
     */
    getPossibleAttackTargets(territoryId) {
        const territory = this.gameState.territories[territoryId];
        
        if (!territory || territory.armies <= 1 || !territory.neighbors) {
            return [];
        }
        
        // Filter neighbors to only include those with different owners
        return territory.neighbors.filter(neighbor => {
            const neighborTerritory = this.gameState.territories[neighbor];
            return neighborTerritory && neighborTerritory.owner !== territory.owner;
        });
    }



    /**
     * Start a new combat instance
     * @param {string} attackingTerritoryId - Attacking territory
     * @param {string} defendingTerritoryId - Defending territory
     * @returns {object} - Combat instance or error
     */
    initiateCombat(attackingTerritoryId, defendingTerritoryId) {
        // Validate attack
        const validation = this.validateAttack(attackingTerritoryId, defendingTerritoryId);
        if (!validation.valid) {
            return { success: false, error: validation.reason };
        }

        // Create combat instance
        this.currentCombat = new CombatInstance(
            this.gameState,
            attackingTerritoryId,
            defendingTerritoryId,
            this.RULES,
            this.directCombat
        );

        return { 
            success: true, 
            combat: this.currentCombat.getState()
        };
    }

    /**
     * Start combat between two territories (alias for initiateCombat for API consistency)
     * @param {string} attackingTerritoryId - Attacking territory
     * @param {string} defendingTerritoryId - Defending territory
     * @returns {object} - Combat instance or error
     */
    startCombat(attackingTerritoryId, defendingTerritoryId) {
        return this.initiateCombat(attackingTerritoryId, defendingTerritoryId);
    }
    
    /**
     * Execute a battle round with direct army input
     * @param {number} attackerRemainingArmies - User-specified remaining attacker armies
     * @param {number} defenderRemainingArmies - User-specified remaining defender armies
     * @returns {object} - Battle result
     */
    executeBattle(attackerRemainingArmies, defenderRemainingArmies) {
        if (!this.currentCombat) {
            return { success: false, error: 'No active combat' };
        }

        return this.currentCombat.executeBattle(attackerRemainingArmies, defenderRemainingArmies);
    }

    /**
     * Complete conquest and army transfer
     * @param {number} armiesToMove - Number of armies to move to conquered territory
     * @returns {object} - Transfer result
     */
    completeConquest(armiesToMove) {
        if (!this.currentCombat || !this.currentCombat.isConquered()) {
            return { success: false, error: 'No conquest to complete' };
        }

        return this.currentCombat.completeConquest(armiesToMove);
    }

    /**
     * End current combat
     */
    endCombat() {
        this.currentCombat = null;
    }

    /**
     * Get current combat state
     * @returns {object|null} - Combat state or null
     */
    getCurrentCombat() {
        return this.currentCombat ? this.currentCombat.getState() : null;
    }
}

/**
 * Individual Combat Instance
 * Represents a single attack between two territories
 */
class CombatInstance {
    constructor(gameState, attackingTerritoryId, defendingTerritoryId, rules, directCombat) {
        this.gameState = gameState;
        this.attackingTerritoryId = attackingTerritoryId;
        this.defendingTerritoryId = defendingTerritoryId;
        this.rules = rules;
        this.directCombat = directCombat;
        
        // Store initial state
        const attacker = gameState.territories[attackingTerritoryId];
        const defender = gameState.territories[defendingTerritoryId];
        
        this.initialState = {
            attackerArmies: attacker.armies,
            defenderArmies: defender.armies,
            attackerOwner: attacker.owner,
            defenderOwner: defender.owner
        };
        
        this.battleHistory = [];
        this.conquered = false;
    }

    /**
     * Execute a single battle round using direct army input
     * @param {number} attackerRemainingArmies - User-specified remaining attacker armies
     * @param {number} defenderRemainingArmies - User-specified remaining defender armies
     * @returns {object} - Battle result
     */
    executeBattle(attackerRemainingArmies, defenderRemainingArmies) {
        const attacker = this.gameState.territories[this.attackingTerritoryId];
        const defender = this.gameState.territories[this.defendingTerritoryId];
        
        // Get initial army counts
        const initialAttackerArmies = attacker.armies;
        const initialDefenderArmies = defender.armies;

        // Use DirectCombat to determine battle outcome
        const result = this.directCombat.determineBattleOutcome(
            initialAttackerArmies,
            initialDefenderArmies,
            attackerRemainingArmies,
            defenderRemainingArmies
        );
        
        if (!result.success) {
            return result; // Return error message
        }

        // Apply new army counts
        attacker.armies = result.remainingAttackerArmies;
        defender.armies = result.remainingDefenderArmies;

        // Check for conquest
        if (defender.armies === 0) {
            this.conquered = true;
            // Change ownership but leave armies at 0 for now (will be set in conquest completion)
            defender.owner = attacker.owner;
        }

        // Record battle
        const battleResult = {
            round: this.battleHistory.length + 1,
            attackerInputValue: attackerRemainingArmies,
            defenderInputValue: defenderRemainingArmies,
            attackerInitialArmies: initialAttackerArmies,
            defenderInitialArmies: initialDefenderArmies,
            attackerLosses: result.attackerLosses,
            defenderLosses: result.defenderLosses,
            attackerArmiesRemaining: attacker.armies,
            defenderArmiesRemaining: defender.armies,
            conquered: this.conquered
        };

        this.battleHistory.push(battleResult);

        return {
            success: true,
            result: battleResult,
            canContinue: !this.conquered && attacker.armies > 1,
            conquered: this.conquered
        };
    }





    /**
     * Complete conquest by moving armies
     * @param {number} armiesToMove - Armies to move to conquered territory
     * @returns {object} - Result
     */
    completeConquest(armiesToMove) {
        if (!this.conquered) {
            return { success: false, error: 'Territory not conquered' };
        }

        const attacker = this.gameState.territories[this.attackingTerritoryId];
        const defender = this.gameState.territories[this.defendingTerritoryId];

        // Validate army movement
        const maxMovable = attacker.armies - 1; // Must leave 1 army
        const minMovable = 1; // Must move at least 1 army

        if (armiesToMove < minMovable || armiesToMove > maxMovable) {
            return { 
                success: false, 
                error: `Must move between ${minMovable} and ${maxMovable} armies` 
            };
        }

        // Execute transfer
        attacker.armies -= armiesToMove;
        defender.armies = armiesToMove;

        return {
            success: true,
            armiesMoved: armiesToMove,
            attackerArmiesRemaining: attacker.armies,
            defenderArmiesNew: defender.armies,
            conqueredTerritory: this.defendingTerritoryId,
            previousOwner: this.initialState.defenderOwner
        };
    }

    /**
     * Get attacking territory ID
     * @returns {string}
     */
    getAttackingTerritory() {
        return this.attackingTerritoryId;
    }

    /**
     * Get defending territory ID
     * @returns {string}
     */
    getDefendingTerritory() {
        return this.defendingTerritoryId;
    }

    /**
     * Check if territory was conquered
     * @returns {boolean}
     */
    isConquered() {
        return this.conquered;
    }

    /**
     * Get current combat state
     * @returns {object}
     */
    getState() {
        const attacker = this.gameState.territories[this.attackingTerritoryId];
        const defender = this.gameState.territories[this.defendingTerritoryId];

        return {
            attackingTerritory: this.attackingTerritoryId,
            defendingTerritory: this.defendingTerritoryId,
            attackerArmies: attacker.armies,
            defenderArmies: defender.armies,
            initialState: this.initialState,
            battleHistory: this.battleHistory,
            conquered: this.conquered,
            canContinue: !this.conquered && attacker.armies > 1,
            maxAttackerDice: Math.min(3, attacker.armies - 1),
            maxDefenderDice: Math.min(2, defender.armies)
        };
    }
}

// CombatUI has been moved to its own file (CombatUI.js)
// This reduces code duplication and follows better separation of concerns

// Export classes for use in the game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CombatSystem, CombatInstance };
}