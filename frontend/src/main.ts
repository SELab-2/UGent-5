import "./assets/main.scss";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import i18n from "./i18n";

const app = createApp(App);

const pinia = createPinia();

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
    },
    display: {
      mobileBreakpoint: 'lg',
      thresholds: {
        xs: 0,
        sm: 340,
        md: 770,
        lg: 1080,
        xl: 1280,
      },
    },
    theme: {
        defaultTheme: "lightTheme",
        themes: {
            lightTheme: {
                dark: false,
                colors: {
                    background: "#ffffff",
                    surface: "#1d357e",
                    // TODO: Add rest of colors
                },
            },
            darkTheme: {
                dark: true,
                colors: {
                    background: "#222222",
                    surface: "#1d357e",
                    // TODO: Add rest of colors
                },
            },
        },
    },
});

app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(i18n);
app.use(VueQueryPlugin);

app.mount("#app");
