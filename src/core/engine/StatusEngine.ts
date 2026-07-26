import type { Character } from "../types/Character";
import type { Status } from "../types/Status";
import { STATUS_DEFINITIONS } from "../../data/statuses/statusDefinitions";

/**
 * StatusEngine ne touche JAMAIS aux PV directement (comme DamageEngine,
 * il reste "pur" : on lui donne un personnage, il renvoie/modifie l'état des
 * statuts, et laisse l'appelant (BattleEngine) décider quoi faire des
 * dégâts de DOT retournés par `tick`). Ça garde le même découplage que le
 * reste du moteur.
 */
export class StatusEngine {
    /**
     * Applique un statut à un personnage. `duration` est TOUJOURS fourni
     * par l'appelant (jamais déduit d'une constante ici) car une même sorte
     * de statut peut durer différemment selon qui l'applique. `null` =
     * durée illimitée.
     * Si le statut est déjà présent, il est remplacé (pas de cumul de durée
     * pour l'instant — à revoir si un cas de stacking apparaît).
     */
    static apply(character: Character, statusId: string, duration: number | null, sourceAtk?: number): void {
        StatusEngine.remove(character, statusId);
        const status: Status = { id: statusId, remaining: duration, sourceAtk };
        character.statuses.push(status);
    }

    static remove(character: Character, statusId: string): boolean {
        const before = character.statuses.length;
        character.statuses = character.statuses.filter((s) => s.id !== statusId);
        return character.statuses.length !== before;
    }

    static has(character: Character, statusId: string): boolean {
        return character.statuses.some((s) => s.id === statusId);
    }

    /**
     * Purifie un personnage : retire tous les statuts marqués `purifiable`
     * dans le registre (les négatifs, par construction actuelle). Renvoie
     * `true` si au moins un statut a été retiré — utile pour des mécaniques
     * comme "Purification soignante" de Mélissa qui donne un bonus si les
     * DEUX cibles avaient bien un effet à retirer.
     */
    static purify(character: Character): boolean {
        const before = character.statuses.length;
        character.statuses = character.statuses.filter((s) => !STATUS_DEFINITIONS[s.id]?.purifiable);
        return character.statuses.length !== before;
    }

    /**
     * Fait avancer les statuts à durée d'un personnage de `amount` (le
     * temps de jeu écoulé pour ce tick). Calcule au passage les dégâts de
     * DOT (brûlure/poison/venin) et les retourne — c'est à l'appelant de
     * les appliquer aux PV et de gérer une éventuelle mort.
     * Les statuts à durée illimitée (`remaining === null`) ne sont jamais
     * décrémentés ici.
     */
    static tick(character: Character, amount: number): number {
        let totalDotDamage = 0;
        const stillActive: Status[] = [];

        for (const status of character.statuses) {
            const def = STATUS_DEFINITIONS[status.id];

            if (def?.dot) {
                totalDotDamage += def.dot.computeDamage(
                    { maxHp: character.maxHp, sourceAtk: status.sourceAtk },
                    amount
                );
            }

            if (status.remaining === null) {
                stillActive.push(status);
                continue;
            }

            const remaining = status.remaining - amount;
            if (remaining > 0) {
                stillActive.push({ ...status, remaining });
            }
            // sinon : durée écoulée, on ne le remet pas dans la liste (expiré).
        }

        character.statuses = stillActive;
        return Math.round(totalDotDamage);
    }

    /**
     * À appeler par le moteur de dégâts quand un personnage vient de subir
     * des DÉGÂTS DIRECTS (une attaque, pas un DOT). Retire les statuts qui
     * se terminent sur ce type d'événement (furtivité, marque).
     * Ne PAS appeler ceci pour des dégâts de brûlure/poison/venin : la
     * furtivité doit survivre à un DOT, seuls des dégâts directs la retirent.
     */
    static onDirectDamageTaken(character: Character): void {
        character.statuses = character.statuses.filter((s) => {
            const def = STATUS_DEFINITIONS[s.id];
            if (def?.removeOnDirectDamage) return false;
            if (def?.removeAfterDamageTaken) return false;
            return true;
        });
    }
}