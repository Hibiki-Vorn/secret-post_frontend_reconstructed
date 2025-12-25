<script>
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import HelperText from "@smui/textfield/helper-text";
    import { fetchResult, decrypto } from "./script";
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import Loading from "./Loading.svelte";
    import DOMPurify from "dompurify";
    import LZString from "lz-string";

    // @ts-ignore
    let { open = $bindable() } = $props();
    let passwd = $state("");
    let loadingText = $state("");
    let decrypted_html = $state("");
    let open_state = $state({
        openThePost: window.location.pathname !== "/",
        passwdInput: false,
    });
</script>

{#if loadingText}
    <Loading text={loadingText} />
{/if}

<Dialog
    open={open_state.openThePost}
    aria-labelledby="large-scroll-title"
    aria-describedby="large-scroll-content"
    surface$style="border-radius: 20px;"
>
    <Title id="large-scroll-title">To see this post</Title>
    <Content>
        <div>Would you like to open this message?</div>
    </Content>
    <Actions>
        <Button
            onclick={() => {
                window.location.href = "/";
            }}
        >
            <Label>Cancel</Label>
        </Button>

        <Button
            onclick={async () => {
                open_state.openThePost = false;
                if (
                    JSON.parse(
                        LZString.decompressFromBase64(
                            window.location.pathname.replace(/^\/+/, ""),
                        ),
                    ).passwd === null
                ) {
                    open_state.passwdInput = true;
                } else {
                    const result = await fetchResult(
                        window.location.pathname.replace(/^\/+/, ""),
                    );
                    loadingText = "Decrypting...";
                    setTimeout(() => {
                        decrypted_html = decrypto(
                            result,
                            window.location.pathname.replace(/^\/+/, ""),
                            passwd,
                        );
                        loadingText = "";
                    }, 10);
                }
            }}
        >
            <Label>Open</Label>
        </Button>
    </Actions>
</Dialog>

<Dialog
    open={open_state.passwdInput}
    aria-labelledby="large-scroll-title"
    aria-describedby="large-scroll-content"
    surface$style="border-radius: 20px;"
>
    <Title id="large-scroll-title">To see this post</Title>
    <Content>
        <div>This is an encrypted post.</div>
        <br />
        <Textfield variant="filled" bind:value={passwd} label="Password">
            {#snippet helper()}
                <HelperText>Enter the password to decrypt the post</HelperText>
            {/snippet}
        </Textfield>
    </Content>
    <Actions>
        <Button
            onclick={async () => {
                const result = await fetchResult(
                    window.location.pathname.replace(/^\/+/, ""),
                );
                console.log(result);
                if (passwd === "") {
                    passwd = null;
                }
                loadingText = "Decrypting...";
                setTimeout(() => {
                    decrypted_html = decrypto(
                        result,
                        window.location.pathname.replace(/^\/+/, ""),
                        passwd,
                    );
                    loadingText = "";
                }, 10);
            }}
        >
            <Label>Decrypt</Label>
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
        <a href="/">
            <Button>Write your own</Button>
        </a>
    </div>
    <div class="text-area">
        {@html DOMPurify.sanitize(decrypted_html)}
    </div>
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
        width: calc(100% - 15px);
        margin-top: 10px;
        padding: 0.5rem;
        border-radius: 10px;
        height: calc(100vh - 200px);
    }
</style>
