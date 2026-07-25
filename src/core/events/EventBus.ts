/**
 * EventBus générique : au lieu d'un bus qui accepte n'importe quelle
 * string + n'importe quelle donnée, celui-ci est "branché" sur une
 * map de payloads (TMap) — ici BattleEventPayloads.
 *
 * `K extends keyof TMap` veut dire : "K est forcément une des clés de TMap"
 * (donc un des BattleEvent). `TMap[K]` va chercher automatiquement le
 * type de données associé à CETTE clé précise. Résultat concret : si tu
 * écoutes BattleEvent.DAMAGE, callback reçoit forcément { source, target, amount },
 * et si tu te trompes de champ, TypeScript te le signale avant même d'exécuter le code.
 */
export class EventBus<TMap> {
    private listeners: { [K in keyof TMap]?: Array<(data: TMap[K]) => void> } = {};

    on<K extends keyof TMap>(event: K, callback: (data: TMap[K]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(callback);
    }

    emit<K extends keyof TMap>(event: K, data: TMap[K]): void {
        this.listeners[event]?.forEach((callback) => callback(data));
    }
}