import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import ProjectSideBar from "@/components/project/ProjectSideBar.vue"

const mockProject = {
    name: "projectname",
    deadline: new Date(),
    id: 1,
    description: "this is a testassignment",
    capacity: 2
}

const mockInstructors = [
    {uid: "1", given_name: "instructor 1"}
]

const mockSubject = {
    name: "subjectname"
}

const mockGroup = {
    id: 2
}

describe("ProjectSideBar", () => {
    const wrapper = mount(ProjectSideBar, {
        props: {
            project: mockProject,
            group: mockGroup,
            instructors: mockInstructors,
            subject: mockSubject
        }
    });
});
