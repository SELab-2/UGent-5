import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import ProjectInfo from "@/components/project/ProjectInfo.vue"
import {ref} from "vue";

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

const mockProject = {
    name: "projectname",
    deadline: new Date(2024, 5, 31),
    id: 1,
    description: "this is a testassignment",
    capacity: 2
}

const mockInstructors = [
    {uid: "1", given_name: "instructor 1", surname: "Doe", is_admin: false, is_teacher: false}
]

const mockUser = {uid: "2", given_name: "user 2", surname: "Doe 2", is_admin: false, is_teacher: false}


const mockSubject = {
    name: "subjectname"
}

const mockGroup = {
    id: 2
}

vi.mock("@/components/project/submit/SubmitInfo.vue", () => ({
    default: {
        template: "<div class='submitInfo'></div>",
    },
}));


describe("ProjectInfo", async () => {
    it("render project info no group", () => {
        const wrapper = mount(ProjectInfo, {
            props: {
                project: mockProject,
                group: null,
                instructors: mockInstructors,
                subject: mockSubject,
                user: mockUser
            }
        });
        expect(wrapper.findComponent({name: 'VCard'}).exists()).toBeTruthy()
        expect(wrapper.findComponent('.submitInfo').exists()).toBeFalsy()

        const text = wrapper.text();
        expect(text).toContain("projectname")
        expect(text).toContain("subjectname")
        expect(text).toContain("Capaciteit: 2")
        expect(text).toContain("I. Doe")
        expect(text).toContain("this is a testassignment")

    });
    it("render project info with group", () => {
        const wrapper = mount(ProjectInfo, {
            props: {
                project: mockProject,
                group: mockGroup,
                instructors: mockInstructors,
                subject: mockSubject,
                user: mockUser
            }
        });
        expect(wrapper.findComponent({name: 'VCard'}).exists()).toBeTruthy();
        expect(wrapper.findComponent('.submitInfo').exists()).toBeTruthy();

        const text = wrapper.text();
        expect(text).toContain("projectname")
        expect(text).toContain("subjectname")
        expect(text).toContain("Capaciteit: 2")
        expect(text).toContain("I. Doe")
        expect(text).toContain("this is a testassignment")
    })
});
