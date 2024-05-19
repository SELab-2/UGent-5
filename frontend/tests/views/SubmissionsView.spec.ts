import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmissionsView from "@/views/SubmissionsView.vue"
import {ref} from "vue";

const testSubmissionsQuery = {
    data: ref([]),
    setData(value){
        this.data.value = value
    },
    error: ref({message: "testerrormessage"}),
    isLoading: ref(false),
    isError: ref(true),
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
    isSucces: ref(true)
}

vi.mock("@/queries/Project", () => ({
    useProjectQuery: vi.fn(() => testProjectQuery)
}))

describe("SubmissionsView", () => {
    const wrapper = mount(SubmissionsView, {
        props: {
            groupId: 1
        }
    })
    it("render if error", () => {
       expect(wrapper.text()).toContain("testerrormessage")
    });
    it("render submissions", async () => {

    });
})
