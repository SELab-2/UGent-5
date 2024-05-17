import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectRegisterView from "../../src/views/SubjectRegisterView.vue"
import {ref} from "vue";

const mockRouter = {
    push: vi.fn(),
};

vi.mock("vue-router", () => ({
    useRouter: () => mockRouter,
}));

const testSubjectsUuidQuery = {
    isLoading: ref(false),
    isError: ref(true),
    setError(value){
        this.isError.value = value
    },
    error: ref({message: "test error message"}),
    data: ref({name: "testsubject", id: 1}),
    setData(id){
        this.data.value.id = id
    }
}

const testSubjectsQuery = {
    data: ref({as_student: [
            {id: 2}
        ]})
}

vi.mock("@/queries/Subject", () => ({
    useRegisterToSubjectMutation: vi.fn(() => vi.fn()),
    useSubjectUuidQuery: vi.fn(() => testSubjectsUuidQuery),
    useSubjectsQuery: vi.fn(() => testSubjectsQuery),
}))

describe("SubjectRegisterView", () => {
    const wrapper = mount(SubjectRegisterView, {
        props :{
            uuid: "testuuid"
        }
    })

    it("render error message", () => {
        expect(wrapper.text()).toContain("test error message")
    });
    it("render register view", async () => {
        testSubjectsUuidQuery.setError(false)
        await wrapper.vm.$nextTick()
        const registered = (wrapper.vm as any).registered
        expect(registered).toBe(false)
        expect(wrapper.text()).toContain("Registreer bij vak: testsubject")
    });
    it("render if already registered", async () => {
        testSubjectsUuidQuery.setData(2)
        await wrapper.vm.$nextTick()
        const registered = (wrapper.vm as any).registered
        expect(registered).toBe(true)
        expect(wrapper.text()).toContain("Je bent al ingeschreven voor dit vak.")
    })
});
