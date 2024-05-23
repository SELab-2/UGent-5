import { mount } from "@vue/test-utils";
import {expect, describe, it} from "vitest";
import NotFoundView from "../../src/views/NotFoundView.vue"
import blackThemeImg from '@/assets/404_black.png';

describe("NotFoundView", () => {
    const wrapper = mount(NotFoundView, {})
    it("render 404 view", () => {
        expect(wrapper.text()).toContain("Pagina niet gevonden")
        const image = (wrapper.vm as any).imageSrc
        expect(image).toBe(blackThemeImg)
        const theme = (wrapper.vm as any).theme
        expect(theme).toBe("black")
    });
});
