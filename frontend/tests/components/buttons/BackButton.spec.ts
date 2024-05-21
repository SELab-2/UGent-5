import {mount} from "@vue/test-utils";
import {expect, describe, it} from "vitest";
import BackButton from "@/components/buttons/BackButton.vue"

describe("BackButton", () => {
    const wrapper = mount(BackButton, {
        props: {
            title: "group.to_grouppage",
            destination: "/test"
        },
        global: {
            stubs: ["router-link"],
        },
    })
    it("render button", () => {
        expect(wrapper.findComponent({name: "router-link"}).exists()).toBeTruthy()
    });
})
