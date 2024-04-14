import "./assets/main.scss";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router";

import vuetify from "@/plugins/vuetify.ts";

import i18n from "./i18n";

const app = createApp(App);

const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(i18n);
app.use(VueQueryPlugin);

app.mount("#app");
