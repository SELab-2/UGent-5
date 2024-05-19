import { mount } from "@vue/test-utils";
import {expect, describe, it} from "vitest";
import SubjectIcon from "@/components/subject/extra/SubjectIcon.vue"

describe("SubjectIcon", () => {
    const wrapper = mount(SubjectIcon, {
        props: {
            role: "student",
            size: "30px"
        }
    })
    it("render icon", () => {
        expect(wrapper.findComponent({name: "VIcon"}).exists()).toBeTruthy()
    })
})
