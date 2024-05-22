import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import GroupView from "@/views/GroupView.vue"
import {ref} from "vue";

const testGroupQuery = {
    data: ref({project_id: 1, id: 1, num: 1, members: [{given_name: "test", surname: "member"}]}),
    isLoading: ref(true),
    isError: ref(true),
    setLoading(value){
        this.isLoading.value = value
    },
    setError(value){
        this.isError.value = value
    },
    setMembers(value) {
        this.data.value.members = value
    }
}

vi.mock("@/queries/Group", () => ({
    useGroupQuery: vi.fn(() => testGroupQuery),
    useRemoveUserFromGroupMutation: vi.fn(() => vi.fn())
}))

const testProjectQuery = {
    data: ref({subject_id: 1, name: "testproject"}),
    isLoading: ref(false),
    isError: ref(false)
}

vi.mock("@/queries/Project", () => ({
    useProjectQuery: vi.fn(() => testProjectQuery)
}))

const testCurrentUserQuery = {
    isLoading: ref(false),
    isError: ref(false),
    data: ref({uid: "testuser"}),
    setUuid(value){
        this.data.value.uid = value
    }
}

vi.mock("@/queries/User", () => ({
    useCurrentUserQuery: vi.fn(() => testCurrentUserQuery)
}))

const testSubjectInstructorsQuery = {
    data: ref([{uid: "testinstructor"}]),
    isLoading: ref(false),
    isError: ref(false)
}

vi.mock("@/queries/Subject", () => ({
    useSubjectInstructorsQuery: vi.fn(() => testSubjectInstructorsQuery)
}))

vi.mock("@/components/buttons/GroupButtons.vue", () => ({
    default: {
        template: "<div class='groupButtons'></div>"
    }
}))

vi.mock("@/components/submission/SubmissionList.vue", () => ({
    default: {
        template: "<div class='submissionList'></div>"
    }
}))

vi.mock("@/components/buttons/BackButton.vue", () => ({
    default: {
        template: "<div class='backButton'></div>"
    }
}))

describe("GroupView", () => {
    const wrapper = mount(GroupView, {
        props: {
            groupId: 1
        }
    })
    it("render if loading", async () => {
        expect(wrapper.text()).toContain("Aan het laden...")
        const isLoadingTrue = (wrapper.vm as any).isLoading
        expect(isLoadingTrue).toBe(true)
        testGroupQuery.setLoading(false)
        await wrapper.vm.$nextTick()
        const isLoadingFalse = (wrapper.vm as any).isLoading
        expect(isLoadingFalse).toBe(false)
    });
    it("render if error", async () => {
        expect(wrapper.text()).toContain("Groep niet gevonden")
        const isErrorTrue = (wrapper.vm as any).isError
        expect(isErrorTrue).toBe(true)
        testGroupQuery.setError(false)
        await wrapper.vm.$nextTick()
        const isErrorFalse = (wrapper.vm as any).isError
        expect(isErrorFalse).toBe(false)
    });
    it("render if student", () => {
        const text = wrapper.text()
        expect(text).toContain("Groep 1")
        expect(text).toContain("Project: testproject")
        expect(text).toContain("test member")
        expect(wrapper.findComponent(".groupButtons").exists()).toBeTruthy()
        expect(wrapper.findComponent(".submissionList").exists()).toBeTruthy()
        expect(wrapper.findComponent(".backButton").exists()).toBeTruthy()
    });
    it("render if teacher", async () => {
        testCurrentUserQuery.setUuid("testinstructor")
        await wrapper.vm.$nextTick()
        const isTeacherFunction = (wrapper.vm as any).isTeacher
        expect(isTeacherFunction).toBe(true)
    });
    it("render if no members", async () => {
        const members = (wrapper.vm as any).amountOfMembers
        expect(members).toBe(1)
        testGroupQuery.setMembers([])
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain("Geen leden teruggevonden.")
        const noMembers = (wrapper.vm as any).amountOfMembers
        expect(noMembers).toBe(0)
    });
})
