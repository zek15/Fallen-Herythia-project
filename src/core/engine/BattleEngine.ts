import type { Character } from "../types/Character";
import type { Skill } from "../types/Skill";
import { DamageEngine } from "./DamageEngine";
import { EventBus } from "../events/EventBus";
import { BattleEvent, type BattleEventPayloads } from "../events/BattleEvents";

/**
 * BattleEngine ne connaît PAS le détail des passifs ou des statuts.
 * Il fait juste 3 choses : vérifier qu'une compétence est utilisable,
 * appliquer les dégâts, puis "annoncer" ce qui vient de se passer via
 * le bus (emit). Ce sont PassiveEngine/StatusEngine qui écouteront
 * ces annonces (on) pour réagir — c'est ça, le découplage : BattleEngine
 * n'a jamais besoin de savoir que "Mateh" existe.
 */
export class BattleEngine {
    constructor(private bus: EventBus<BattleEventPayloads>) {}

    useSkill(caster: Character, skill: Skill, target: Character, percent: number): void {
        if (skill.usable && !skill.usable(caster)) {
            console.warn(`${caster.name} ne peut pas utiliser ${skill.name} pour le moment.`);
            return;
        }

        const amount = DamageEngine.computeSkillDamage(caster.atk, percent);
        target.hp = Math.max(target.hp - amount, 0);

        this.bus.emit(BattleEvent.DAMAGE, { source: caster, target, amount });

        if (target.hp === 0) {
            this.bus.emit(BattleEvent.DEATH, { unit: target });
        }
    }
}