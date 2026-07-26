import type { StatusDefinition } from "../../core/types/Status";

/**
 * Registre central de tous les statuts connus du jeu. `StatusEngine` s'appuie
 * UNIQUEMENT sur ce registre pour savoir comment se comporte chaque statut
 * (DOT, purifiable, condition de retrait...) — ajouter un nouveau statut se
 * fait ici, pas en modifiant `StatusEngine.ts`.
 *
 * Durées : volontairement PAS définies ici. Les corrections de l'analyse
 * indiquent qu'une même sorte de statut peut avoir une durée différente
 * selon qui l'applique (ex: un sommeil à 300TU vs le "défaut" à 200TU) — la
 * durée est donc toujours un paramètre passé à `StatusEngine.apply(...)`,
 * jamais une constante fixée ici. Voir `DEFAULT_STATUS_DURATIONS` plus bas
 * pour des valeurs de référence à utiliser au cas par cas.
 */
export const STATUS_DEFINITIONS: Record<string, StatusDefinition> = {
    burn: {
        id: "burn",
        name: "Brûlure",
        category: "negative",
        purifiable: true,
        dot: {
            // sourceAtk = ATK de celui qui a appliqué la brûlure (pas la cible).
            computeDamage: (ctx, amount) => (ctx.sourceAtk ?? 0) * 0.0075 * amount,
        },
    },
    poison: {
        id: "poison",
        name: "Poison",
        category: "negative",
        purifiable: true,
        dot: {
            computeDamage: (ctx, amount) => ctx.maxHp * 0.001 * amount,
        },
    },
    venom: {
        id: "venom",
        name: "Venin",
        category: "negative",
        purifiable: true,
        dot: {
            // 0.3% des PV max par TU (confirmé — le prototype avait par
            // erreur 5% par TU, largement trop élevé).
            computeDamage: (ctx, amount) => ctx.maxHp * 0.003 * amount,
        },
    },
    sleep: {
        id: "sleep",
        name: "Sommeil",
        category: "negative",
        purifiable: true,
    },
    mark: {
        id: "mark",
        name: "Marque",
        category: "negative",
        purifiable: true,
        // Se retire après le PROCHAIN coup encaissé, pas sur un minuteur.
        removeAfterDamageTaken: true,
    },
    haste: {
        id: "haste",
        name: "Hâte",
        category: "positive",
        purifiable: false,
        // Vraiment permanente (remaining: null à l'application) tant que
        // rien ne la retire explicitement : réduit -20% TU sur TOUTES les
        // actions du porteur pendant qu'elle est active, pas juste la
        // prochaine. Confirmé : ne PAS utiliser cet id pour un effet de
        // réduction de coût TU ponctuel/non permanent (ex: le "cadeau" de
        // Rina) — ça, c'est un effet à part, voir `tuDiscount25`.
    },
    tuDiscount25: {
        id: "tuDiscount25",
        name: "Tour offert",
        category: "positive",
        purifiable: false,
        // Réduction de coût TU ponctuelle et non permanente : se retire dès
        // que le porteur a joué son action suivante, contrairement à Hâte.
        removeAfterOwnNextAction: true,
    },
    rage: {
        id: "rage",
        name: "Enragé",
        category: "positive",
        purifiable: false,
        // +25% ATK effectif (voir DamageEngine), retiré après l'action
        // suivante du porteur — PAS après un certain temps de jeu écoulé.
        removeAfterOwnNextAction: true,
    },
    shield: {
        id: "shield",
        name: "Bouclier",
        category: "positive",
        purifiable: false,
        // Se consomme au prochain coup encaissé (géré côté DamageEngine, pas ici).
        removeAfterDamageTaken: true,
    },
    stealth: {
        id: "stealth",
        name: "Furtivité",
        category: "positive",
        purifiable: false,
        // Pas de limite en TU : dure indéfiniment (remaining = null), se
        // retire uniquement sur des DÉGÂTS DIRECTS subis (pas un DOT).
        removeOnDirectDamage: true,
    },
    intombable: {
        id: "intombable",
        name: "Intombable",
        category: "positive",
        purifiable: false,
    },
    lockProtector: {
        id: "lockProtector",
        name: "Verrouillé (protecteur)",
        category: "neutral",
        purifiable: false,
    },
    contreRelais: {
        id: "contreRelais",
        name: "Contre-relais",
        category: "neutral",
        purifiable: false,
    },
};

/**
 * Valeurs de référence pour les statuts qui expirent avec une durée en TU
 * "par défaut" — PAS une règle imposée par le moteur, juste ce qu'on utilise
 * quand un personnage ne précise pas explicitement une durée différente
 * dans son propre kit (ex: le sommeil personnalisé d'un perso à 300TU).
 * `null` = pas de durée par défaut pertinente (le statut se retire par un
 * autre mécanisme : dégâts directs, action du porteur, etc.).
 */
export const DEFAULT_STATUS_DURATIONS: Record<string, number | null> = {
    burn: 300,
    poison: 200,
    venom: 200, // décision explicite : on garde 200TU (comme le tableau de l'analyse), pas 100TU (valeur du code du prototype)
    sleep: 200,
    mark: null, // se retire sur dégâts, pas sur la durée
    haste: null, // permanente tant que rien ne la retire
    tuDiscount25: null, // se retire après la prochaine action du porteur
    rage: null, // idem
    shield: null, // se retire sur dégâts
    stealth: null, // permanente tant que rien ne la retire
    intombable: 100,
    lockProtector: 130,
    contreRelais: 200,
};