import "./assets/main.scss";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
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
    theme: {
        defaultTheme: "myTheme",
        themes: {
            myTheme: {
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

app.mount("#app");
