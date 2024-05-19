import {mount} from "@vue/test-utils";
import {expect, describe, it} from "vitest";
import StudentsDialog from "@/components/groups/StudentsDialog.vue"

const mockStudents = [
    {id: 1}
]

describe("StudentsDialog", () => {
    const wrapper = mount(StudentsDialog, {
        props: {
            students: mockStudents,
            title: "dialog title"
        }
    })
    it("renders title", () => {
        expect(wrapper.text()).toContain("dialog title")
    });
});
