/**
 * THE ULTIMATE SONGS - Elite Music Streaming Experience
 * Developed by: Harsh Patel
 * GitHub: @patelharsh80874
 * Portfolio: patelharsh.in
 * Version: 2.0.0
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    wasm(),
  ],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
});
