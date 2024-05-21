import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import DeadlineItem from "@/components/home/listcontent/DeadlineItem.vue"
import {ref} from "vue";

const testUserProjectSubmissionsQuery = {
    data: ref([
        {date: new Date(2024, 5,17), status: 1}
    ])
}

vi.mock("@/queries/Submission", () => ({
    useUserProjectSubmissionsQuery: vi.fn(() => testUserProjectSubmissionsQuery)
}))

const testSubjectQuery = {
    data: ref({name: "testsubject"}),
    isLoading: ref(false)
}

vi.mock("@/queries/Subject", () => ({
    useSubjectQuery: vi.fn(() => testSubjectQuery)
}))

describe("DeadlineItem",() => {
    const wrapper = mount(DeadlineItem, {
        props: {
            project: ref({
                name: "testproject",
                deadline: new Date(2024, 10, 15),
                id: 1
            })
        }
    })
    it("render item", () => {
        expect(wrapper.text()).toContain("testproject")
        expect(wrapper.text()).toContain("testsubject")
    });
})
