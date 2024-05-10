import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue"
import {ref} from "vue";

const mockProject = {
    name: "projectnaam",
    deadline: new Date(),
    id: 1
}

const mockSubject = {
    name: "subjectnaam"
}

const testSubjectQuery = {
    data: mockSubject,
    isLoading: ref(false)
}

vi.mock("@/queries/Subject", () => ({
    useSubjectQuery: vi.fn(() => testSubjectQuery),
}));


describe("ProjectMiniCard", async () => {
    const wrapper = mount(ProjectMiniCard, {
        props: {
            project: mockProject
        }
    });

    it("render card", () => {
        const Card = wrapper.findComponent({name: 'VCard'})
        expect(Card.exists()).toBeTruthy()
    });

    it("render project name, deadline and subject name", () => {
        expect(wrapper.text()).toContain("projectnaam")
        expect(wrapper.text()).toContain("subjectnaam")
        expect(wrapper.text()).toContain("Deadline:")
    });

    it("render button", () => {
        const VButton = wrapper.findComponent({name: 'VBtn'})
        expect(VButton.text()).toContain("Naar project")
    });
});
