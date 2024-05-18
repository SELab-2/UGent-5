import { mount } from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import HomeScreenSkeletonCard from "@/components/home/cards/HomeScreenSkeletonCard.vue";

describe("HomeScreenSkeletonCard", () => {
    const wrapper = mount(HomeScreenSkeletonCard, {})
    it("render skeletoncard", () => {
        expect(wrapper.findComponent({name: 'VSkeletonLoader'}).exists()).toBeTruthy()
    })
})
