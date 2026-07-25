import type { Character } from "../../core/types/Character";

export const Awa: Character = {
    id: "awa",
    name: "Awa",
    title: "Blessed-Child of Ben-mo",
    element: "fire",
    weapon: "Hache",

    hp: 55624,
    maxHp: 55624,
    atk: 10040,
    spd: 189,

    passives: [
        {
            name: "Ben-mo",
            description:
                "Début de tour brûlé : soigne 20% PV max. Fin de tour brûlé : propage la brûlure à un ennemi aléatoire non brûlé.",
        },
        {
            name: "Armure ardente",
            description: "50% de dégâts en moins des attaques ennemies tant que brûlé.",
        },
    ],

    skills: [
        {
            id: "impStrike",
            name: "Frappe impétueuse",
            description: "135% dégâts. Le lanceur subit 20% des dégâts infligés.",
            tu: 100,
            mana: 1,
            target: "enemy1",
        },
        {
            id: "ignition",
            name: "Ignition",
            description: "S'applique la brûlure.",
            tu: 70,
            mana: 3,
            target: "self",
        },
        {
            id: "benmoVigour",
            name: "Vigueur de Ben-mo",
            description:
                "Si brûlé : hâte+enrage le lanceur, puis hâte des alliés aléatoires (autant que d'ennemis brûlés).",
            tu: 50,
            mana: -1,
            target: "none",
        },
        {
            id: "breathFire",
            name: "Souffle de feu",
            description: "350% dégâts. Requiert d'être brûlé.",
            tu: 130,
            mana: -1,
            target: "enemy1",
            usable: (self) => self.statuses.some((s) => s.id === "burn"),
        },
    ],

    statuses: [],
};