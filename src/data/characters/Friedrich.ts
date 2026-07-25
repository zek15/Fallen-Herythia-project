import type { Character } from "../../core/types/Character";

import { BattleEvent } from "../../core/events/BattleEvents";

export const Friedrich: Character = {
    id: "friedrich",
    name: "Friedrich",
    title: "Blessed-Child of Mateh",
    element: "thunder",
    weapon: "Épée à deux mains",

    hp: 68137,
    maxHp: 68137,
    atk: 7537,
    spd: 246,

    passives: [
        {
    name: "Mateh",
    description:
        "60% de chance de contre-attaquer (Décharge de résistance) quand le lanceur subit des dégâts d'une attaque ennemie. Le TU du contre n'est pas appliqué.",
    onEvent: {
        [BattleEvent.DAMAGE]: (self, { target }) => {
            if (target.id === self.id && Math.random() < 0.6) {
                console.log(`${self.name} contre-attaque grâce à Mateh !`);
            }
        },
    },
},
        {
            name: "Tenir bon",
            description:
                "Survit avec 1 PV sur dégâts mortels, ne peut mourir jusqu'à la fin de son prochain tour. Une fois par entrée sur le terrain.",
            onEvent: {
                [BattleEvent.DEATH]: (self) => {
                    if (self.hp <= 0) {
                        console.log(`${self.name} survit grâce à Tenir bon !`);
                    }
                },
            },
        },
    ],

    skills: [
        {
            id: "resShock",
            name: "Décharge de résistance",
            description:
                "100% dégâts, étourdit 30TU (doublé si PV≤35%), soigne le lanceur du montant des dégâts infligés (doublé si PV≤35%).",
            tu: 130,
            mana: 1,
            target: "enemy1",
        },
        {
            id: "stunExchange",
            name: "Échange étourdissant",
            description:
                "Échange PV actuels/manquants, étourdit un ennemi aléatoire 100TU. Requiert PV≤50%.",
            tu: 70,
            mana: -1,
            target: "randomEnemy",
            usable: (self) => self.hp / self.maxHp <= 0.5,
        },
        {
            id: "matehBravery",
            name: "Bravoure de Mateh",
            description:
                "200% si seul allié sur le terrain, 250% si cible≥160TU, 400%+soin si les deux. Sinon 100%.",
            tu: 120,
            mana: -1,
            target: "enemy1",
        },
        {
            id: "guardianRavager",
            name: "Ravageur de gardien",
            description: "500% dégâts à un ennemi Gardien uniquement.",
            tu: 110,
            mana: -2,
            target: "enemy1",
        },
    ],

    statuses: [],
};