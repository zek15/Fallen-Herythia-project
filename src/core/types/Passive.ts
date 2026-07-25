import type { Character } from "./Character";
import type { BattleEvent, BattleEventPayloads } from "../events/BattleEvents";

export interface Passive {
    id?: string;
    name: string;
    description: string;
    onEvent?: {
        [K in BattleEvent]?: (self: Character, payload: BattleEventPayloads[K]) => void;
    };
}