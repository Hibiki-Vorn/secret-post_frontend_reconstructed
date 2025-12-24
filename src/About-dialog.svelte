<script>
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    let { open = $bindable() } = $props();
</script>

<Dialog
    bind:open
    aria-labelledby="large-scroll-title"
    aria-describedby="large-scroll-content"
    surface$style="width: 850px; border-radius: 20px;"
>
    <Title id="large-scroll-title">About Hieronymus Secret Post</Title>
    <Content id="large-scroll-content">
        <ul>
            <li>
                Secret Post is a secure, zero-knowledge text sharing platform.
            </li>
            <li>
                No registration required: generate encrypted links instantly.
            </li>
            <li>Set expiration times or enable burn-after-read.</li>
            <li>Choose your own password or let us generate one for you.</li>
            <li>
                Completely zero-knowledge: even the server cannot read your
                content.
            </li>
        </ul>
    </Content>
    <Actions>
        <Button action="accept">
            <Label>Close</Label>
        </Button>
    </Actions>
</Dialog>

<style>
</style>
