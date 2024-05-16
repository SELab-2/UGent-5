import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectsCard from "@/components/home/cards/SubjectsCard.vue";
import {ref} from "vue";

vi.mock("@/components/home/cards/HomeScreenCard.vue", () => ({
    default: {
        template: "<div class='homeScreenCard'></div>",
    },
}));

const testSubjectQuery = {
    isLoading: ref(true),
    isError: ref(true),
    setLoading(value){
        this.isLoading.value =  value;
    },
    setError(value){
        this.isError.value = value;
    }
}

vi.mock("@/queries/Subject", () => ({
    useSubjectQuery: vi.fn(() => testSubjectQuery),
}));

describe("DeadlinesCard", () => {
    const wrapper = mount(SubjectsCard, {})
    it("render deadlinescard", () => {
        expect(wrapper.findComponent(".homeScreenCard").exists()).toBeTruthy()
    });
});
