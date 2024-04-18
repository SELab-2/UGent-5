import { config } from "@vue/test-utils";
import i18n from "@/i18n/index.ts";
import vuetify from "@/plugins/vuetify.ts";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createTestingPinia } from "@pinia/testing";

config.global.plugins = [i18n, vuetify, VueQueryPlugin, createTestingPinia()];
