export class DamageEngine {
    /**
     * Calcule les dégâts d'une compétence en pourcentage de l'ATK du lanceur.
     * Ex: Awa "Frappe impétueuse" = 135% dégâts -> computeSkillDamage(awa.atk, 1.35)
     *
     * Le Math.max(..., 1) garantit qu'une attaque inflige toujours au moins
     * 1 dégât (évite une attaque à 0 dégâts si jamais percent ou atk vaut 0).
     */
    static computeSkillDamage(attackerAtk: number, percent: number): number {
        return Math.max(Math.round(attackerAtk * percent), 1);
    }
}