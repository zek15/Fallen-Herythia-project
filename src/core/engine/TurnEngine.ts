import type { Character } from "../types/Character";

/**
 * tuCounter représente désormais le temps RESTANT avant le prochain tour
 * de ce personnage : il descend vers 0, pile ce qu'on affichera à l'écran.
 */
export interface TurnState {
    character: Character;
    tuCounter: number;
}

export class TurnEngine {
    static sortBySpeed(units: { spd: number }[]) {
        return [...units].sort((a, b) => b.spd - a.spd);
    }

    /**
     * TU d'entrée sur le terrain, calculé uniquement à partir de la vitesse.
     * Formule : TU = 10 + 231.8 / (1 + SPEED/392)^3.925
     * Arrondi à l'entier le plus proche pour un affichage propre.
     */
    static computeEntryTu(spd: number): number {
        return Math.round(10 + 231.8 / Math.pow(1 + spd / 392, 3.925));
    }

    static initTurnOrder(characters: Character[]): TurnState[] {
        return characters.map((character) => ({
            character,
            tuCounter: TurnEngine.computeEntryTu(character.spd),
        }));
    }

    /**
     * Fait avancer le temps jusqu'à ce que le prochain personnage atteigne 0.
     * On repère qui a le compteur le plus bas, on soustrait CE MÊME montant
     * à TOUT LE MONDE (c'est le temps qui s'est réellement écoulé), et on
     * renvoie ce personnage : c'est lui qui joue.
     */
    static tick(states: TurnState[]): TurnState {
        const next = states.reduce((fastest, current) =>
            current.tuCounter < fastest.tuCounter ? current : fastest
        );

        const elapsed = next.tuCounter;
        for (const state of states) {
            state.tuCounter -= elapsed;
        }

        return next;
    }

    /**
     * Coût en TU réellement affiché lors de la sélection d'une compétence,
     * après application d'une éventuelle réduction (ex: hâte -25%).
     * C'est ICI que l'arrondi doit avoir lieu — au moment du calcul/affichage
     * dans le menu de sélection, pas plus tard quand le tour est validé.
     * Ex: 70 de coût de base, réduction de 25% -> 70*0.75 = 52.5 -> 53.
     */
    static computeSkillTuCost(baseTu: number, reductionPercent = 0): number {
        return Math.round(baseTu * (1 - reductionPercent));
    }

    /**
     * L'étourdissement n'est PAS un statut (ce n'est ni un bonus ni un
     * malus au sens propre) : c'est un ajout direct au TU de la cible, qui
     * retarde simplement son prochain tour. Le prototype le modélisait à
     * tort comme un statut EN PLUS de l'ajout de TU — ici on ne fait QUE
     * l'ajout de TU, rien d'autre à retirer/expirer.
     */
    static applyStun(state: TurnState, amount: number): void {
        state.tuCounter += amount;
    }

    /**
     * Une fois son tour joué, le compteur du personnage est remis au coût
     * en TU affiché lors de la sélection (déjà arrondi par computeSkillTuCost
     * en amont) — on ne réarrondit pas ici, la valeur reçue doit déjà être
     * exactement celle que le joueur a vue dans le menu.
     */
    static advance(state: TurnState, skillTuCost: number): void {
        state.tuCounter = skillTuCost;
    }
}