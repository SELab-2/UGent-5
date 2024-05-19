import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectsView from "../../src/views/SubjectsView.vue"
import {useSubjectsQuery} from "../../src/queries/Subject";
import {ref} from "vue";

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

const testSubjectsQuery = {
    data: ref(),
    isLoading: ref(true),
    isError: ref(true),
    error: ref({as_student: [{}]})
}

vi.mock("@/queries/Subject", () => ({
    useSubjectsQuery: vi.fn(() => testSubjectsQuery)
}))

describe("SubjectsView", () => {
    const wrapper = mount(SubjectsView, {
        default: {
            stubs: ['router-link']
        }
    })
    it("render if error", () => {
        expect(wrapper.text()).toContain("Error:")
    })

})
