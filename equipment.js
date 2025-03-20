import chalk from 'chalk';

/**
 * Class representing an equipment item
 */
export class Equipment {
    /**
     * Create an equipment item
     * @param {string} name - The name of the equipment
     * @param {Object} stats - Stats to modify (can include speed, hp, damage)
     */
    constructor(name, stats) {
        this.name = name;
        this.stats = stats;
    }

    /**
     * Get the stats of this equipment
     * @returns {Object} The stats of this equipment
     */
    getStats() {
        return this.stats;
    }
}

/**
 * Create a new equipment item
 * @param {string} name - The name of the equipment
 * @param {Object} stats - Stats to modify (can include speed, hp, damage)
 * @returns {Equipment} The created equipment
 */
export function createEquipment(name, stats) {
    return new Equipment(name, stats);
}

/**
 * List of available equipment
 */
export const equipmentList = [
    createEquipment("Épée légendaire", { damage: 5 }),
    createEquipment("Bouclier du dragon", { speed: -2 }),
    createEquipment("Bottes de célérité", { speed: 5 }),
    createEquipment("Amulette de puissance", { damage: 3, speed: 2 }),
    createEquipment("Armure lourde", { hp: 70, speed: -2 }),
    createEquipment("Bâton magique", { damage: 7, hp: 20 }),
];

/**
 * Get an equipment by name
 * @param {string} name - The name of the equipment to find
 * @returns {Equipment|null} The equipment or null if not found
 */
export function getEquipment(name) {
    return equipmentList.find(equip => equip.name === name) || null;
} 