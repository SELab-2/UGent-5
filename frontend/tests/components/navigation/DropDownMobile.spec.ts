import { mount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach} from 'vitest'
import DropDownMobile from '@/components/navigation/DropDownMobile.vue'

describe('DropDownMobile', () => {

    const wrapper = mount(DropDownMobile, {});

    it('render of component', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders button', () => {
        const button = wrapper.find('.menu');
        expect(button.exists()).toBeTruthy();
    })
});
