import { Character } from "./Character";

export interface Battle {

    allies: Character[];

    enemies: Character[];

    turn: number;

}