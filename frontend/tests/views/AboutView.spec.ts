import { mount } from "@vue/test-utils";
import {expect, describe, it} from "vitest";
import AboutView from "../../src/views/AboutView.vue"


describe("About view", () => {
    const wrapper = mount(AboutView, {});
    it("renders title", () => {
       expect(wrapper.text()).toContain("Over dit project")
    });
    it("render developers", () => {
        const items = wrapper.findAllComponents(".developers")
        expect(items.length).toBe(7)
    });
});
