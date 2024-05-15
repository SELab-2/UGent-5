import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmitCard from "../../../src/components/submission/SubmitCard.vue"
import {ref} from "vue";


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

vi.mock("@/components/submission/SubmitForm.vue", () => ({
    default: {
        template: "<div class='submitForm'></div>",
    },
}));

describe("SubmitCard", async () => {
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
        expect(wrapper.findComponent('.submitForm').exists()).toBeTruthy()
    })
});
