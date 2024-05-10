import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import ProjectView from "@/views/ProjectView.vue"

describe("ProjectView", async () => {
    const wrapper = mount(ProjectView, {
        props: {
            projectId: 1,
        }
    });
});
