import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: "Secret Post",
      short_name: "Secret Post",
      description: "A secure way to share messages.",
      theme_color: "#7c5cff",
      icons: [
        {
          src: "/pwa-icon.png",
          type: "image/png"
        }
      ]
    }
  })]
})
