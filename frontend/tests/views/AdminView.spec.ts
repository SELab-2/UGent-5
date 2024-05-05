import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import AdminView from "../../src/views/AdminView.vue"
import {computed, ref, nextTick} from "vue";
import User from "../../src/models/User";

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

const mockUser: User = {
    uid: '123456789',
    given_name: 'John',
    mail: 'john@example.com',
    is_teacher: false,
    is_admin: false,
};

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

    it("test sort bool function", () => {
        const instance = wrapper.vm;
        const sortBoolFunction = (instance as any).sortBool;
        expect(sortBoolFunction(true, true)).toBe(0)
        expect(sortBoolFunction(false, false)).toBe(0)
        expect(sortBoolFunction(false, true)).toBe(1)
        expect(sortBoolFunction(true, false)).toBe(-1)
    });

});
