import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SearchTable from "@/components/user/SearchTable.vue"
import {ref} from "vue";

const mockRouter = {
    push: vi.fn(),
};

vi.mock("vue-router", () => ({
    useRouter: () => mockRouter,
}));

const testAuthStore = {
    isLoggedIn: ref(true),
    setLoggedIn(value) {
        this.isLoggedIn.value = value;
    },
};

vi.mock("@/stores/auth-store", () => ({
    useAuthStore: vi.fn(() => testAuthStore),
}));

describe("SearchTable", async () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    const wrapper = mount(SearchTable, {
        props: {
            search: "test",
            users: []
        }
    });
    it("sorts booleans true first", () => {
        const instance = wrapper.vm;
        const sortBoolFunction = (instance as any).sortBool;
        expect(sortBoolFunction(true, true)).toBe(0)
        expect(sortBoolFunction(false, false)).toBe(0)
        expect(sortBoolFunction(false, true)).toBe(1)
        expect(sortBoolFunction(true, false)).toBe(-1)
    })
});
