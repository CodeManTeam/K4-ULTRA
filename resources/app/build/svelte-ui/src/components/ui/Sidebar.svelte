<script lang="ts">
  import { appStore } from '../../stores/app.store';

  interface SidebarItem {
    id: number;
    label: string;
    page: string;
    icon: string;
  }

  const topSection: SidebarItem[] = [
    { id: 0, label: 'MOD CONFIG', page: 'header', icon: '' },
    { id: 1, label: 'Editor', page: 'editor', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
    { id: 2, label: 'Extensions', page: 'extensions', icon: 'M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34' },
  ];

  const bottomSection: SidebarItem[] = [
    { id: 7, label: 'System Debug', page: 'debug', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
    { id: 8, label: 'Settings', page: 'settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z' },
    { id: 9, label: 'About', page: 'about', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' },
  ];

  let selected = $state(1);
  let hovered = $state<number | null>(null);

  function handleClick(item: SidebarItem) {
    if (item.page === 'header') return;
    selected = item.id;
    appStore.setPage(item.page as any);
    appStore.setBreadcrumbs([
      { label: item.label, page: item.page },
    ]);
  }
</script>

<aside class="k4-sidebar">
  <!-- Brand -->
  <div class="k4-sidebar-brand">
    <div class="k4-brand-icon">K4</div>
    <span class="k4-brand-text">ULTRA</span>
  </div>

  <!-- Top section -->
  <div class="k4-sidebar-section">
    <span class="k4-sidebar-label">MOD CONFIG</span>
    {#each topSection.slice(1) as item}
      <button
        class="k4-sidebar-btn"
        class:selected={selected === item.id}
        class:hovered={hovered === item.id}
        onclick={() => handleClick(item)}
        onmouseenter={() => hovered = item.id}
        onmouseleave={() => hovered = null}
      >
        <svg class="k4-sidebar-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d={item.icon} />
        </svg>
        <span class="k4-sidebar-label-text">{item.label}</span>
      </button>
    {/each}
  </div>

  <!-- Bottom section -->
  <div class="k4-sidebar-section k4-sidebar-bottom">
    <span class="k4-sidebar-label">PERSONALIZATION</span>
    {#each bottomSection as item}
      <button
        class="k4-sidebar-btn"
        class:selected={selected === item.id}
        class:hovered={hovered === item.id}
        onclick={() => handleClick(item)}
        onmouseenter={() => hovered = item.id}
        onmouseleave={() => hovered = null}
      >
        <svg class="k4-sidebar-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d={item.icon} />
        </svg>
        <span class="k4-sidebar-label-text">{item.label}</span>
      </button>
    {/each}
  </div>
</aside>

<style>
  .k4-sidebar {
    width: var(--oc-sidebar-width);
    height: 100vh;
    background: var(--oc-gray-800-95);
    display: flex;
    flex-direction: column;
    padding: var(--oc-space-16);
    user-select: none;
  }

  /* ─── Brand ──────────────────────────────────────── */
  .k4-sidebar-brand {
    display: flex;
    align-items: center;
    gap: var(--oc-space-8);
    padding: var(--oc-space-8) var(--oc-space-12);
    margin-bottom: var(--oc-space-32);
  }
  .k4-brand-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #583cdc, #1967ff);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: var(--oc-weight-bold);
    color: var(--oc-white);
    letter-spacing: 1px;
  }
  .k4-brand-text {
    font-size: 15px;
    font-weight: var(--oc-weight-bold);
    color: var(--oc-white-80);
    letter-spacing: 1px;
  }

  /* ─── Sections ───────────────────────────────────── */
  .k4-sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .k4-sidebar-bottom {
    margin-top: auto;
    padding-bottom: var(--oc-space-16);
  }

  .k4-sidebar-label {
    font-size: var(--oc-sidebar-label-size);
    font-weight: var(--oc-weight-semibold);
    color: var(--oc-white-50);
    padding: var(--oc-space-8) var(--oc-space-12);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* ─── Buttons ────────────────────────────────────── */
  .k4-sidebar-btn {
    width: var(--oc-sidebar-button-width);
    height: var(--oc-sidebar-button-height);
    display: flex;
    align-items: center;
    gap: var(--oc-space-8);
    padding: 0 var(--oc-space-12);
    border: none;
    border-radius: var(--oc-sidebar-button-radius);
    background: transparent;
    color: var(--oc-white-60);
    cursor: pointer;
    font-size: var(--oc-text-base);
    font-family: var(--oc-font-inter);
    font-weight: var(--oc-weight-medium);
    transition: background var(--oc-duration-color) var(--oc-ease-in-out-quad),
                color var(--oc-duration-color) var(--oc-ease-in-out-quad);
    text-align: left;
  }
  .k4-sidebar-btn.hovered,
  .k4-sidebar-btn:hover {
    background: var(--oc-gray-500);
    color: var(--oc-white-80);
  }
  .k4-sidebar-btn.selected {
    background: var(--oc-primary-600);
    color: var(--oc-white);
  }
  .k4-sidebar-btn.selected:hover {
    background: var(--oc-primary-700);
  }

  .k4-sidebar-icon {
    flex-shrink: 0;
  }
  .k4-sidebar-label-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
