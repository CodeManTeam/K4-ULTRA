<script lang="ts">
  import Button from '../ui/Button.svelte';

  let {
    onclose = () => {},
  }: { onclose?: () => void } = $props();

  let logs = $state<string[]>([]);

  // Detect available APIs from the environment
  let systemInfo = $state({
    electron: false,
    fs: false,
    os: '',
    platform: '',
    nodeVersion: '',
    contextIsolated: true,
  });

  let apiStatus = $state<Record<string, 'idle' | 'testing' | 'ok' | 'error'>>({
    'window.FS': 'idle',
    'window.System': 'idle',
    'require(fs)': 'idle',
    'require(electron)': 'idle',
    'require(path)': 'idle',
    'process.versions': 'idle',
  });

  function log(msg: string) {
    logs = [{ timestamp: new Date().toLocaleTimeString(), text: msg }, ...logs].slice(0, 100);
  }

  async function detectSystem() {
    systemInfo.electron = !!(window as any).electron || !!(window as any).require?.('electron');
    systemInfo.fs = !!(window as any).FS || !!(window as any).require?.('fs');
    systemInfo.platform = navigator.platform;
    systemInfo.nodeVersion = (window as any).process?.versions?.node || 'unknown';
    systemInfo.contextIsolated = !(window as any).require;
    log('System detection complete');
  }

  async function testAPI(apiName: string) {
    apiStatus[apiName] = 'testing';
    try {
      switch (apiName) {
        case 'window.FS': {
          const fs = (window as any).FS;
          if (!fs) throw new Error('FS not available');
          const result = await fs.exists('/');
          log(`✓ FS.exists('/') → ${result}`);
          break;
        }
        case 'window.System': {
          const sys = (window as any).System;
          if (!sys) throw new Error('System not available');
          const os = await sys.getOS?.();
          log(`✓ System.getOS() → ${os || 'ok'}`);
          break;
        }
        case 'require(fs)': {
          const fs = require('fs');
          const exists = fs.existsSync(__dirname || '.');
          log(`✓ fs.existsSync → ${exists}`);
          break;
        }
        case 'require(electron)': {
          const el = require('electron');
          log(`✓ electron available: ${Object.keys(el).slice(0, 5).join(', ')}...`);
          break;
        }
        case 'require(path)': {
          const path = require('path');
          log(`✓ path.resolve('.'): ${path.resolve('.')}`);
          break;
        }
        case 'process.versions': {
          const v = process.versions;
          log(`✓ node: ${v.node}, electron: ${v.electron}, chrome: ${v.chrome}`);
          break;
        }
      }
      apiStatus[apiName] = 'ok';
    } catch (e: any) {
      apiStatus[apiName] = 'error';
      log(`✗ ${apiName}: ${e.message}`);
    }
  }

  function testAll() {
    logs = [];
    Object.keys(apiStatus).forEach(k => {
      apiStatus[k] = 'idle';
      testAPI(k);
    });
  }

  // Run detection on mount
  setTimeout(detectSystem, 100);
</script>

<!-- Overlay backdrop -->
<div class="k4-overlay" onclick={onclose}></div>

<!-- Panel -->
<div class="k4-debug-panel" onclick={(e) => e.stopPropagation()}>
  <header class="k4-panel-header">
    <div class="k4-header-left">
      <h2>System API Debug</h2>
      <span class="k4-header-badge">DEV</span>
    </div>
    <button class="k4-panel-close" onclick={onclose}>×</button>
  </header>

  <div class="k4-panel-body">
    <!-- ─── System Info ──────────────────────────── -->
    <section class="k4-section">
      <h3 class="k4-section-title">Environment</h3>
      <div class="k4-info-grid">
        <div class="k4-info-item">
          <span class="k4-info-key">Electron</span>
          <span class="k4-info-val" class:yes={systemInfo.electron} class:no={!systemInfo.electron}>
            {systemInfo.electron ? '✓' : '✗'}
          </span>
        </div>
        <div class="k4-info-item">
          <span class="k4-info-key">File System</span>
          <span class="k4-info-val" class:yes={systemInfo.fs} class:no={!systemInfo.fs}>
            {systemInfo.fs ? '✓' : '✗'}
          </span>
        </div>
        <div class="k4-info-item">
          <span class="k4-info-key">contextIsolation</span>
          <span class="k4-info-val">{String(systemInfo.contextIsolated)}</span>
        </div>
        <div class="k4-info-item">
          <span class="k4-info-key">Node.js</span>
          <span class="k4-info-val">{systemInfo.nodeVersion}</span>
        </div>
        <div class="k4-info-item">
          <span class="k4-info-key">Platform</span>
          <span class="k4-info-val">{systemInfo.platform}</span>
        </div>
        <div class="k4-info-item">
          <span class="k4-info-key">Navigator</span>
          <span class="k4-info-val">{navigator.userAgent.slice(0, 60)}...</span>
        </div>
      </div>
    </section>

    <div class="k4-divider"></div>

    <!-- ─── API Tests ────────────────────────────── -->
    <section class="k4-section">
      <div class="k4-section-header">
        <h3 class="k4-section-title">API Tests</h3>
        <Button size="sm" variant="secondary" onclick={testAll}>Test All</Button>
      </div>
      <div class="k4-api-grid">
        {#each Object.entries(apiStatus) as [name, status]}
          <div class="k4-api-item" class:k4-api-ok={status === 'ok'} class:k4-api-error={status === 'error'}>
            <div class="k4-api-left">
              <span class="k4-api-icon">
                {#if status === 'idle'}○
                {:else if status === 'testing'}◌
                {:else if status === 'ok'}✓
                {:else}✗
                {/if}
              </span>
              <code class="k4-api-name">{name}</code>
            </div>
            <button class="k4-api-test-btn" onclick={() => testAPI(name)} disabled={status === 'testing'}>
              {status === 'testing' ? '...' : 'Test'}
            </button>
          </div>
        {/each}
      </div>
    </section>

    <div class="k4-divider"></div>

    <!-- ─── Logs ─────────────────────────────────── -->
    <section class="k4-section">
      <div class="k4-section-header">
        <h3 class="k4-section-title">Output Log</h3>
        <Button size="sm" variant="tertiary" onclick={() => logs = []}>
          Clear
        </Button>
      </div>
      <div class="k4-log-view">
        {#if logs.length === 0}
          <div class="k4-log-empty">Run API tests to see output here.</div>
        {:else}
          {#each logs as entry}
            <div class="k4-log-entry">
              <span class="k4-log-time">{entry.timestamp}</span>
              <span class="k4-log-text">{entry.text}</span>
            </div>
          {/each}
        {/if}
      </div>
    </section>
  </div>

  <footer class="k4-panel-footer">
    <Button variant="tertiary" onclick={onclose}>Close</Button>
  </footer>
</div>

<style>
  .k4-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 5000;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease-out;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .k4-debug-panel {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 720px; max-height: 85vh;
    background: var(--oc-gray-800);
    border-radius: var(--oc-window-radius);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    z-index: 5010;
    display: flex; flex-direction: column;
    overflow: hidden;
    animation: panelIn 0.3s var(--oc-ease-out-expo);
    border: 1px solid var(--oc-gray-700);
  }
  @keyframes panelIn {
    from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }

  .k4-panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--oc-gray-700);
    flex-shrink: 0;
  }
  .k4-header-left {
    display: flex; align-items: center; gap: 12px;
  }
  .k4-panel-header h2 {
    font-size: var(--oc-text-lg);
    font-weight: var(--oc-weight-semibold);
    color: var(--oc-white-90);
    margin: 0;
  }
  .k4-header-badge {
    font-size: 10px;
    font-weight: var(--oc-weight-bold);
    padding: 2px 8px;
    border-radius: 4px;
    background: var(--oc-primary-600);
    color: var(--oc-white);
    letter-spacing: 1px;
  }
  .k4-panel-close {
    background: none; border: none;
    color: var(--oc-white-50); font-size: 24px;
    cursor: pointer; width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px;
    transition: background 0.15s, color 0.15s;
  }
  .k4-panel-close:hover { background: var(--oc-gray-500); color: var(--oc-white); }

  .k4-panel-body { flex: 1; overflow-y: auto; padding: 8px 0; }
  .k4-section { padding: 12px 24px; }
  .k4-section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px;
  }
  .k4-section-title {
    font-size: var(--oc-text-sm);
    font-weight: var(--oc-weight-semibold);
    color: var(--oc-white-50);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
  }

  /* ─── Info Grid ──────────────────────────────── */
  .k4-info-grid { display: flex; flex-direction: column; gap: 4px; }
  .k4-info-item {
    display: flex; align-items: center; justify-content: space-between;
    height: 28px; padding: 0 8px;
    border-radius: 4px;
  }
  .k4-info-item:hover { background: var(--oc-gray-700); }
  .k4-info-key { font-size: 13px; color: var(--oc-white-60); font-weight: 400; }
  .k4-info-val {
    font-size: 13px; font-family: var(--oc-font-mono);
    color: var(--oc-white-80);
    font-weight: var(--oc-weight-medium);
  }
  .k4-info-val.yes { color: var(--oc-success-600); }
  .k4-info-val.no { color: var(--oc-error-600); }

  .k4-divider { height: 1px; background: var(--oc-gray-700); margin: 4px 24px; }

  /* ─── API Grid ────────────────────────────────── */
  .k4-api-grid { display: flex; flex-direction: column; gap: 4px; }
  .k4-api-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid transparent;
    transition: background 0.15s, border-color 0.15s;
  }
  .k4-api-item:hover { background: var(--oc-gray-700); }
  .k4-api-ok { border-color: rgba(3, 152, 85, 0.2); }
  .k4-api-error { border-color: rgba(217, 32, 32, 0.2); background: rgba(217, 32, 32, 0.05); }
  .k4-api-left { display: flex; align-items: center; gap: 10px; }
  .k4-api-icon { width: 16px; font-size: 13px; text-align: center; }
  .k4-api-ok .k4-api-icon { color: var(--oc-success-600); }
  .k4-api-error .k4-api-icon { color: var(--oc-error-600); }
  .k4-api-name {
    font-size: 13px; font-family: var(--oc-font-mono);
    color: var(--oc-white-80);
    background: var(--oc-gray-850);
    padding: 2px 8px; border-radius: 4px;
  }
  .k4-api-test-btn {
    height: 24px; padding: 0 12px;
    border: 1px solid var(--oc-gray-600);
    border-radius: 6px;
    background: var(--oc-gray-850);
    color: var(--oc-white-60);
    font-size: 11px; font-family: var(--oc-font-inter);
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .k4-api-test-btn:hover { background: var(--oc-gray-600); color: var(--oc-white); }
  .k4-api-test-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ─── Log View ────────────────────────────────── */
  .k4-log-view {
    max-height: 200px; overflow-y: auto;
    background: var(--oc-gray-900);
    border-radius: 8px;
    padding: 8px;
    font-family: var(--oc-font-mono);
    font-size: 11px;
    line-height: 1.6;
  }
  .k4-log-empty {
    color: var(--oc-white-30);
    text-align: center;
    padding: 20px;
    font-family: var(--oc-font-inter);
  }
  .k4-log-entry { display: flex; gap: 8px; padding: 1px 4px; }
  .k4-log-time { color: var(--oc-gray-500); flex-shrink: 0; }
  .k4-log-text { color: var(--oc-white-70); word-break: break-all; }

  .k4-panel-footer {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 12px; padding: 12px 24px;
    border-top: 1px solid var(--oc-gray-700);
    flex-shrink: 0;
  }
</style>
