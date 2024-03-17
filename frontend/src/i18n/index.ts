import { createI18n } from "vue-i18n";

import en from "./locales/en";
import nl from "./locales/nl";

type MessageSchema = typeof nl;

export default createI18n<[MessageSchema], "en" | "nl">({
    locale: "nl", // TODO: don't hardcode this
    fallbackLocale: "en",
    legacy: false,
    globalInjection: true,
    messages: {
        en,
        nl,
    },
});
