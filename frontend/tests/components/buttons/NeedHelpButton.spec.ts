import {mount} from "@vue/test-utils";
import {expect, describe, it} from "vitest";
import NeedHelpButton from "@/components/buttons/NeedHelpButton.vue"

describe("NeedHelpButton", () => {
    const wrapper = mount(NeedHelpButton, {
        props: {
            email: "test@ugent.be"
        }
    });
    it("renders button", () => {
        const VButton = wrapper.findComponent({name: 'VBtn'})
        expect(VButton.exists()).toBeTruthy()
        expect(VButton.text()).toContain("Hulp nodig")
    })
});
