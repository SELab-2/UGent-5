import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubmitInfo from "@/components/project/submit/SubmitInfo.vue"
import {computed, ref} from "vue";

const mockGroup = {
    id: 1
}

const mockProject = {
    id: 2
}

const testSubmissionsQuery = {
    data: computed(() => [
        {date: new Date(2024, 5, 5, 22, 0), id: 1, status: 3},
        {date: new Date(2024, 5, 6, 22, 0), id: 2, status: 2}
    ])
}

vi.mock('@/queries/Group', () => ({
    useSubmissionsQuery: vi.fn(() => testSubmissionsQuery),
}));

const mockRouter = {
    push: vi.fn(),
};

vi.mock("vue-router", () => ({
    useRouter: () => mockRouter,
}));

const testAuthStore = {
    isLoggedIn: ref(true),
    setLoggedIn(value) {
        this.isLoggedIn.value = value;
    },
};

vi.mock("@/stores/auth-store", () => ({
    useAuthStore: vi.fn(() => testAuthStore),
}));

const mockLatestSubmission = computed(() => {
    return testSubmissionsQuery.data.value[1]
})

const mockUndefined = computed(() => {
    return undefined
})

describe("SubmitInfo", async () => {
    it("render submit info with submission", () => {
        const wrapper = mount(SubmitInfo, {
            props: {
                group: mockGroup,
                project: mockProject
            },
            global: {
                mocks: {
                    latestSubmission: mockLatestSubmission
                }
            }
        });
        const text = wrapper.text()
        expect(text).toContain("Indieningszone")
        expect(text).toContain("Laatste indiening:")
        expect(text).toContain("Indiening is: Accepted")
        expect(text).toContain("Nieuwe indiening")
        expect(text).toContain("Alle indieningen")
    });
    it("render submit info without submission", () => {
        const wrapper = mount(SubmitInfo, {
            props: {
                group: mockGroup,
                project: mockProject
            },
            global: {
                mocks: {
                    latestSubmission: mockUndefined
                }
            }
        });
        const text = wrapper.text()
        expect(text).toContain("Indieningszone")
        expect(text).toContain("Geen indieningen gevonden.")
        expect(text).toContain("Nieuwe indiening")
        expect(text).toContain("Alle indieningen")
    })
});
