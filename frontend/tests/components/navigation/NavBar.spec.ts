import { mount } from '@vue/test-utils'
import {computed, h, ref} from "vue";
import { VLayout } from "vuetify/components";
import { expect, describe, it, vi} from 'vitest'
import NavBar from "@/components/navigation/NavBar.vue"

const mockRouter = {
    push: vi.fn()
};

vi.mock('@/composables/useIsAdmin')

// Mock useRouter to return the mock router
vi.mock('vue-router', () => ({
    useRouter: () => mockRouter
}));

const testAuthStore = {
    isLoggedIn: ref(true),
    setLoggedIn(value) {
        this.isLoggedIn.value = value;
    }
};

vi.mock('@/stores/auth-store', () => ({
    useAuthStore: vi.fn(() => testAuthStore),
}));

describe('NavBar', () => {
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
        expect(wrapper.find('[data-test="navigation.subjects"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.projects"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.settings"]').exists()).toBeTruthy();

        expect(wrapper.find('[data-test="navigation.admin"]').exists()).toBeFalsy();
        expect(wrapper.find('[data-test="navigation.login"]').exists()).toBeFalsy();
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
        expect(wrapper.find('[data-test="navigation.subjects"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.projects"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.settings"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="navigation.admin"]').exists()).toBeTruthy();

        expect(wrapper.find('[data-test="navigation.login"]').exists()).toBeFalsy();
    })

    it('render correct navigations not logged in', async () => {
        const adminStore = await import('@/composables/useIsAdmin')
        adminStore.default = () => ({ isAdmin: computed(() => false) });
        testAuthStore.setLoggedIn(false);
        const wrapper = mount(VLayout, {
            slots: {
                default: h(NavBar)
            }
        })
        expect(wrapper.find('[data-test="navigation.login"]').exists()).toBeTruthy();

        expect(wrapper.find('[data-test="navigation.home"]').exists()).toBeFalsy();
        expect(wrapper.find('[data-test="navigation.courses"]').exists()).toBeFalsy();
        expect(wrapper.find('[data-test="navigation.projects"]').exists()).toBeFalsy();
        expect(wrapper.find('[data-test="navigation.settings"]').exists()).toBeFalsy();
        expect(wrapper.find('[data-test="navigation.admin"]').exists()).toBeFalsy();
    })
})
