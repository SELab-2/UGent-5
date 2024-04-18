import { mount } from "@vue/test-utils";
import { expect, describe, it } from "vitest";
import NavButton from "../../../src/components/navigation/NavButton.vue";

describe("NavButton", () => {
    it("render title correctly", () => {
        const wrapper = mount(NavButton, {
            props: {
                icon: "mdhi-home-outline",
                title: "navigation.home",
                goto: "home",
            },
        });
        expect(wrapper.text()).toContain("Hoofdscherm");
    });
});
