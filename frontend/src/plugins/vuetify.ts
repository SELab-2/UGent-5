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
                    surface: "#ffffff",
                    text: "#0E2057",
                    textsecondary: "#868fab",
                    primary: "#1d357e",
                    secondary: "#DFE5F7",
                    tertiary: "#E9EDFA",
                    navtext: "#DFE5F7",
                    // TODO: Add rest of colors
                },
            },
            darkTheme: {
                dark: true,
                colors: {
                    background: "#303030",
                    surface: "#303030",
                    text: "#DFE5F7",
                    textsecondary: "#b2b2b2",
                    primary: "#233161",
                    secondary: "#595D6C",
                    tertiary: "#353740",
                    navtext: "#DFE5F7",
                    // TODO: Add rest of colors
                },
            },
        },
    },
});

export default vuetify;
