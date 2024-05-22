import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SearchTable from "@/components/user/SearchTable.vue"

describe("SearchTable", async () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    const wrapper = mount(SearchTable, {});
    it("sorts booleans true first", () => {
        const instance = wrapper.vm;
        const sortBoolFunction = (instance as any).sortBool;
        expect(sortBoolFunction(true, true)).toBe(0)
        expect(sortBoolFunction(false, false)).toBe(0)
        expect(sortBoolFunction(false, true)).toBe(1)
        expect(sortBoolFunction(true, false)).toBe(-1)
    })
});
