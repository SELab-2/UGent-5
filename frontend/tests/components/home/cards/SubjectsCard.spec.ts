import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectsCard from "@/components/home/cards/SubjectsCard.vue"
import {ref} from "vue";

const testSubjectsQuery = {
    data: ref({as_student: [{id: 1}], as_instructor: []}),
    isLoading: ref(true),
    isError: ref(true),
    setLoading(value){
        this.isLoading.value = value;
    },
    setError(value){
        this.isError.value = value;
    }
}

vi.mock("@/queries/Subject", () => ({
    useSubjectsQuery: vi.fn(() => testSubjectsQuery)
}));

vi.mock("@/components/home/listcontent/SubjectItem.vue", () => ({
    default : {
        template: "<div class='subjectItem'></div>",
    }
}))

describe("SubjectsCard", () => {
    const wrapper = mount(SubjectsCard, {})
    it("render if loading", () => {
        expect(wrapper.findComponent({name: 'HomeScreenSkeletonCard'}).exists()).toBe(true)
    });
    it("render if error", async () => {
        testSubjectsQuery.setLoading(false)
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain("Fout bij het inladen van vakken")
    });
    it("render subjects card", async () => {
        testSubjectsQuery.setError(false)
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain("Mijn vakken")
        expect(wrapper.findComponent(".subjectItem").exists()).toBe(true)
    })
})
