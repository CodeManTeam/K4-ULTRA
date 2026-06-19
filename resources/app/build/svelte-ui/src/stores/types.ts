/// <reference types="svelte" />

interface AppState {
  currentPage: 'loading' | 'editor' | 'settings' | 'extensions' | 'about';
  sidebarSelected: number;
  breadcrumbs: Array<{ label: string; page: string }>;
  loading: boolean;
  loadingProgress: number;
  loadingText: string;
  theme: 'dark' | 'ultra-dark';
}

interface UIState {
  sidebarOpen: boolean;
  modalQueue: ModalConfig[];
  notifications: NotificationMsg[];
  contextMenu: { x: number; y: number; items: ContextMenuItem[] } | null;
  tooltip: { text: string; x: number; y: number } | null;
}

interface ModalConfig {
  id: string;
  type: 'about' | 'confirm' | 'prompt' | 'custom';
  title?: string;
  content?: string;
  onClose?: () => void;
}

interface NotificationMsg {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}

interface ContextMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
}

export type { AppState, UIState, ModalConfig, NotificationMsg, ContextMenuItem };
