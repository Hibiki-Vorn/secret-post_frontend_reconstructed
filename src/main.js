// @ts-nocheck
import { mount } from 'svelte'
import App from './App.svelte'
import "./app.css";

window.chrome = {};


const app = mount(App, {
  target: document.body,
})

export default app
