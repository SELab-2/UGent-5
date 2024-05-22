import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectItem from "@/components/home/listcontent/SubjectItem.vue"
import {ref} from "vue";

const testSubjectInstructorsQuery = {
    data: ref([{given_name: "test", surname: "instructor"}]),
    isLoading: ref(false),
}

vi.mock("@/queries/Subject", () => ({
    useSubjectInstructorsQuery: vi.fn(() => testSubjectInstructorsQuery)
}))

describe("SubjectItem", () => {
    const wrapper = mount(SubjectItem, {
        props: {
            subject: ref({name: "testsubject"})
        },
        global: {
            stubs: ['router-link']
        }
    })
    it("render", () => {
        expect(wrapper.findComponent({name: 'router-link'}).exists()).toBeTruthy()
    });
})
