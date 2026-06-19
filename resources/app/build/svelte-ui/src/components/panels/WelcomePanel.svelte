<script lang="ts">
  import Button from '../ui/Button.svelte';

  let {
    onclose = () => {},
  }: { onclose?: () => void } = $props();
</script>

<!-- Overlay -->
<div class="k4-welcome-overlay" onclick={onclose}></div>

<!-- Dialog -->
<div class="k4-welcome" onclick={(e) => e.stopPropagation()}>
  <!-- Accent stripe -->
  <div class="k4-welcome-accent"></div>

  <!-- Logo area -->
  <div class="k4-welcome-logo">
    <div class="k4-welcome-brand">
      <span class="k4-welcome-k4">K4</span>
      <span class="k4-welcome-ultra">ULTRA</span>
    </div>
    <div class="k4-welcome-subtitle">开发者预览版</div>
  </div>

  <!-- body -->
  <div class="k4-welcome-body">
    <div class="k4-welcome-msg">
      <p>由于 <strong>K4</strong> 内部架构极其复杂，想要为本编辑器提供扩展功能，需要利用 <strong>AI Agent</strong>（人工智能代理）读取开发文档，才可以顺利添加扩展积木。</p>
    </div>
    <div class="k4-welcome-msg k4-welcome-msg-tip">
      <p>目前作者正在努力攻克难关，大家可以通过内部已经提供的用于<strong>示例和测试</strong>的扩展进行调试和理解。感谢大家的支持与耐心！</p>
    </div>
  </div>

  <!-- Credits -->
  <div class="k4-welcome-credits">
    <div class="k4-credit-line">
      <span class="k4-credit-label">开发者</span>
      <span class="k4-credit-value">JXW &amp; K4ULTRA 团队</span>
    </div>
    <div class="k4-credit-line">
      <span class="k4-credit-label">作者 QQ</span>
      <span class="k4-credit-value">2123600961</span>
    </div>
    <div class="k4-credit-line">
      <span class="k4-credit-label">交流群</span>
      <span class="k4-credit-value">967426331</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="k4-welcome-footer">
    <Button variant="primary" onclick={onclose}>✨ 我知道了，开始使用</Button>
  </div>
</div>

<style>
  .k4-welcome-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 5020;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: fadeIn 0.25s ease-out;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .k4-welcome {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    background: var(--oc-gray-800);
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
    z-index: 5021;
    overflow: hidden;
    animation: welcomeIn 0.4s var(--oc-ease-out-expo);
    border: 1px solid var(--oc-gray-700);
  }
  @keyframes welcomeIn {
    from { transform: translate(-50%, -50%) scale(0.92); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }

  /* Accent stripe */
  .k4-welcome-accent {
    height: 4px;
    background: linear-gradient(90deg, #583cdc, var(--oc-primary-500), #583cdc);
  }

  /* Logo area */
  .k4-welcome-logo {
    padding: 32px 32px 20px;
    text-align: center;
  }
  .k4-welcome-brand {
    font-size: 40px;
    font-weight: 900;
    letter-spacing: 4px;
  }
  .k4-welcome-k4 {
    color: var(--oc-white-90);
  }
  .k4-welcome-ultra {
    background: linear-gradient(135deg, #583cdc, var(--oc-primary-500));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .k4-welcome-subtitle {
    font-size: 13px;
    color: var(--oc-white-50);
    margin-top: 4px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  /* Body */
  .k4-welcome-body {
    padding: 0 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .k4-welcome-msg {
    padding: 14px 18px;
    border-radius: 10px;
    background: rgba(88, 60, 220, 0.08);
    border-left: 3px solid #583cdc;
  }
  .k4-welcome-msg p {
    font-size: 13px;
    color: var(--oc-white-70);
    line-height: 1.7;
    margin: 0;
  }
  .k4-welcome-msg strong {
    color: var(--oc-white-90);
    font-weight: 600;
  }
  .k4-welcome-msg-tip {
    background: rgba(255, 200, 50, 0.06);
    border-left-color: #f5c842;
  }

  /* Credits */
  .k4-welcome-credits {
    margin: 0 32px 20px;
    padding: 14px 18px;
    background: var(--oc-gray-850);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .k4-credit-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
  }
  .k4-credit-label {
    color: var(--oc-white-50);
  }
  .k4-credit-value {
    color: var(--oc-white-80);
    font-weight: 500;
    font-family: var(--oc-font-inter);
  }

  /* Footer */
  .k4-welcome-footer {
    padding: 0 32px 28px;
    display: flex;
    justify-content: center;
  }
</style>
