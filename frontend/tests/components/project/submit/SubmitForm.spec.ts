import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmitForm from "@/components/project/submit/SubmitForm.vue"
import {ref} from "vue";

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
        template: "<div></div>",
    },
}));


describe("SubmitCard", async () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const wrapper = mount(SubmitForm, {
        props: {
            projectId: 1,
        }
    });

    it("render form", () => {
        const Form = wrapper.findComponent({name: 'VForm'})
        expect(Form).toBeTruthy()
    });

    it("render textarea", () => {
        const Textarea = wrapper.findComponent({name: 'VTextarea'})
        expect(Textarea.text()).toContain("Opmerkingen")
    })

    it("render button", () => {
        const VButton = wrapper.findComponent({name: 'VBtn'})
        expect(VButton.text()).toContain('Indienen')
    })
});
