<script>
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import ConfigDialog from "./Config-dialog.svelte";
  import AboutDialog from "./About-dialog.svelte";
  import Button, { Label } from "@smui/button";
  import { sendEncrypted } from "./script";
  import Loading from "./Loading.svelte";
  import Editor from "./Editor.svelte";

  // @ts-ignore
  let loadingText = $state("");
  let output = $state("");
  let configTimes = 0;
  let open_state = $state({
    about: false,
    config: false,
  });
</script>

{#if loadingText}
  <Loading text={loadingText} />
{/if}

<Dialog
  open={output !== ""}
  aria-labelledby="large-scroll-title"
  aria-describedby="large-scroll-content"
  surface$style="border-radius: 20px;"
>
  <Title id="large-scroll-title">Please copy this URL</Title>
  <Content id="large-scroll-content">
    <input
      type="text"
      value={window.location.origin + "/" + output}
      onchange={() => {
        this.target.value = window.location.origin + "/" + output;
      }}
      onfocus={e => {
        e.currentTarget.select();
      }}
    />
    <p>Press Ctrl+C to copy the URL</p>
  </Content>
  <Actions>
    <Button action="accept" onclick={() => (window.location.reload())}>
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>

<div class="main">
  <!-- svelte-ignore a11y_missing_attribute -->
  <div class="title">
    <img src="/pwa-icon.png" class="icon" />
    <span>Secret Post</span>
  </div>
  <div class="function-bar">
    <Button onclick={() => (open_state.about = true)}>About</Button>
    <Button
      onclick={() => {
        open_state.config = true;
        configTimes++;
      }}>Config</Button
    >
    <Button
      onclick={async () => {
        if (configTimes === 0) {
          open_state.config = true;
          configTimes++;
          let waiting = setInterval(() => {
            if (!open_state.config) {
              clearInterval(waiting);

              loadingText = "Sending...";
              setTimeout(() => {
                sendEncrypted().then(op => {
                  loadingText = "";
                  output = op;
                  console.log(output);
                });
              }, 10);
            }
          }, 10);
          return;
        }
        loadingText = "Sending...";
        setTimeout(() => {
          sendEncrypted().then(op => {
            loadingText = "";
            output = op;
            console.log(output);
          });
        }, 10);
      }}>Send</Button
    >
  </div>
  <div class="text-area">
    <Editor />
  </div>
  <AboutDialog bind:open={open_state.about} />
  <ConfigDialog bind:open={open_state.config} />
</div>

<style>
  .icon {
    width: 60px;
    height: 60px;
    border-radius: 20px;
    box-shadow: 0 10px 20px #02061799;
  }
  .title {
    display: flex;
    height: 60px;
    color: white;
    margin: 1rem 0;
    font-size: xx-large;
    font-weight: bolder;
  }
  .title > span {
    padding: 10px 20px;
    align-items: center;
  }
  .main {
    width: 90vw;
    height: 100vh;
    margin-left: calc(10vw / 2);
  }
  .function-bar {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 14px;
    box-shadow: 0 18px 40px #02061799;
  }
  .text-area {
    background-color: white;
    width: calc(100% - 10px);
    margin-top: 10px;
    padding: 0.5rem;
    border-radius: 10px;
    height: calc( 100vh - 200px );
  }
</style>
