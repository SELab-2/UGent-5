import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmitCard from "@/components/project/submit/SubmitCard.vue"
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

const testProjectQuery = {
    isError: ref(true),
    setIsError(value){
        this.isError.value = value;
    }
};

vi.mock('@/queries/Project', () => ({
    useProjectQuery: vi.fn(() => testProjectQuery),
}));

vi.mock("@/components/project/ProjectMiniCard.vue", () => ({
    default: {
        template: "<div class='projectMiniCard'></div>",
    },
}));

vi.mock("@/components/project/submit/SubmitForm.vue", () => ({
    default: {
        template: "<div class='submitForm'></div>",
    },
}));

describe("SubmitCard", async () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const wrapper = mount(SubmitCard, {
        props: {
            projectId: 1,
        }
    });

    it("render card", () => {
        const Card = wrapper.findComponent({name: 'VCard'})
        expect(Card.exists()).toBeTruthy()
    });

    it("render title", () => {
        expect(wrapper.text()).toContain("Oplossing indienen")
    });

    it("render if error", () => {
        expect(wrapper.text()).toContain("Error");
    });

    it("render if not error", async () => {
        testProjectQuery.setIsError(false);
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent('.projectMiniCard').exists()).toBeTruthy()
        expect(wrapper.text()).toContain("Bestanden")
        expect(wrapper.findComponent('.submitForm').exists()).toBeTruthy()
    })
});
