import { mount } from '@vue/test-utils'
import { h } from "vue";
import { VLayout } from "vuetify/components";
import { expect, describe, it, vi} from 'vitest'
import NavBar from "@/components/navigation/NavBar.vue"
import {useToggleAdminMutation, useUserQuery} from "../../../src/queries/User";

describe('NavBar', () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    const wrapper = mount(VLayout, {
        slots: {
            default: h(NavBar)
        }
    })
    it('renders the correct main navigations', () => {

        expect(wrapper.find('[data-test="navigation.home"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.courses"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.projects"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.settings"]').exists()).toBeTruthy();

        expect(wrapper.find('[data-test="navigation.admin"]').exists()).toBeFalsy();
    });

    it('render correct navigations for admin', async () => {

        //expect(wrapper.find('[data-test="navigation.admin"]').exists()).toBeTruthy();
    })
})
