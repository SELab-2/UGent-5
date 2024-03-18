import "./assets/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";

const vuetify = createVuetify({
    components,
});

createApp(App).use(router).use(createPinia()).use(vuetify).mount("#app");
