import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import AdminView from "../../src/views/AdminView.vue"
import {computed, ref} from "vue";

vi.mock("@/composables/useIsAdmin");

const testAuthStore = {
    isLoggedIn: ref(true),
    setLoggedIn(value) {
        this.isLoggedIn.value = value;
    },
};

vi.mock("@/stores/auth-store", () => ({
    useAuthStore: vi.fn(() => testAuthStore),
}));

describe("AdminView", async () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const adminStore = await import("@/composables/useIsAdmin");
    adminStore.default = () => ({ isAdmin: computed(() => true) });

    const wrapper = mount(AdminView, {});

    it("render admin panel", () => {
        const VCard = wrapper.findComponent({name: 'VCard'})
        expect(VCard.text()).toContain("Gebruikers")
    });

    it("render search field", () =>{
        const VTextField = wrapper.findComponent({name: "VTextField"})
        expect(VTextField.text()).toContain("Zoeken")
    });

    it("renders table", () => {
        const VDataTableVirtual = wrapper.findComponent({name: "VDataTableVirtual"})
        expect(VDataTableVirtual.text()).toContain("Naam")
        expect(VDataTableVirtual.text()).toContain("UGent ID")
        expect(VDataTableVirtual.text()).toContain("Email")
        expect(VDataTableVirtual.text()).toContain("Is Lesgever")
        expect(VDataTableVirtual.text()).toContain("Is Beheerder")
    });
});
