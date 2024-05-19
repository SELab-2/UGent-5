import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import GroupCard from "@/components/groups/GroupCard.vue"

vi.mock("@/components/groups/StudentsDialog.vue", () => ({
    default: {
        template: "<div class='studentsDialog'></div>",
    },
}));

vi.mock("@/components/buttons/GroupButtons.vue", () => ({
    default: {
        template: "<div class='groupButtons'></div>",
    },
}));

const mockGroup = {
    members: [
        {uid: "student1"}
    ]
}

const mockProject = {
    capacity: 3
}

const mockUser = {
    uid: "user"
}

describe("GroupCard", () => {
    it("render group card", () => {
        const wrapper = mount(GroupCard, {
            props: {
                group: mockGroup,
                project: mockProject,
                user: mockUser,
                isTeacher: false,
            }

        })
        expect(wrapper.findComponent(".studentsDialog").exists()).toBeTruthy()
        expect(wrapper.text()).toContain("1/3")
    });
    it("render as student", () => {
        const wrapper = mount(GroupCard, {
            props: {
                group: mockGroup,
                project: mockProject,
                user: mockUser,
                isTeacher: false,
            }

        })
        expect(wrapper.findComponent({name: "VBtn"}).exists()).toBeFalsy()
    });
    it("render as teacher", () => {
        const wrapper = mount(GroupCard, {
            props: {
                group: mockGroup,
                project: mockProject,
                user: mockUser,
                isTeacher: true,
            }

        })
        const button = wrapper.findComponent({name: "VBtn"})
        expect(button.exists()).toBeTruthy()
        expect(button.text()).toContain("Naar groepspagina")
    });
    it("function amountOfMembers", () => {
        const wrapper = mount(GroupCard, {
            props: {
                group: mockGroup,
                project: mockProject,
                user: mockUser,
                isTeacher: false,
            }

        })
        const amountOfMembersFunction = (wrapper.vm as any).amountOfMembers;
        expect(amountOfMembersFunction).toBe(1)
    })
});
