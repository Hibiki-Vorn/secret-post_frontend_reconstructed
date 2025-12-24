<script>
  let { text  = "Loading..." } = $props();
</script>

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .loading-box {
    background: rgba(0,0,0,0.8);
    padding: 30px 50px;
    border-radius: 10px;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    font-size: 18px;
  }

  /* 转圈动画 */
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

<div class="loading-overlay">
  <div class="loading-box">
    <div class="spinner"></div>
    <div>{text}</div>
  </div>
</div>
