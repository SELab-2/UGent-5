import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmissionsTeacherView from "../../src/views/SubmissionsTeacherView.vue"
import {ref} from "vue";

const testProjectSubmissionsQuery = {
    data: ref([{id: 1}]),
    isLoading: ref(false),
    isError: ref(true),
    error: ref({message: "error message"}),
    setError(value){
        this.isError.value = value
    },
    setData(value){
        this.data.value = value
    }
}

vi.mock("@/queries/Submission", () => ({
    useProjectSubmissionsQuery: vi.fn(() => testProjectSubmissionsQuery),
}))

const testProjectQuery = {
    data: ref({id: 1, name: "testproject", deadline: new Date(2025, 5, 31)}),
    isLoading: ref(false)
}

vi.mock("@/queries/Project", () => ({
    useProjectQuery: vi.fn(() => testProjectQuery)
}))


describe("SubmissionsTeacherView", () => {
    const wrapper = mount(SubmissionsTeacherView, {
        props: {
            projectId: 1
        },
        global: {
            stubs: ['SubmissionTeacherCard', 'BackButton']
        }
    })
    it("render if error", async () => {
        expect(wrapper.text()).toContain("error message")
        testProjectSubmissionsQuery.setError(false)
        await wrapper.vm.$nextTick()
    });
    it("render if submissions", async () => {
        const text = wrapper.text()
        expect(text).toContain("Indieningen voor project testproject")
        expect(text).toContain("Deze pagina bevat een lijst van de laatste indiening van elke groep voor dit project.")
        expect(text).toContain("Download alle indieningen")
        expect(wrapper.findComponent({name: "SubmissionTeacherCard"}).exists()).toBeTruthy()
        expect(wrapper.findComponent({name: "BackButton"}).exists()).toBeTruthy()
        testProjectSubmissionsQuery.setData([])
        await wrapper.vm.$nextTick()
    });
    it("render if no submissions", () => {
        expect(wrapper.text()).toContain("Nog geen indieningen")
    });
})
