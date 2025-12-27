// @ts-nocheck
import { mount } from 'svelte'
import Write from "./Write.svelte";
import OpenPost from "./OpenPost.svelte";
import "./app.css";

let App

if (window.location.pathname === "/") {
  App = Write;
} else {
  App = OpenPost;
}


const app = mount(App, {
  target: document.body,
})

export default app
