<script>
  //@ts-nocheck
  import { Editor } from "@tiptap/core";
  import { onMount, onDestroy } from "svelte";
  import StarterKit from "@tiptap/starter-kit";
  import { Color } from "@tiptap/extension-color";
  import { TextStyle } from "@tiptap/extension-text-style";
  import { FontSize } from "@tiptap/extension-text-style/font-size";

  export class RichEditor extends HTMLElement {
    constructor() {
      super();
      this._shadow = this.attachShadow({ mode: "open" });
      this._editor = null;
      this._editorArea = null;
    }

    connectedCallback() {
      const stylesheet = document.createElement("div");
      stylesheet.innerHTML = `
        <style>
          p {
            margin: 0;
          }
          .ProseMirror {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        </style>
      `;
      const container = document.createElement("div");
      this._editor = new Editor({
        element: container,
        extensions: [
          FontSize.configure({ types: ["textStyle"] }),
          StarterKit.configure({ underline: true }),
          TextStyle,
          Color,
        ],
        content: "",
      });
      this._editorArea = container.firstElementChild;
      this._shadow.append(stylesheet, container);
      this._editorArea.style.border = "2px solid #7f71b8";
      this._editorArea.style.width = "calc( 100% -10px )";
      this._editorArea.style.height = "calc( 100vh - 263px )";
    }

    disconnectedCallback() {
      if (this._editor) {
        this._editor.destroy();
        this._editor = null;
      }
    }

    get html() {
      return this._editor ? this._editor.getHTML() : "";
    }

    isActive(format) {
      return this._editor && this._editor.isActive(format);
    }
  }

  customElements.define("rich-editor", RichEditor);

  import boldIcon from "./assets/format_bold.svg";
  import italicIcon from "./assets/format_italic.svg";
  import underlineIcon from "./assets/format_underline.svg";
  import format_color_text from "./assets/format_color_text.svg";
  import format_size from "./assets/format_size.svg";

  const toggleBold = () =>
    richEditor._editor.chain().focus().toggleBold().run();
  const toggleItalic = () =>
    richEditor._editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () =>
    richEditor._editor.chain().focus().toggleUnderline().run();
  const setColor = (e) => {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.oninput = (e) => {
      richEditor._editor.chain().focus().setColor(e.target.value).run();
    };
    colorPicker.click();
  };
  const setFontSize = (value) => {
    richEditor._editorArea.focus();
    richEditor._editor.chain().focus().setFontSize(value).run();
  };

  let show_FontSizeMenu = $state(false);
  let richEditor = $state(null);
  let sizeSelection = $state(null);
  let fontsize_element = $state(null);

  onMount(() => {
    window._richEditor = richEditor;
    window.addEventListener("click", (e) => {
      if (e.target === fontsize_element) {
        show_FontSizeMenu = !show_FontSizeMenu;
        sizeSelection.style.left =
          fontsize_element.getBoundingClientRect().left + "px";
      } else {
        show_FontSizeMenu = false;
      }
    });
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="toolbar">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_missing_attribute -->
  <img
    src={boldIcon}
    class:active={richEditor?.isActive("bold")}
    onclick={toggleBold}
    title="Bold"
  />
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_missing_attribute -->
  <img
    src={italicIcon}
    class:active={richEditor?.isActive("italic")}
    onclick={toggleItalic}
    title="Italic"
  />
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_missing_attribute -->
  <img
    src={underlineIcon}
    class:active={richEditor?.isActive("underline")}
    onclick={toggleUnderline}
    title="Underline"
  />
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_missing_attribute -->
  <img
    src={format_color_text}
    class="color"
    onclick={setColor}
    title="Font Color"
  />
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_missing_attribute -->
  <span class="fontsize">
    <img src={format_size} bind:this={fontsize_element} title="Font Size" />
    <div
      class="size-selection"
      hidden={!show_FontSizeMenu}
      bind:this={sizeSelection}
    >
      <button onclick={() => setFontSize("12px")}>12</button>
      <button onclick={() => setFontSize("14px")}>14</button>
      <button onclick={() => setFontSize("16px")}>16</button>
      <button onclick={() => setFontSize("18px")}>18</button>
      <button onclick={() => setFontSize("20px")}>20</button>
      <button onclick={() => setFontSize("24px")}>24</button>
    </div>
  </span>
</div>

<rich-editor bind:this={richEditor}></rich-editor>

<style>
  .toolbar {
    gap: 8px;
    padding: 8px;
    background: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    align-items: center;
    height: 30px;
    overflow: scroll;
  }

  rich-editor {
    margin-top: 60px;
  }

  .toolbar img {
    border: none;
    background: white;
    border-radius: 4px;
    padding: 6px;
    cursor: pointer;
  }

  .toolbar::-webkit-scrollbar {
    display: none;
  }

  .toolbar img.active {
    background: #007bff;
    color: white;
  }

  .toolbar img:hover {
    background: #e0e0e0;
  }

  .toolbar .color,
  .toolbar .size-selection {
    border-radius: 4px;
    cursor: pointer;
  }

  .size-selection > button {
    display: block;
  }

  .size-selection {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.7);
  }

  img {
    width: 20px;
    height: 20px;
  }

  button {
    background-color: white;
    border-radius: 4px;
    padding: 10px;
    border: 0;
  }

  button:hover {
    background-color: gainsboro;
  }
</style>
