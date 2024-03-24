import { createI18n } from "vue-i18n";

import en from "./locales/en";
import nl from "./locales/nl";

type MessageSchema = typeof nl;
type supportedLocales = "en" | "nl";

export default createI18n<[MessageSchema], supportedLocales>({
    locale: "nl", // TODO: don't hardcode this
    fallbackLocale: "en",
    legacy: false,
    globalInjection: true,
    messages: {
        en,
        nl,
    },
    datetimeFormats: {
        en: {
            short: {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }
        },
        nl: {
            short: {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }
        }
    }
});
