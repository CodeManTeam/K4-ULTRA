<script lang="ts">
  import { onMount } from 'svelte';
  import { appStore } from './stores/app.store';
  import { eventBus } from './stores/bridge';
  import MainShell from './components/panels/MainShell.svelte';

  onMount(() => {
    const unsub = eventBus.on('editor-ready', () => {
      appStore.setLoading(false);
    });
    appStore.setLoading(false);
    return () => { unsub(); };
  });

  if (typeof window !== 'undefined') {
    (window as any).__k4app = appStore;
  }
</script>

<div class="k4-scope">
  <MainShell />
</div>
