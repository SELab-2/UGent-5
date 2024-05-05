import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import AdminView from "../../src/views/AdminView.vue"
import {computed} from "vue";

vi.mock("@/composables/useIsAdmin");


describe("AdminView", () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    it("render search field", async () => {
        const adminStore = await import("@/composables/useIsAdmin");
        adminStore.default = () => ({ isAdmin: computed(() => true) });

        const wrapper = mount(AdminView, {});
        console.log(wrapper.html())
    });
});
