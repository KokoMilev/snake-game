export type EventName = string;
export type Handler<Payload = unknown> = (payload: Payload) => void;

export class EventBus {
  private handlers: Map<EventName, Set<Handler>>;

  constructor() {
    this.handlers = new Map<EventName, Set<Handler>>();
  }

  public on<Payload = unknown>(event: EventName, handler: Handler<Payload>): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set<Handler>();
      this.handlers.set(event, set);
    }
    set.add(handler as Handler);
    return () => {
      this.off(event, handler);
    };
  }

  public once<Payload = unknown>(event: EventName, handler: Handler<Payload>): () => void {
    const wrapper = (payload: Payload) => {
      this.off(event, wrapper as Handler);
      handler(payload);
    };
    return this.on(event, wrapper);
  }

  public off<Payload = unknown>(event: EventName, handler: Handler<Payload>): void {
    const set = this.handlers.get(event);
    if (!set) return;
    set.delete(handler as Handler);
    if (set.size === 0) {
      this.handlers.delete(event);
    }
  }

  public emit<Payload = unknown>(event: EventName, payload?: Payload): void {
    const set = this.handlers.get(event);
    if (!set || set.size === 0) return;

    const list: Handler[] = Array.from(set);
    for (let i = 0; i < list.length; i++) {
      const fn = list[i];
      try {
        fn(payload as Payload);
      } catch (err) {
      }
    }
  }

  public clear(): void {
    this.handlers.clear();
  }
}