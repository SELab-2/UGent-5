import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmissionList from "@/components/submission/SubmissionList.vue"
import {computed, ref} from "vue";

const testSubmissionsQuery = {
    data: ref([]),
    error: ref({message: "testerrormessage"}),
    isLoading: ref(false),
    isError: ref(true),
    setError(value){
        this.isError.value = value
    },
    refetch: vi.fn()
}

vi.mock("@/queries/Submission", () => ({
    useSubmissionsQuery: vi.fn(() => testSubmissionsQuery)
}))

const testGroupQuery = {
    data: ref({project_id: 1})
}

vi.mock("@/queries/Group", () => ({
    useGroupQuery: vi.fn(() => testGroupQuery)
}))

const testProjectQuery = {
    data: ref({id: 1, name: "testproject"}),
    isSuccess: ref(true)
}

vi.mock("@/queries/Project", () => ({
    useProjectQuery: vi.fn(() => testProjectQuery)
}))

vi.mock("@/components/submission/SubmissionCard.vue", () => ({
    default: {
        template: "<div class='submissionCard'></div>"
    }
}))

describe("SubmissionsList", () => {
    it("render if error", async () => {
        const wrapper = mount(SubmissionList, {
            props: {
                groupId: 1
            },
            global: {
                mocks: {
                    sorted: computed(() => {return []})
                }
            }
        })
        expect(wrapper.text()).toContain("testerrormessage")
        testSubmissionsQuery.setError(false)
        await wrapper.vm.$nextTick()
    });
    it("render submissionslist",  () => {
        const wrapper = mount(SubmissionList, {
            props: {
                groupId: 1
            },
            global: {
                mocks: {
                    sorted: computed(() => {return []})
                }
            }
        })
        expect(wrapper.text()).toContain("Indieningen:")
        const VBtn = wrapper.findComponent({name:"VBtn"})
        expect(VBtn.text()).toContain("Nieuwe indiening")
    });
    it("render no submissions", () => {
        const wrapper = mount(SubmissionList, {
            props: {
                groupId: 1
            },
            global: {
                mocks: {
                    sorted: computed(() => {return []})
                }
            }
        })
       expect(wrapper.text()).toContain("Nog geen indieningen")
    });
    it("render with submissions",  () => {
        const wrapper = mount(SubmissionList, {
            props: {
                groupId: 1
            },
            global: {
                mocks: {
                    sorted: computed(() => {return [{id: 1}]})
                }
            }
        })
        expect(wrapper.findComponent(".submissionCard").exists()).toBeTruthy()
    })
})
