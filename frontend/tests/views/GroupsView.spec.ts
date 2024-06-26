import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import GroupsView from "@/views/GroupsView.vue"
import {ref} from "vue";

const mockRouter = {
    push: vi.fn(),
};

vi.mock("vue-router", () => ({
    useRouter: () => mockRouter,
}));

const mockProject = {
    name: "testproject"
}

const mockGroups = [
    {id: 1}
]

const mockUser = {
    uid: "student",
    setUid(value){
        this.uid = value;
    }
}

const mockInstructors = [
    {uid: "teacher"}
]

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
    data: mockGroups,
    isLoading: ref(false),
    isError: ref(false),
};

const testCreateGroupsMutation = {
    mutateAsync: vi.fn()
}

vi.mock('@/queries/Group', () => ({
    useProjectGroupsQuery: vi.fn(() => testProjectGroupsQuery),
    useCreateGroupsMutation: vi.fn(() => testCreateGroupsMutation)
}))

const testCurrentUserQuery ={
    data: ref(mockUser),
    isLoading: ref(false),
    isError: ref(false),
}

vi.mock('@/queries/User', () => ({
    useCurrentUserQuery: vi.fn(() => testCurrentUserQuery),
}))

const testSubjectStudentsQuery ={
    isLoading: ref(false),
    isError: ref(false),
}

const testSubjectInstructorsQuery ={
    data: ref(mockInstructors),
    isLoading: ref(false),
    isError: ref(false),
}

vi.mock('@/queries/Subject', () => ({
    useSubjectStudentsQuery: vi.fn(() => testSubjectStudentsQuery),
    useSubjectInstructorsQuery: vi.fn(() => testSubjectInstructorsQuery),
}))

vi.mock("@/components/groups/StudentsDialog.vue", () => ({
    default: {
        template: "<div class='studentsDialog'></div>",
    },
}));

vi.mock("@/components/groups/GroupCard.vue", () => ({
    default: {
        template: "<div class='groupCard'></div>",
    },
}));

describe("GroupsView", () => {
    const wrapper = mount(GroupsView, {
        props: {
            projectId: 1
        },
        global: {
            stubs: ['router-link']
        }
    });

    it("render if loading", () => {
        expect(wrapper.text()).toContain("Aan het laden...")
    });

    it("render if error", async () => {
        testProjectQuery.setIsLoading(false)
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Fout bij het laden van de pagina")
    });

    it("render groupsview", async () => {
        testProjectQuery.setIsError(false)
        await wrapper.vm.$nextTick();
        const text = wrapper.text()
        expect(text).toContain("Project: testproject")
        expect(wrapper.findComponent(".studentsDialog").exists()).toBeTruthy()
        expect(wrapper.findComponent(".groupCard").exists()).toBeTruthy()
    });

    it("render if user is teacher", async () => {
        testCurrentUserQuery.data.value.setUid("teacher")
        await wrapper.vm.$nextTick();
        const button = wrapper.findComponent({name: "VBtn"})
        expect(button.exists()).toBeTruthy()
        expect(button.text()).toContain("Nieuwe groep")
    });
})
