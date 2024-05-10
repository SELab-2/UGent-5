import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import ProjectSideBar from "@/components/project/ProjectSideBar.vue"
import {computed} from "vue";

const mockProject = {
    id: 1,
    subject_id: 2,
    capacity: 2
}

const mockSoloProject = {
    id: 2,
    subject_id: 3,
    capacity: 1

}

const mockInstructorsTeacher = [
    {uid: 1, given_name: "instructor 1"}
]

const mockInstructorsStudent = [
    {uid: 2, given_name: "instructor 2"}
]

const mockSubject = {
    name: "subjectname",
    email: "test@email.be"
}

const mockGroup = {
    id: 2
}

const testUserQuery = {
    data: computed(() => {
        return {uid: 1}
    })
}

vi.mock('@/queries/User', () => ({
    useUserQuery: vi.fn(() => testUserQuery),
}));

vi.mock("@/components/buttons/NeedHelpButton.vue", () => ({
    default: {
        template: "<div class='needHelpButton'></div>",
    },
}));

describe("ProjectSideBar", () => {
    it("render buttons student in group", () => {
        const wrapper = mount(ProjectSideBar, {
            props: {
                project: mockProject,
                group: mockGroup,
                instructors: mockInstructorsStudent,
                subject: mockSubject
            },
            global: {
                stubs: ["router-link"],
            },
        });
        expect(wrapper.findComponent('.needHelpButton').exists()).toBeTruthy()
    });
    it("test function isTeacher should be false", () => {
        const wrapper = mount(ProjectSideBar, {
            props: {
                project: mockProject,
                group: mockGroup,
                instructors: mockInstructorsStudent,
                subject: mockSubject
            },
            global: {
                stubs: ["router-link"],
            },
        });
        const isTeacherConst = (wrapper.vm as any).isTeacher;
        expect(isTeacherConst).toBeFalsy()
    });
    it("test function isTeacher should be true", () => {
        const wrapper = mount(ProjectSideBar, {
            props: {
                project: mockProject,
                group: mockGroup,
                instructors: mockInstructorsTeacher,
                subject: mockSubject
            },
            global: {
                stubs: ["router-link"],
            },
        });
        const isTeacherConst = (wrapper.vm as any).isTeacher;
        expect(isTeacherConst).toBeTruthy()
    });
    it("tests function is solo project to be false", () => {
        const wrapper = mount(ProjectSideBar, {
            props: {
                project: mockProject,
                group: mockGroup,
                instructors: mockInstructorsTeacher,
                subject: mockSubject
            },
            global: {
                stubs: ["router-link"],
            },
        });
        const isSoloProjectConst = (wrapper.vm as any).isSoloProject;
        expect(isSoloProjectConst).toBeFalsy()
    });
    it("tests function is solo project to be true", () => {
        const wrapper = mount(ProjectSideBar, {
            props: {
                project: mockSoloProject,
                group: mockGroup,
                instructors: mockInstructorsTeacher,
                subject: mockSubject
            },
            global: {
                stubs: ["router-link"],
            },
        });
        const isSoloProjectConst = (wrapper.vm as any).isSoloProject;
        expect(isSoloProjectConst).toBeTruthy()
    });
});
