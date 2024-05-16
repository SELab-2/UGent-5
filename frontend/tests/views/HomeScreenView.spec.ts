import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import HomeScreenView from "../../src/views/HomeScreenView.vue"
import {computed, ref} from "vue";

const testUserQuery = {
    data: computed(() => {
        return {given_name: "test", surname: "user"}
    }),
    isLoading: ref(true),
    setLoading(value){
        this.isLoading.value = value;
    }
}

vi.mock('@/queries/User', () => ({
    useUserQuery: vi.fn(() => testUserQuery),
}));


vi.mock("@/components/home/cards/DeadlinesCard.vue", () => ({
    default: {
        template: "<div class='deadlinesCard'></div>",
    },
}));

vi.mock("@/components/home/cards/SubjectsCard.vue", () => ({
    default: {
        template: "<div class='subjectsCard'></div>",
    },
}));

describe("HomeScreenView", () => {
    const wrapper = mount(HomeScreenView, {})
    it("render if loading", () => {
        expect(wrapper.text()).toContain("Loading...")
    });
    it("render homescreen", async() => {
        testUserQuery.setLoading(false)
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain("Welkom test user")
        expect(wrapper.findComponent(".deadlinesCard").exists()).toBeTruthy()
        expect(wrapper.findComponent(".subjectsCard").exists()).toBeTruthy()
    });
});
