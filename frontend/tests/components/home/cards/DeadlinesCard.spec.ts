import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import DeadlinesCard from "@/components/home/cards/DeadlinesCard.vue"
import {ref} from "vue";

const testProjectsQuery = {
    data: ref({as_student: [
            {id: 1, deadline: new Date(2024, 12, 31)}
        ],
        as_instructor: []
    }),
    setData(value){
        this.data.value = value
    }
}

vi.mock("@/queries/Project", () => ({
    useProjectsQuery: vi.fn(() => testProjectsQuery)
}));

vi.mock("@/components/home/listcontent/DeadlineItem.vue", () => ({
    default : {
        template: "<div class='deadlineItem'></div>",
    }
}))

describe("DeadlinesCard", () => {
    const wrapper = mount(DeadlinesCard, {});
    it("render deadlinescard", () => {
        expect(wrapper.text()).toContain("Project deadlines")
        expect(wrapper.findComponent(".deadlineItem").exists()).toBe(true)
    });
    it("render if no deadlines", async () => {
        testProjectsQuery.setData(null)
        await wrapper.vm.$nextTick()
        const filteredProjects = (wrapper.vm as any).filteredProjects
        expect(filteredProjects).toStrictEqual([])
    })
})
