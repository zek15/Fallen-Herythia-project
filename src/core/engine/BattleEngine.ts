import { Battle } from "../types/Battle";

export class BattleEngine {

    private battle: Battle;

    constructor(battle: Battle) {

        this.battle = battle;

    }

    start() {

        this.battle.turn = 1;

        console.log("Combat commencé");

    }

    nextTurn() {

        this.battle.turn++;

        console.log("Tour", this.battle.turn);

    }

}