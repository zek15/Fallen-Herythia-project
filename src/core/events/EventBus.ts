type Callback = (data?: unknown) => void;

export class EventBus {

    private listeners = new Map<string, Callback[]>();

    on(event: string, callback: Callback) {

        if (!this.listeners.has(event)) {

            this.listeners.set(event, []);

        }

        this.listeners.get(event)!.push(callback);

    }

    emit(event: string, data?: unknown) {

        const callbacks = this.listeners.get(event);

        if (!callbacks) return;

        callbacks.forEach(cb => cb(data));

    }

}