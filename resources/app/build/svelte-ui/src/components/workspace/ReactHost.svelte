<script lang="ts">
  import { onMount } from 'svelte';
  import { eventBus } from '../../stores/bridge';

  onMount(() => {
    // Svelte runs alongside React without moving DOM.
    // React mounts to #root independently.
    // Svelte components are rendered as overlay panels only.
    eventBus.notifyReady();
  });
</script>

<!-- React renders independently into #root.
     Svelte is a non-intrusive overlay layer. -->
