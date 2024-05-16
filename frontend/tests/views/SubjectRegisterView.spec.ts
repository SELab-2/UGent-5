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
    data: {name: "testsubject"}
}

vi.mock("@/queries/Subject", () => ({
    useRegisterToSubjectMutation: vi.fn(() => vi.fn()),
    useSubjectUuidQuery: vi.fn(() => testSubjectsUuidQuery)
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
        expect(wrapper.text()).toContain("Registreer bij vak: testsubject")
    })
});
