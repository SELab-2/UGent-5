import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from "fs";

export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        https: {
            key: fs.readFileSync('./local-cert/localhost-key.pem'),
            cert: fs.readFileSync('./local-cert/localhost.pem')
        },
        port: 8080,
    },
})
