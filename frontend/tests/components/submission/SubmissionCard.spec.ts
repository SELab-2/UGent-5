import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmissionCard from "@/components/submission/SubmissionCard.vue"
import {ref} from "vue";

const testFilesQuery = {
    data: ref([{filename: "testfile"}]),
    isLoading: ref(false),
    isError: ref(true),
    error: ref({message: "error message"}),
    setError(value){
        this.isError.value = value;
    }
}

vi.mock("@/queries/Submission", () => ({
    useFilesQuery: vi.fn(() => testFilesQuery)
}))

const mockSubmission = ref({id: 1, date: new Date(2024, 4, 15), status: 2, remarks: "testremarks",
                                    testresults: []})

describe("SubmissionCard", () => {
    it("render if error", async () => {
        const wrapper = mount(SubmissionCard, {
            props: {
                submission: mockSubmission,
                deadline: new Date(2024, 5, 12)
            }
        })
        expect(wrapper.text()).toContain("error message")
        testFilesQuery.setError(false)
        await wrapper.vm.$nextTick()
    });
    it("render submissions card", () => {
        const wrapper = mount(SubmissionCard, {
            props: {
                submission: mockSubmission,
                deadline: new Date(2024, 5, 12)
            }
        })
        const text = wrapper.text()
        expect(text).toContain("Status indiening: Accepted")
        expect(text).toContain("testremarks")
        expect(text).toContain("testfile")
    });
    it("render submission after deadline", () => {
        const wrapper = mount(SubmissionCard, {
            props: {
                submission: mockSubmission,
                deadline: new Date(2024, 3, 12)
            }
        })
        expect(wrapper.text()).toContain("Na deadline")
    })
})
