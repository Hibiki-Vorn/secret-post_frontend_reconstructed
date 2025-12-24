<script>
    // @ts-nocheck
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import HelperText from "@smui/textfield/helper-text";
    import Select, { Option } from "@smui/select";
    import Button, { Label } from "@smui/button";
    import FormField from "@smui/form-field";
    import Textfield from "@smui/textfield";
    import { Range } from "flowbite-svelte";
    import Switch from "@smui/switch";

    let { open = $bindable() } = $props();

    let passwd = $state("");
    let burnAfterRead = $state(false);
    const expiredAfter_list = [
        ["5 min", () => new Date(Date.now() + 5 * 60 * 1000)],
        ["10 min", () => new Date(Date.now() + 10 * 60 * 1000)],
        ["1 hr", () => new Date(Date.now() + 60 * 60 * 1000)],
        ["1 Day", () => new Date(Date.now() + 24 * 60 * 60 * 1000)],
        [
            "1 month",
            () => {
                const d = new Date();
                d.setMonth(d.getMonth() + 1);
                return d;
            },
        ],
        [
            "1 year",
            () => {
                const d = new Date();
                d.setFullYear(d.getFullYear() + 1);
                return d;
            },
        ],
    ];

    let sliderIndex = $state(0);
</script>

<Dialog bind:open surface$style="border-radius: 20px;">
    <Title id="large-scroll-title">Config</Title>
    <Content id="large-scroll-content">
        <h2>
            <span>Burn After Read</span><Switch bind:checked={burnAfterRead} />
        </h2>

        <h2>Expire After</h2>
        <div class="select-container">
            <Range
                min={0}
                max={expiredAfter_list.length - 1}
                step={1}
                bind:value={sliderIndex}
            />
            <p>Selected: {expiredAfter_list[sliderIndex][0]}</p>
        </div>
        <h2>Password</h2>
        <Textfield variant="filled" bind:value={passwd} label="Password">
            {#snippet helper()}
                <HelperText>Use password to encrypt,<br>if no need password leave it blank</HelperText>
            {/snippet}
        </Textfield>
    </Content>
    <Actions>
        <Button
            onclick={() =>
                (window.configArguments = {
                    burnAfterRead,
                    function_expiredAfter: expiredAfter_list[sliderIndex][1],
                    passwd,
                })}
            action="accept"
        >
            <Label>Close</Label>
        </Button>
    </Actions>
</Dialog>
