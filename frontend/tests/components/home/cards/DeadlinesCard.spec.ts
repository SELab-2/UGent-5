import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import DeadlinesCard from "@/components/home/cards/DeadlinesCard.vue";

vi.mock("@/components/home/cards/HomeScreenCard.vue", () => ({
    default: {
        template: "<div class='homeScreenCard'></div>",
    },
}));

describe("DeadlinesCard", () => {
    const wrapper = mount(DeadlinesCard, {})
    it("render deadlinescard", () => {
        expect(wrapper.findComponent(".homeScreenCard").exists()).toBeTruthy()
    });
});
