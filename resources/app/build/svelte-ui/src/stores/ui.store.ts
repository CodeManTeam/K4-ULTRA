import { writable, derived } from 'svelte/store';
import type { UIState, ModalConfig, NotificationMsg } from './types';

const initialState: UIState = {
  sidebarOpen: true,
  modalQueue: [],
  notifications: [],
  contextMenu: null,
  tooltip: null,
};

function createUIStore() {
  const { subscribe, set, update } = writable<UIState>(initialState);

  return {
    subscribe,
    set,
    update,

    /* ─── Modal ─────────────────────────────────────── */
    openModal(config: ModalConfig) {
      update(s => ({ ...s, modalQueue: [...s.modalQueue, config] }));
    },
    closeModal(id: string) {
      update(s => ({
        ...s,
        modalQueue: s.modalQueue.filter(m => m.id !== id),
      }));
    },

    /* ─── Notification ──────────────────────────────── */
    notify(msg: Omit<NotificationMsg, 'id'>) {
      const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      update(s => ({
        ...s,
        notifications: [...s.notifications, { ...msg, id }],
      }));
      // Auto-dismiss after duration (errors default to 8s, others 4s)
      const duration = msg.duration || (msg.type === 'error' ? 8000 : 4000);
      setTimeout(() => {
        update(s => ({
          ...s,
          notifications: s.notifications.filter(n => n.id !== id),
        }));
      }, duration);
    },
    dismissNotification(id: string) {
      update(s => ({
        ...s,
        notifications: s.notifications.filter(n => n.id !== id),
      }));
    },

    /* ─── Context Menu ──────────────────────────────── */
    openContextMenu(x: number, y: number, items: UIState['contextMenu']) {
      update(s => ({ ...s, contextMenu: { x, y, items: items as any } }));
    },
    closeContextMenu() {
      update(s => ({ ...s, contextMenu: null }));
    },

    /* ─── Tooltip ───────────────────────────────────── */
    showTooltip(text: string, x: number, y: number) {
      update(s => ({ ...s, tooltip: { text, x, y } }));
    },
    hideTooltip() {
      update(s => ({ ...s, tooltip: null }));
    },
  };
}

export const uiStore = createUIStore();

export const modalQueue = derived(uiStore, $s => $s.modalQueue);
export const notifications = derived(uiStore, $s => $s.notifications);
export const activeModal = derived(uiStore, $s =>
  $s.modalQueue.length > 0 ? $s.modalQueue[$s.modalQueue.length - 1] : null
);
