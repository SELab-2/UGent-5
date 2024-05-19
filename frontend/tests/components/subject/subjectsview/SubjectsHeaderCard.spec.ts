import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import SubjectsHeaderCard from "@/components/subject/subjectsview/SubjectsHeaderCard.vue"

describe("SubjectsHeaderCard", () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    it("render as student"), () => {
        const wrapper = mount(SubjectsHeaderCard, {
            props: {
                academicYears: [23],
                subjects: [{role: "student", subjectData: {id: 1}}]
            }
        })
        expect(wrapper.text()).toContain("Mijn vakken")
        expect(wrapper.text()).toContain("23-24")
    }
    it("render as teacher", () => {
        const wrapper = mount(SubjectsHeaderCard, {
            props: {
                academicYears: [23],
                subjects: [{role: "instructor", subjectData: {id: 1}}, {role: "student", subjectData: {id: 2}}]
            }
        })
        expect(wrapper.text()).toContain("Toon lesgever vakken")
        expect(wrapper.text()).toContain("Toon student vakken")
    });
})
