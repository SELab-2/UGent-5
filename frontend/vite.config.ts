import { fileURLToPath, URL } from "node:url";
import { resolve, dirname } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig({
    plugins: [
        vue(),
        VueI18nPlugin({
            // runtimeOnly: false, // fixes possible problems with pluralization
            include: resolve(dirname(fileURLToPath(import.meta.url)), "./src/i18n/locales/**"),
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        https: {
            key: fs.readFileSync("./local-cert/localhost-key.pem"),
            cert: fs.readFileSync("./local-cert/localhost.pem"),
        },
        port: 8080,
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "vitest.setup.ts",
        server: {
            deps: {
                inline: ["vuetify"],
            },
        },
    },
});
