/**
 * DirectCombat - Direct army input system to replace dice rolling mechanics
 * Provides methods for validating user inputs and determining battle outcomes
 */
class DirectCombat {
    constructor() {
        // Constants for validation
        this.MIN_ARMIES_TO_ATTACK = 2; // Attacker must have at least 2 armies (1 stays behind)
        this.MIN_ARMIES_TO_DEFEND = 1; // Defender must have at least 1 army
    }

    /**
     * Validates if the attacker's input is valid
     * @param {number} currentArmies - Current army count in attacking territory
     * @param {number} remainingArmies - Proposed remaining armies after battle
     * @returns {object} - {valid: boolean, message: string}
     */
    validateAttackerInput(currentArmies, remainingArmies) {
        // Attacker must have at least 2 armies to attack
        if (currentArmies < this.MIN_ARMIES_TO_ATTACK) {
            return {
                valid: false,
                message: "Attacker must have at least 2 armies to attack"
            };
        }
        
        // Must leave at least 1 army in territory
        if (remainingArmies < 1) {
            return {
                valid: false,
                message: "Must leave at least 1 army in attacking territory"
            };
        }
        
        // Cannot gain armies
        if (remainingArmies > currentArmies) {
            return {
                valid: false,
                message: "Cannot have more armies after battle than before"
            };
        }
        
        // Cannot lose all armies
        if (remainingArmies === 0) {
            return {
                valid: false,
                message: "Must have at least 1 army remaining"
            };
        }
        
        return {
            valid: true,
            message: "Valid attacker input"
        };
    }

    /**
     * Validates if the defender's input is valid
     * @param {number} currentArmies - Current army count in defending territory
     * @param {number} remainingArmies - Proposed remaining armies after battle
     * @returns {object} - {valid: boolean, message: string}
     */
    validateDefenderInput(currentArmies, remainingArmies) {
        // Cannot gain armies
        if (remainingArmies > currentArmies) {
            return {
                valid: false,
                message: "Cannot have more armies after battle than before"
            };
        }
        
        // Cannot have negative armies
        if (remainingArmies < 0) {
            return {
                valid: false,
                message: "Cannot have negative armies"
            };
        }
        
        return {
            valid: true,
            message: "Valid defender input"
        };
    }

    /**
     * Determine the outcome of a battle based on user inputs
     * @param {number} attackerArmies - Starting attacker army count
     * @param {number} defenderArmies - Starting defender army count
     * @param {number} attackerRemaining - User-specified remaining attacker armies
     * @param {number} defenderRemaining - User-specified remaining defender armies
     * @returns {object} - Battle results
     */
    /**
     * Combined validation for both attacker and defender inputs
     * @param {number} attackerArmies - Current attacker army count
     * @param {number} defenderArmies - Current defender army count
     * @param {number} attackerRemaining - Proposed remaining attacker armies
     * @param {number} defenderRemaining - Proposed remaining defender armies
     * @returns {object} - {valid: boolean, error: string}
     */
    validateInputs(attackerArmies, defenderArmies, attackerRemaining, defenderRemaining) {
        // Validate attacker input
        const attackerValidation = this.validateAttackerInput(attackerArmies, attackerRemaining);
        if (!attackerValidation.valid) {
            return {
                valid: false,
                error: attackerValidation.message
            };
        }
        
        // Validate defender input
        const defenderValidation = this.validateDefenderInput(defenderArmies, defenderRemaining);
        if (!defenderValidation.valid) {
            return {
                valid: false,
                error: defenderValidation.message
            };
        }
        
        return {
            valid: true
        };
    }

    determineBattleOutcome(attackerArmies, defenderArmies, attackerRemaining, defenderRemaining) {
        // Validate inputs first
        const attackerValidation = this.validateAttackerInput(attackerArmies, attackerRemaining);
        if (!attackerValidation.valid) {
            return {
                success: false,
                error: attackerValidation.message
            };
        }
        
        const defenderValidation = this.validateDefenderInput(defenderArmies, defenderRemaining);
        if (!defenderValidation.valid) {
            return {
                success: false,
                error: defenderValidation.message
            };
        }
        
        // Calculate losses
        const attackerLosses = attackerArmies - attackerRemaining;
        const defenderLosses = defenderArmies - defenderRemaining;
        
        // Determine if territory was conquered
        const territoryConquered = defenderRemaining <= 0;
        
        // Check if battle is complete
        const battleComplete = territoryConquered || attackerRemaining <= 1;
        
        return {
            success: true,
            attackerArmies: attackerArmies,
            defenderArmies: defenderArmies,
            attackerLosses: attackerLosses,
            defenderLosses: defenderLosses,
            remainingAttackerArmies: attackerRemaining,
            remainingDefenderArmies: defenderRemaining,
            territoryConquered: territoryConquered,
            battleComplete: battleComplete
        };
    }
}

// Create global instance
window.directCombat = new DirectCombat();