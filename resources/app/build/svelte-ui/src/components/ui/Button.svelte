<script lang="ts">
  let {
    size = 'md',
    variant = 'primary',
    icon = '',
    disabled = false,
    fullWidth = false,
    onclick = () => {},
    children,
  }: {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
    icon?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    onclick?: () => void;
    children?: import('svelte').Snippet;
  } = $props();
</script>

<button
  class="oc-btn oc-btn-{size} oc-btn-{variant}"
  class:oc-btn-full={fullWidth}
  class:oc-btn-disabled={disabled}
  {disabled}
  onclick={onclick}
>
  {#if icon}
    <svg class="oc-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d={icon} />
    </svg>
  {/if}
  {#if children}
    <span class="oc-btn-text">{@render children()}</span>
  {/if}
</button>

<style>
  /* ─── Base ────────────────────────────────────────── */
  .oc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    border-radius: var(--oc-button-radius);
    font-family: var(--oc-font-inter);
    font-weight: var(--oc-weight-medium);
    cursor: pointer;
    white-space: nowrap;
    transition: background var(--oc-duration-color) var(--oc-ease-in-out-quad),
                color var(--oc-duration-color) var(--oc-ease-in-out-quad),
                box-shadow var(--oc-duration-color) var(--oc-ease-in-out-quad),
                transform var(--oc-duration-checkbox) var(--oc-ease-in-out-quad);
    user-select: none;
    outline: none;
    line-height: 1;
  }
  .oc-btn:active:not(.oc-btn-disabled) {
    transform: scale(0.97);
  }
  .oc-btn-full {
    width: 100%;
  }
  .oc-btn-disabled {
    opacity: var(--oc-button-disabled-opacity);
    pointer-events: none;
    cursor: not-allowed;
  }

  /* ─── Sizes ───────────────────────────────────────── */
  .oc-btn-sm  { height: var(--oc-button-height-sm); padding: 0 12px; font-size: var(--oc-button-font-sm); }
  .oc-btn-md  { height: var(--oc-button-height-md); padding: 0 16px; font-size: var(--oc-button-font-md); }
  .oc-btn-lg  { height: var(--oc-button-height-lg); padding: 0 16px; font-size: var(--oc-button-font-lg); }
  .oc-btn-xl  { height: var(--oc-button-height-xl); padding: 0 20px; font-size: var(--oc-button-font-xl); border-radius: var(--oc-button-radius-xl); }

  /* ─── Primary ─────────────────────────────────────── */
  .oc-btn-primary {
    background: var(--oc-palette-primary-normal);
    color: var(--oc-white);
  }
  .oc-btn-primary:hover {
    background: var(--oc-palette-primary-hover);
  }
  .oc-btn-primary:active {
    background: var(--oc-palette-primary-pressed);
  }

  /* ─── Secondary ───────────────────────────────────── */
  .oc-btn-secondary {
    background: var(--oc-palette-secondary-normal);
    color: var(--oc-white-80);
  }
  .oc-btn-secondary:hover {
    background: var(--oc-palette-secondary-hover);
    color: var(--oc-white);
  }
  .oc-btn-secondary:active {
    background: var(--oc-palette-secondary-pressed);
  }

  /* ─── Tertiary (transparent) ──────────────────────── */
  .oc-btn-tertiary {
    background: transparent;
    color: var(--oc-palette-tertiary-normal);
  }
  .oc-btn-tertiary:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--oc-palette-tertiary-hover);
  }
  .oc-btn-tertiary:active {
    background: rgba(255, 255, 255, 0.08);
    color: var(--oc-palette-tertiary-pressed);
  }

  /* ─── Destructive ─────────────────────────────────── */
  .oc-btn-destructive {
    background: var(--oc-error-700);
    color: var(--oc-white);
  }
  .oc-btn-destructive:hover {
    background: var(--oc-error-600);
  }
  .oc-btn-destructive:active {
    background: var(--oc-error-600-80);
  }

  .oc-btn-icon {
    flex-shrink: 0;
  }
  .oc-btn-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
