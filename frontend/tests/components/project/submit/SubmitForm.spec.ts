import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmitForm from "../../../../src/components/submission/SubmitForm.vue"
import {ref} from "vue";

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

vi.mock("@/components/form_elements/FilesInput.vue", () => ({
    default: {
        template: "<div class='filesInput'></div>",
    },
}));


describe("SubmitCard", async () => {
    const wrapper = mount(SubmitForm, {
        props: {
            projectId: 1,
        }
    });

    it("render form", () => {
        const Form = wrapper.findComponent({name: 'VForm'})
        expect(Form.exists()).toBeTruthy()
    });

    it("render files", () => {
        expect(wrapper.findComponent('.filesInput').exists()).toBeTruthy()
    });

    it("render textarea", () => {
        const Textarea = wrapper.findComponent({name: 'VTextarea'})
        expect(Textarea.text()).toContain("Opmerkingen")
    });

    it("render button", () => {
        const VButton = wrapper.findComponent({name: 'VBtn'})
        expect(VButton.text()).toContain('Indienen')
    });
});
