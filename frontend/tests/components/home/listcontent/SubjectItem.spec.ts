import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectItem from "@/components/home/listcontent/SubjectItem.vue"
import {ref} from "vue";

const testSubjectInstructorsQuery = {
    data: ref([{given_name: "test", surname: "instructor"}]),
    isLoading: ref(true),
    setLoading(value){
        this.isLoading.value = value
    }
}

vi.mock("@/queries/Subject", () => ({
    useSubjectInstructorsQuery: vi.fn(() => testSubjectInstructorsQuery)
}))

describe("SubjectItem", () => {
    const wrapper = mount(SubjectItem, {
        props: {
            subject: ref({name: "testsubject"})
        }
    })
    it("render if loading", () => {
        expect(wrapper.text()).toContain("testsubject")
        expect(wrapper.findComponent({name: "VSkeletonLoader"}))
    });
    it("render subject item", async () => {
        testSubjectInstructorsQuery.setLoading(false)
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain("testsubject")
        expect(wrapper.text()).toContain("test instructor")
    });
})
