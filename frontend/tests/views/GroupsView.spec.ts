import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import GroupsView from "@/views/GroupsView.vue"
import {ref} from "vue";
import {useCreateGroupsMutation} from "../../src/queries/Group";

const mockProject = {
    name: "testproject"
}

const testProjectQuery = {
    data: mockProject,
    isLoading: ref(true),
    isError: ref(true),
    setIsError(value){
        this.isError.value = value;
    },
    setIsLoading(value){
        this.isLoading.value = value;
    }
};

vi.mock('@/queries/Project', () => ({
    useProjectQuery: vi.fn(() => testProjectQuery),
}));

const testProjectGroupsQuery = {
    isLoading: ref(true),
    isError: ref(true),
    setIsError(value){
        this.isError.value = value;
    },
    setIsLoading(value){
        this.isLoading.value = value;
    }
};

const testCreateGroupsMutation = {
    mutateAsync: vi.fn()
}

vi.mock('@/queries/Group', () => ({
    useProjectGroupsQuery: vi.fn(() => testProjectGroupsQuery),
    useCreateGroupsMutation: vi.fn(() => testCreateGroupsMutation)
}))

const testUserQuery ={
    isLoading: ref(true),
    isError: ref(true),
    setIsError(value){
        this.isError.value = value;
    },
    setIsLoading(value){
        this.isLoading.value = value;
    }
}

vi.mock('@/queries/User', () => ({
    useUserQuery: vi.fn(() => testUserQuery),
}))

const testSubjectStudentsQuery ={
    isLoading: ref(true),
    isError: ref(true),
    setIsError(value){
        this.isError.value = value;
    },
    setIsLoading(value){
        this.isLoading.value = value;
    }
}

vi.mock('@/queries/Subject', () => ({
    useSubjectStudentsQuery: vi.fn(() => testSubjectStudentsQuery),
}))

describe("GroupsView", () => {
    const wrapper = mount(GroupsView, {
        props: {
            projectId: 1
        }
    });

    it("render if loading", () => {
        expect(wrapper.text()).toContain("Aan het laden...")
    })
})
