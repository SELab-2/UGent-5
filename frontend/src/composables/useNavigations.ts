import { computed } from "vue";
import useIsAdmin from "@/composables/useIsAdmin";

interface NavigationData {
    icon: string;
    title: string;
    goto: string;
}

const main_navigations: NavigationData[] = [
    { icon: "mdi-home-outline", title: "navigation.home", goto: "home" },
    { icon: "mdi-school-outline", title: "navigation.courses", goto: "about" },
    { icon: "mdi-book-check-outline", title: "navigation.projects", goto: "about" },
    { icon: "mdi-cog-outline", title: "navigation.settings", goto: "about" },
];

const admin_navigations: NavigationData[] = [
    { icon: "mdi-security", title: "navigation.admin", goto: "about" },
];

export default function useNavigations() {
    const { isAdmin } = useIsAdmin();
    const navigations = computed(() => {
        let navs = main_navigations;
        if (isAdmin.value) {
            navs = navs.concat(admin_navigations);
        }
        return navs;
    });
    return { navigations };
}
