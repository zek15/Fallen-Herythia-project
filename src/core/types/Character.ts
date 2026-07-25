import type { Passive } from "./Passive";
import type { Skill } from "./Skill";
import type { Status } from "./Status";

export interface Character {
    id: string;
    name: string;
    title?: string;
    element: string;
    weapon?: string;

    hp: number;
    maxHp: number;
    atk: number;
    spd: number;

    passives: Passive[];
    skills: Skill[];
    statuses: Status[];
}