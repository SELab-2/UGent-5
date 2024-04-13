import { mount } from '@vue/test-utils'
import {computed, h, ref} from "vue";
import { VLayout } from "vuetify/components";
import { expect, describe, it, vi} from 'vitest'
import NavBar from "@/components/navigation/NavBar.vue"

const mockRouter = {
    push: vi.fn()
};

vi.mock('@/composables/useIsAdmin')
vi.mock('@/stores/auth-store')

// Mock useRouter to return the mock router
vi.mock('vue-router', () => ({
    useRouter: () => mockRouter
}));

describe('NavBar', () => {
    vi.mock('@/stores/auth-store', () => ({
        __esModule: true,
        useAuthStore: () => ({
            isLoggedIn: ref(true),
        }),
    }));

    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    it('renders correct navigations for non admin', async () => {
        const adminStore = await import('@/composables/useIsAdmin')
        adminStore.default = () => ({ isAdmin: computed(() => false) });

        const wrapper = mount(VLayout, {
            slots: {
                default: h(NavBar)
            }
        })

        expect(wrapper.find('[data-test="navigation.home"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.courses"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.projects"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.settings"]').exists()).toBeTruthy();

        expect(wrapper.find('[data-test="navigation.admin"]').exists()).toBeFalsy();
    });

    it('render correct navigations for admin', async () => {
        const adminStore = await import('@/composables/useIsAdmin')
        adminStore.default = () => ({ isAdmin: computed(() => true) });
        const wrapper = mount(VLayout, {
            slots: {
                default: h(NavBar)
            }
        })
        expect(wrapper.find('[data-test="navigation.home"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.courses"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.projects"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.settings"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.admin"]').exists()).toBeTruthy();
    })
})
