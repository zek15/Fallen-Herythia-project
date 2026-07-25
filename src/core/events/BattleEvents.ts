import type { Character } from "../types/Character";
import type { Status } from "../types/Status";

// On utilise des vraies valeurs string (et pas un enum numérique) pour que
// ce soit lisible dans les logs/erreurs, et compatible avec EventBus<T>.
export enum BattleEvent {
    TURN_START = "TURN_START",
    TURN_END = "TURN_END",
    DAMAGE = "DAMAGE",
    HEAL = "HEAL",
    DEATH = "DEATH",
    STATUS_GAIN = "STATUS_GAIN",
    STATUS_REMOVE = "STATUS_REMOVE",
}

/**
 * Décrit, pour CHAQUE événement, la forme exacte des données transmises.
 * C'est ce qui permet à EventBus de savoir que "DAMAGE" transporte
 * { source, target, amount } et pas autre chose — TypeScript vérifie
 * ça pour nous, à la compilation, sans rien écrire de plus.
 */
export interface BattleEventPayloads {
    [BattleEvent.TURN_START]: { unit: Character };
    [BattleEvent.TURN_END]: { unit: Character };
    [BattleEvent.DAMAGE]: { source: Character; target: Character; amount: number };
    [BattleEvent.HEAL]: { source: Character; target: Character; amount: number };
    [BattleEvent.DEATH]: { unit: Character };
    [BattleEvent.STATUS_GAIN]: { unit: Character; status: Status };
    [BattleEvent.STATUS_REMOVE]: { unit: Character; status: Status };
}