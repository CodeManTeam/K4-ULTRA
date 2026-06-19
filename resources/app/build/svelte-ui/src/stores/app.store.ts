import { writable, derived } from 'svelte/store';
import type { AppState } from './types';

const initialState: AppState = {
  currentPage: 'loading',
  sidebarSelected: 1,
  breadcrumbs: [{ label: 'Editor', page: 'editor' }],
  loading: true,
  loadingProgress: 0,
  loadingText: 'Initializing K4 ULTRA system...',
  theme: 'ultra-dark',
};

function createAppStore() {
  const { subscribe, set, update } = writable<AppState>(initialState);

  return {
    subscribe,
    set,
    update,

    setPage(page: AppState['currentPage']) {
      update(s => ({ ...s, currentPage: page }));
    },

    setLoading(loading: boolean) {
      update(s => ({ ...s, loading }));
    },

    setProgress(progress: number, text?: string) {
      update(s => ({
        ...s,
        loadingProgress: progress,
        loadingText: text || s.loadingText,
      }));
    },

    setSidebar(index: number) {
      update(s => ({ ...s, sidebarSelected: index }));
    },

    setTheme(theme: AppState['theme']) {
      update(s => ({ ...s, theme }));
    },

    setBreadcrumbs(crumbs: AppState['breadcrumbs']) {
      update(s => ({ ...s, breadcrumbs: crumbs }));
    },
  };
}

export const appStore = createAppStore();

export const isEditorPage = derived(appStore, $s => $s.currentPage === 'editor');
export const isLoading = derived(appStore, $s => $s.loading);
export const progress = derived(appStore, $s => $s.loadingProgress);
