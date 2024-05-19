import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectsView from "../../src/views/SubjectsView.vue"
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
    error: ref({as_student: [{}]}),
    setError(value){
        this.isError.value = value
    }
}

vi.mock("@/queries/Subject", () => ({
    useSubjectsQuery: vi.fn(() => testSubjectsQuery)
}))

describe("SubjectsView", () => {
    const wrapper = mount(SubjectsView, {
        global: {
            stubs: ['router-link']
        }
    })
    it("render if error", async () => {
        expect(wrapper.text()).toContain("Error:")
        testSubjectsQuery.setError(false)
        await wrapper.vm.$nextTick()
    })
})
