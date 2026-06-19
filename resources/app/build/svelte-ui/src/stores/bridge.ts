/**
 * K4 Bridge — Communication layer between Svelte UI and React app.
 *
 * Architecture:
 *   Svelte renders the app shell (sidebar, topbar, modals).
 *   React (kitten.js) renders the editor (Blockly workspace + Pixi stage)
 *   inside the <ReactHost> container.
 *
 *   Communication goes through window.__k4bus event bus:
 *     React → Svelte: events like 'editor-ready', 'modal-request'
 *     Svelte → React: 'redux-dispatch' to dispatch Redux actions
 */

export type K4BridgeEvent =
  | 'editor-ready'
  | 'panel-open'
  | 'modal-request'
  | 'notification'
  | 'progress-update'
  | 'redux-dispatch'
  | 'theme-change'
  | 'react-mount'
  ;

class K4EventBus {
  private listeners = new Map<K4BridgeEvent, Set<Function>>();

  on(event: K4BridgeEvent, fn: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn);
    return () => this.listeners.get(event)?.delete(fn);
  }

  emit(event: K4BridgeEvent, data?: any) {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }

  /** Dispatch a Redux action into the React app */
  reactDispatch(action: { type: string; payload?: any }) {
    this.emit('redux-dispatch', action);
  }

  /** Notify React that Svelte has mounted */
  notifyReady() {
    this.emit('react-mount', { timestamp: Date.now() });
  }

  /** Request a modal from Svelte (called by React) */
  onModalRequest(fn: (config: any) => void) {
    return this.on('modal-request', fn);
  }
}

const bus = new K4EventBus();

// Expose globally for React (kitten.js) to access
if (typeof window !== 'undefined') {
  (window as any).__k4bus = bus;


  // Lazy bridge proxy — defers to real __k4 once kitten.js initializes it.
  // Avoids the dangerous stub pattern that would permanently shadow the real API.
  if (!(window as any).__k4) {
    const pending: Array<{ api: string; method: string; args: any[] }> = [];
    const makeProxy = (api: string, methods: string[]) => {
      const obj: any = {};
      for (const m of methods) {
        obj[m] = (...args: any[]) => {
          const real = (window as any).__k4;
          if (real && real[api] && typeof real[api][m] === 'function') {
            return real[api][m](...args);
          }
          // Queue for later execution
          pending.push({ api, method: m, args });
          console.debug('[K4 Bridge] Queued ' + api + '.' + m + ' for deferred execution');
        };
      }
      return obj;
    };
    (window as any).__k4 = {
      blocks: makeProxy('blocks', ['define', 'register']),
      generator: makeProxy('generator', ['register', 'registerBatch']),
      runtime: makeProxy('runtime', ['register', 'registerBatch']),
      category: makeProxy('category', ['register']),
      security: makeProxy('security', ['wrap']),
      _pending: pending,
      _flushed: false,
      // Called when real __k4 initializes — replays queued calls
      _flush: function() {
        if (this._flushed) return;
        this._flushed = true;
        const real = (window as any).__k4;
        while (pending.length > 0) {
          const item = pending.shift()!;
          try {
            if (real[item.api] && typeof real[item.api][item.method] === 'function') {
              real[item.api][item.method](...item.args);
            }
          } catch (e) {
            console.warn('[K4 Bridge] Deferred call failed:', item.api + '.' + item.method, e);
          }
        }
      }
    };
  }
}

export const eventBus = bus;
