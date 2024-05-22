import { mount } from "@vue/test-utils";
import {expect, describe, it} from "vitest";
import SubjectsHeaderContainer from "@/components/subject/subjectsview/header/SubjectsHeaderContainer.vue"

describe("SubjectsHeaderContainer", () => {
    const wrapper = mount(SubjectsHeaderContainer, {
        props: {
            academicYears: [23],
            subjects: [{role: "student"}]
        },
        global: {
            stubs: ['SubjectsHeaderCard']
        }
    })
    it("render card", () => {
        expect(wrapper.findComponent({name: "SubjectsHeaderCard"}).exists()).toBeTruthy()
    })
})
