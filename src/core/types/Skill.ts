export type SkillTarget =
    | "enemy1"
    | "enemy2"
    | "allEnemies"
    | "randomEnemy"
    | "ally1"
    | "ally2"
    | "allAllies"
    | "randomAlly"
    | "self"
    | "none";

export interface Skill {
    id: string;
    name: string;
    description: string;
    mana: number;
    tu: number;
    target: SkillTarget;
    choice?: string[];
    usable?: (self: import("./Character").Character, ...context: unknown[]) => boolean;
}