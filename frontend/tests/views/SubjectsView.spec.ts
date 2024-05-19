import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectsView from "../../src/views/SubjectsView.vue"

vi.mock("@/components/subject/subjectsview/SubjectsHeaderContainer.vue", () => ({
    default: {
        format: "<div class='subjectsHeaderContainer'></div>"
    }
}))

vi.mock("@/components/subject/subjectsview/SubjectCard.vue", () => ({
    default: {
        format: "<div class='subjectCard'></div>"
    }
}))

describe("SubjectsView", () => {
    const wrapper = mount(SubjectsView, {})
})
