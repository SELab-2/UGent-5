import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import GroupButtons from "@/components/buttons/GroupButtons.vue"
import {ref} from "vue";

const mockGroup = {
    members: [
        {uid: "student1"}
    ],
    team_name: "testgroep"
}

const mockMembers = [
    {uid: "student1"}
]

const mockProject = {
    capacity: 3
}

const mockUser = {
    uid: "user"
}

const testUserGroupsQuery = {
    data: ref([
        {project_id: 1, id: 1}
    ])
}

vi.mock('@/queries/Group', () => ({
    useUserGroupsQuery: vi.fn(() => testUserGroupsQuery),
    useLeaveGroupUserMutation: vi.fn(() => vi.fn()),
    useJoinGroupUserMutation: vi.fn(() => vi.fn()),
    useDeleteGroupMutation: vi.fn(() => vi.fn()),
}))


describe("GroupButtons", () => {
    it("function isUserInGroup should be true", () => {
        const wrapper = mount(GroupButtons, {
            props: {
                group: mockGroup,
                project: mockProject,
                user: {uid: "student1"},
                amountOfMembers: 1,
                isTeacher: false,
            }
        })
        const isUserInGroupFunction = (wrapper.vm as any).isUserInGroup;
        expect(isUserInGroupFunction).toBe(true)
    })
    it("function isUserInGroup should be false", () => {
        const wrapper = mount(GroupButtons, {
            props: {
                group: mockGroup,
                project: mockProject,
                user: {uid: "student2"},
                amountOfMembers: 1,
                isTeacher: false,
            }
        })
        const isUserInGroupFunction = (wrapper.vm as any).isUserInGroup;
        expect(isUserInGroupFunction).toBe(false)
    });

    it("function isUserInAnotherGroup should be true", () => {
        const wrapper = mount(GroupButtons, {
            props: {
                group: {id: 2, members: mockMembers},
                project: {id: 1},
                user: mockUser,
                amountOfMembers: 1,
                isTeacher: false,
            }
        })
        const isUserInAnotherGroupFunction = (wrapper.vm as any).isUserInAnotherGroup
        expect(isUserInAnotherGroupFunction).toBe(true);
    });
    it("function isUserInAnotherGroup should be false", () => {
        const wrapper = mount(GroupButtons, {
            props: {
                group: {id: 1, members: mockMembers},
                project: {id: 1},
                user: mockUser,
                amountOfMembers: 1,
                isTeacher: false,
            }
        })
        const isUserInAnotherGroupFunction = (wrapper.vm as any).isUserInAnotherGroup
        expect(isUserInAnotherGroupFunction).toBe(false)
    });

    it("function canLeaveGroup should be True and render", () => {
        const wrapper = mount(GroupButtons, {
            props: {
                group: mockGroup,
                project: {capacity: 3},
                user: {uid: "student1"},
                amountOfMembers: 1,
                isTeacher: false,
            }
        })
        const canLeaveGroupFunction = (wrapper.vm as any).canLeaveGroup
        expect(canLeaveGroupFunction).toBe(true)
        expect(wrapper.text()).toContain("Verlaten")
    });
    it("function canLeaveGroup should be False", () => {
        const wrapper = mount(GroupButtons, {
            props: {
                group: mockGroup,
                project: {capacity: 1},
                user: {uid: "student1"},
                amountOfMembers: 1,
                isTeacher: false,
            }
        })
        const canLeaveGroupFunction = (wrapper.vm as any).canLeaveGroup
        expect(canLeaveGroupFunction).toBe(false)
    });

    it("function canJoinGroup should be True and render", () => {
        const wrapper = mount(GroupButtons, {
            props: {
                group: mockGroup,
                project: {capacity: 2, id: 2},
                user: {uid: "student2"},
                amountOfMembers: 1,
                isTeacher: false,
            }
        })
        const canJoinGroupFunction = (wrapper.vm as any).canJoinGroup
        expect(canJoinGroupFunction).toBe(true)
        expect(wrapper.text()).toContain("Aansluiten")
    });
    it("function canJoinGroup should be false", () => {
        const wrapper = mount(GroupButtons, {
            props: {
                group: mockGroup,
                project: {capacity: 2, id: 2},
                user: {uid: "student2"},
                amountOfMembers: 2,
                isTeacher: false,
            }
        })
        const canJoinGroupFunction = (wrapper.vm as any).canJoinGroup
        expect(canJoinGroupFunction).toBe(false)
    });

    it("render if user is teacher", () => {
        const wrapper = mount(GroupButtons, {
            props: {
                group: mockGroup,
                project: mockProject,
                user: mockUser,
                amountOfMembers: 2,
                isTeacher: true,
            }
        })
        expect(wrapper.text()).toContain("Groep verwijderen")
    });
});
