import { mount } from "@vue/test-utils";
import {expect, describe, it} from "vitest";
import SubjectsCard from "@/components/subject/subjects/body/SubjectCard.vue"

describe("subjectsCard", () => {
    const wrapper = mount(SubjectsCard, {
        props: {
            subject: {id: 1, name: "testsubject"},
            role: "student"
        },
        global: {
            stubs: ['router-link']
        }
    })
    it("render card", () => {
        expect(wrapper.findComponent({name: 'router-link'}).exists()).toBeTruthy()
    })
})
