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
    data: ref({id: 1, name: "testproject"}),
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
    })
    it("render if submissions")
})
