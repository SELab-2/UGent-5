import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
    },
    display: {
        mobileBreakpoint: "lg",
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

export default vuetify
