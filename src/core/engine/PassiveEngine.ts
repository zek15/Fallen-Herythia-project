import type { Character } from "../types/Character";
import { EventBus } from "../events/EventBus";
import type { BattleEvent, BattleEventPayloads } from "../events/BattleEvents";

export class PassiveEngine {
    static register(bus: EventBus<BattleEventPayloads>, characters: Character[]): void {
        for (const character of characters) {
            for (const passive of character.passives) {
                if (!passive.onEvent) continue;

                for (const key of Object.keys(passive.onEvent) as BattleEvent[]) {
                    const handler = passive.onEvent[key] as
                        | ((self: Character, payload: unknown) => void)
                        | undefined;
                    if (!handler) continue;

                    bus.on(key, (payload) => handler(character, payload));
                }
            }
        }
    }
}