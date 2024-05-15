import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmitView from "../../src/views/SubmitView.vue";

vi.mock("@/components/submission/SubmitCard.vue", () => ({
    default: {
        template: "<div class='submitCard'></div>",
    },
}));

describe("SubmitView", async () => {
    const wrapper = mount(SubmitView, {
        props: {
            projectId: 1
        }
    });

    it("render sumbitcard", () => {
        const SubmitCard = wrapper.findComponent('.submitCard')
        expect(SubmitCard.exists()).toBeTruthy()
    });
});
