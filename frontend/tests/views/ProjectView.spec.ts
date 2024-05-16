import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import ProjectView from "@/views/ProjectView.vue"
import {ref} from "vue";

const testProjectQuery = {
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

vi.mock('@/queries/Group', () => ({
    useProjectGroupQuery: vi.fn(() => testProjectGroupsQuery),
}));

const testSubjectQuery = {
    isLoading: ref(true),
    isError: ref(true),
    setIsError(value){
        this.isError.value = value;
    },
    setIsLoading(value){
        this.isLoading.value = value;
    }
};

const testSubjectInstructorsQuery = {
    isLoading: ref(true),
    isError: ref(true),
    setIsError(value){
        this.isError.value = value;
    },
    setIsLoading(value){
        this.isLoading.value = value;
    }
};

vi.mock('@/queries/Subject', () => ({
    useSubjectQuery: vi.fn(() => testSubjectQuery),
    useSubjectInstructorsQuery: vi.fn(() => testSubjectInstructorsQuery)
}));

vi.mock("@/components/project/ProjectInfo.vue", () => ({
    default: {
        template: "<div class='projectInfoComponent'></div>",
    },
}));

vi.mock("@/components/project/ProjectSideBar.vue", () => ({
    default: {
        template: "<div class='projectSideBar'></div>",
    },
}));

const mockRouter = {
    push: vi.fn(),
};

vi.mock("vue-router", () => ({
    useRouter: () => mockRouter,
}));

const testAuthStore = {
    isLoggedIn: ref(true),
    setLoggedIn(value) {
        this.isLoggedIn.value = value;
    },
};

vi.mock("@/stores/auth-store", () => ({
    useAuthStore: vi.fn(() => testAuthStore),
}));

describe("ProjectView", async () => {
    const wrapper = mount(ProjectView, {
        props: {
            projectId: 1
        }
    });
    it("render if loading", () => {
        expect(wrapper.text()).toContain("Aan het laden...")
    });
    it("render if error", async () => {
        testProjectQuery.setIsLoading(false)
        testSubjectQuery.setIsLoading(false)
        testProjectGroupsQuery.setIsLoading(false)
        testSubjectInstructorsQuery.setIsLoading(false)
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Project niet teruggevonden")
    })
    it("render projectinfo", async () => {
        testProjectQuery.setIsError(false)
        testSubjectQuery.setIsError(false)
        testProjectGroupsQuery.setIsError(false)
        testSubjectInstructorsQuery.setIsError(false)
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent('.projectInfoComponent').exists()).toBeTruthy()
        expect(wrapper.findComponent('.projectSideBar').exists()).toBeTruthy()
    })
});
