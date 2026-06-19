<script lang="ts">
  import { appStore, progress } from '../../stores/app.store';
  import { onMount } from 'svelte';

  let dots = $state('');
  let loadingText = $state('Initializing K4 ULTRA system...');

  onMount(() => {
    // Animate loading dots
    const dotInterval = setInterval(() => {
      dots = '.'.repeat(((dots.length + 1) % 4) || 0);
    }, 500);

    // Simulate loading progress for demo
    const progInterval = setInterval(() => {
      appStore.update(s => ({
        ...s,
        loadingProgress: Math.min(s.loadingProgress + Math.random() * 15, 85),
      }));
    }, 800);

    return () => {
      clearInterval(dotInterval);
      clearInterval(progInterval);
    };
  });

  // Listen for loading text updates
  appStore.subscribe(s => {
    loadingText = s.loadingText;
  });
</script>

<div class="k4-loader">
  <!-- Starfield background -->
  <div class="k4-loader-bg"></div>
  <div class="k4-loader-grid"></div>
  <div class="k4-loader-glow"></div>

  <!-- Scanline -->
  <div class="k4-loader-scanline"></div>

  <!-- Corner accents -->
  <div class="k4-corner tl"></div>
  <div class="k4-corner tr"></div>
  <div class="k4-corner bl"></div>
  <div class="k4-corner br"></div>

  <div class="k4-loader-content">
    <!-- Logo -->
    <div class="k4-logo">
      <span class="k4-logo-text">K4</span>
      <span class="k4-logo-accent">ULTRA</span>
    </div>

    <!-- Subtitle -->
    <div class="k4-loader-subtitle">SYSTEM INITIALIZING</div>

    <!-- Progress bar -->
    <div class="k4-progress-track">
      <div
        class="k4-progress-fill"
        style="width: {$progress}%"
      ></div>
      <div
        class="k4-progress-dot"
        style="left: {$progress}%"
      ></div>
    </div>

    <!-- Status text -->
    <div class="k4-loader-status">
      {loadingText}<span class="k4-loader-dots">{dots}</span>
    </div>
  </div>

  <div class="k4-loader-version">v2.0 // BLINK CORE</div>
</div>

<style>
  .k4-loader {
    position: fixed;
    inset: 0;
    background: var(--oc-gray-900);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-family: var(--oc-font-inter);
    pointer-events: none;
    z-index: 10000;
  }

  /* Starfield nebula */
  .k4-loader-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 80%, rgba(88, 60, 220, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0, 120, 255, 0.08) 0%, transparent 50%);
    z-index: 0;
  }

  /* Grid */
  .k4-loader-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 60%, black 20%, transparent 70%);
    mask-image: radial-gradient(ellipse 70% 50% at 50% 60%, black 20%, transparent 70%);
    animation: gridPulse 8s ease-in-out infinite;
    z-index: 0;
  }
  @keyframes gridPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  /* Glow */
  .k4-loader-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 800px;
    height: 800px;
    transform: translate(-50%, -50%);
    background:
      radial-gradient(circle at 40% 50%, rgba(88, 60, 220, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 60% 50%, rgba(0, 120, 255, 0.06) 0%, transparent 50%);
    animation: glowOrbit 6s ease-in-out infinite alternate;
    z-index: 0;
  }
  @keyframes glowOrbit {
    0% { transform: translate(-50%, -50%) scale(1); }
    100% { transform: translate(-50%, -50%) scale(1.1); }
  }

  /* Scanline */
  .k4-loader-scanline {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(0, 120, 255, 0.015) 50%);
    background-size: 100% 3px;
    pointer-events: none;
    z-index: 1;
  }

  /* Corners */
  .k4-corner {
    position: absolute;
    z-index: 2;
    pointer-events: none;
  }
  .k4-corner::before,
  .k4-corner::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.06);
  }
  .k4-corner.tl { top: 30px; left: 30px; }
  .k4-corner.tl::before { top: 0; left: 0; width: 40px; height: 1px; }
  .k4-corner.tl::after { top: 0; left: 0; width: 1px; height: 40px; }
  .k4-corner.tr { top: 30px; right: 30px; }
  .k4-corner.tr::before { top: 0; right: 0; width: 40px; height: 1px; }
  .k4-corner.tr::after { top: 0; right: 0; width: 1px; height: 40px; }
  .k4-corner.bl { bottom: 30px; left: 30px; }
  .k4-corner.bl::before { bottom: 0; left: 0; width: 40px; height: 1px; }
  .k4-corner.bl::after { bottom: 0; left: 0; width: 1px; height: 40px; }
  .k4-corner.br { bottom: 30px; right: 30px; }
  .k4-corner.br::before { bottom: 0; right: 0; width: 40px; height: 1px; }
  .k4-corner.br::after { bottom: 0; right: 0; width: 1px; height: 40px; }

  /* Content */
  .k4-loader-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  /* Logo */
  .k4-logo {
    font-size: 80px;
    font-weight: 900;
    letter-spacing: 14px;
    color: var(--oc-white);
    text-transform: uppercase;
    margin-bottom: 12px;
    animation: logoIn 1.2s var(--oc-ease-out-expo) forwards;
    opacity: 0;
    transform: translateY(20px);
    filter: blur(4px);
  }
  @keyframes logoIn {
    to {
      opacity: 1;
      transform: translateY(0);
      letter-spacing: 14px;
      filter: blur(0);
    }
  }
  .k4-logo-accent {
    background: linear-gradient(135deg, #583cdc, #1967ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Subtitle */
  .k4-loader-subtitle {
    font-size: 13px;
    font-weight: 300;
    color: var(--oc-white-50);
    letter-spacing: 6px;
    text-transform: uppercase;
    margin-bottom: 56px;
    animation: fadeUp 0.8s ease-out 0.4s forwards;
    opacity: 0;
  }
  @keyframes fadeUp {
    to { opacity: 0.8; transform: translateY(0); }
    from { opacity: 0; transform: translateY(10px); }
  }

  /* Progress */
  .k4-progress-track {
    width: 320px;
    height: 2px;
    background: rgba(255, 255, 255, 0.06);
    position: relative;
    overflow: visible;
    border-radius: 1px;
  }
  .k4-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #583cdc, #1967ff, #583cdc);
    background-size: 200% 100%;
    border-radius: 1px;
    transition: width 0.3s var(--oc-ease-out-expo);
    animation: shimmer 2s linear infinite;
    box-shadow: 0 0 15px rgba(88, 60, 220, 0.4);
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .k4-progress-dot {
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;
    background: #1967ff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: left 0.3s var(--oc-ease-out-expo);
    box-shadow: 0 0 20px rgba(25, 103, 255, 0.5);
  }

  /* Status text */
  .k4-loader-status {
    margin-top: 24px;
    font-size: 12px;
    font-weight: 400;
    color: var(--oc-white-50);
    letter-spacing: 2px;
  }
  .k4-loader-dots {
    color: var(--oc-primary-500);
  }

  /* Version */
  .k4-loader-version {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.08);
    z-index: 2;
  }
</style>
