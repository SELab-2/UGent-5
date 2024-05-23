import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import ProjectsView from "@/views/ProjectsView.vue"
import {ref} from "vue";

const mockProjects = {
    as_student: [{id: 1}],
    as_instructor: [{id: 2}],
};

const testProjectsQuery = {
    data: ref(mockProjects),
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
    useProjectsQuery: vi.fn(() => testProjectsQuery),
}));

vi.mock("@/components/project/ProjectMiniCard.vue", () => ({
    default: {
        template: "<div class='projectMiniCard'></div>",
    },
}));

describe("ProjectsView", () => {
    const wrapper = mount(ProjectsView, {});
    it("render if loading", () => {
        expect(wrapper.text()).toContain("Aan het laden...")
    });
    it("render if error", async () => {
        testProjectsQuery.setIsLoading(false)
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Geen projecten teruggevonden.")
    });
    it("render projects view", async () => {
        testProjectsQuery.setIsError(false)
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Mijn projecten")
        const Button = wrapper.findComponent({name: "VBtn"})
        expect(Button.text()).toContain("Afgerond")
    });
});
