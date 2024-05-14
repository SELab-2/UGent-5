import { computed } from "vue";
import useIsAdmin from "@/composables/useIsAdmin";
import { useAuthStore } from "@/stores/auth-store";
import { storeToRefs } from "pinia";

interface NavigationData {
    icon: string;
    title: string;
    goto: string;
}

const noLoginNavigations: NavigationData[] = [
    { icon: "mdi-login", title: "navigation.login", goto: "login" },
];

const main_navigations: NavigationData[] = [
    { icon: "mdi-home-outline", title: "navigation.home", goto: "home" },
    { icon: "mdi-school-outline", title: "navigation.subjects", goto: "subjects" },
    { icon: "mdi-book-check-outline", title: "navigation.projects", goto: "projects" },
    { icon: "mdi-information-outline", title: "navigation.about", goto: "about" },
    { icon: "mdi-cog-outline", title: "navigation.settings", goto: "settings" },
];

const admin_navigations: NavigationData[] = [
    { icon: "mdi-security", title: "navigation.admin", goto: "admin" },
];

export default function useNavigations() {
    const { isLoggedIn } = storeToRefs(useAuthStore());
    const { isAdmin } = useIsAdmin();
    const navigations = computed(() => {
        if (!isLoggedIn.value) {
            return noLoginNavigations;
        }
        const navs = [...main_navigations];
        if (isAdmin.value) {
            navs.push(...admin_navigations);
        }
        return navs;
    });
    return { navigations };
}
