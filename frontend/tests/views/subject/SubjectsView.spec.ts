import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectsView from "../../../src/views/subject/SubjectsView.vue"
import {ref} from "vue";

const testSubjectsQuery = {
    data: ref({as_student: [{id: 1, academic_year: 23}], as_instructor: []}),
    isLoading: ref(false),
    isError: ref(true),
    error: ref({as_student: [{id: 1}]}),
    setError(value){
        this.isError.value = value
    },
    setData(value){
        this.data.value = value
    }
}

const testCurrentUserQuery = {
    data: ref({is_admin: false, is_teacher: true}),
}

vi.mock("@/queries/User", () => ({
    useCurrentUserQuery: vi.fn(() => testCurrentUserQuery)
}))

vi.mock("@/queries/Subject", () => ({
    useSubjectsQuery: vi.fn(() => testSubjectsQuery)
}))

describe("SubjectsView", () => {
    const wrapper = mount(SubjectsView, {
        global: {
            stubs: ['router-link', 'SubjectCard', 'SubjectsHeaderContainer']
        }
    })
    it("render if error", async () => {
        expect(wrapper.text()).toContain("Error:")
        testSubjectsQuery.setError(false)
        await wrapper.vm.$nextTick()
    })
    it("render subjectsview with subjects", () => {
        expect(wrapper.findComponent({name: "SubjectsHeaderContainer"}).exists()).toBe(true)
        expect(wrapper.findComponent({name: "SubjectCard"}).exists()).toBe(true)
    })
    it("render subjectsview without subjects", async () => {
        testSubjectsQuery.setData({as_student: [], as_instructor: []})
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain("Geen vakken gevonden.")
    })
    it("render if teacher", () => {
        expect(wrapper.findComponent({name: 'router-link'}).exists()).toBe(true)
    })
})
