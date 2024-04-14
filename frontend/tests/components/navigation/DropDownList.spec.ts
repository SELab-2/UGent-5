import { mount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach} from 'vitest'
import DropDownList from '@/components/navigation/DropDownList.vue'
import {ref} from "vue";

const mockRouter = {
    push: vi.fn()
};

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

describe('DropDownMobile', () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);


    it('renders', () => {
        const wrapper = mount(DropDownList, {});
        expect(wrapper.exists()).toBeTruthy();
    });

    it('render dropdown logged in', async () => {
        const wrapper = mount(DropDownList, {});
        expect(wrapper.find('[data-test="logoutButton"]').exists()).toBeTruthy();
        expect(wrapper.find('[data-test="localeSwitcher"]').exists()).toBeTruthy();
    })

    it('render dropdown not logged in', async () => {
        testAuthStore.setLoggedIn(false)
        const wrapper = mount(DropDownList, {});
        expect(wrapper.find('[data-test="logoutButton"]').exists()).toBeFalsy();
        expect(wrapper.find('[data-test="localeSwitcher"]').exists()).toBeTruthy();
    })
})
