import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmitView from "../../src/views/SubmitView.vue";
import {ref} from "vue";

const testAuthStore = {
    isLoggedIn: ref(true),
    setLoggedIn(value) {
        this.isLoggedIn.value = value;
    },
};

vi.mock("@/stores/auth-store", () => ({
    useAuthStore: vi.fn(() => testAuthStore),
}));

describe("SubmitView", async () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const wrapper = mount(SubmitView, {
        props: {
            projectId: 1
        }
    });

    it("render sumbitcard", () => {
        const SubmitCard = wrapper.findComponent({name: 'SubmitCard'})
        expect(SubmitCard).toBeTruthy()
    });
});
