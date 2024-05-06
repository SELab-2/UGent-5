import {mount} from "@vue/test-utils";
import {expect, describe, it, vi} from "vitest";
import FilesInput from "@/components/form_elements/FilesInput.vue"
import {ref} from "vue";

const mockRouter = {
    push: vi.fn(),
};

vi.mock("vue-router", () => ({
    useRouter: () => mockRouter,
}));


const testAuthStore = {
    isLoggedIn: ref(true),
    setLoggedIn(value) {
        this.isLoggedIn.value = value;
    },
};

vi.mock("@/stores/auth-store", () => ({
    useAuthStore: vi.fn(() => testAuthStore),
}));

describe("SubmitCard", async () => {
    const ResizeObserverMock = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const wrapper = mount(FilesInput, {
        props: {
            projectId: 1,
        }
    });

    it("render container", () => {
        const Container = wrapper.findComponent({name: 'Vcontainer'})
        expect(Container).toBeTruthy()
    });

    it("render button", () => {
        const VButton = wrapper.findComponent({name: 'VBtn'})
        expect(VButton.text()).toContain("Bestanden toevoegen")
    });

    it("formatbyte should return 0 bytes", () =>{
        const instance = wrapper.vm;
        const formatBytesFunction = (instance as any).formatBytes;
        expect(formatBytesFunction(0)).toBe('0 Bytes')
    });

    it("formatbyte should format bytes with correct size",() => {
        const instance = wrapper.vm;
        const formatBytesFunction = (instance as any).formatBytes;
        expect(formatBytesFunction(1024)).toBe('1 KiB')
        expect(formatBytesFunction(2048)).toBe('2 KiB');
        expect(formatBytesFunction(1048576)).toBe('1 MiB');
        expect(formatBytesFunction(1073741824)).toBe('1 GiB');
    });

    it("formatbyte should format bytes with correct number of decimals", () => {
        const instance = wrapper.vm;
        const formatBytesFunction = (instance as any).formatBytes;
        expect(formatBytesFunction(10002023, 0)).toBe('10 MiB')
        expect(formatBytesFunction(10002023, 1)).toBe('9.5 MiB');
        expect(formatBytesFunction(10002023, 2)).toBe('9.54 MiB');
        expect(formatBytesFunction(10002023, 3)).toBe('9.539 MiB');
        expect(formatBytesFunction(10002023, 4)).toBe('9.5387 MiB');
    });

    it('should trigger file input click when button is clicked', async () => {
        const instance = wrapper.vm;
        const onAddFilesClickFunction = (instance as any).onAddFilesClick;
        const fileInputClickSpy = vi.spyOn(wrapper.vm.$refs.fileInput, 'click');
        onAddFilesClickFunction()
        await wrapper.vm.$nextTick();
        expect(fileInputClickSpy).toHaveBeenCalled();
    });

    it('should update files', () => {
        const instance = wrapper.vm;
        const file = new File(['file contents'], 'file.txt', { type: 'text/plain' });
        const fileInput = wrapper.find('input[type="file"]');
        expect(fileInput.element.files.length).toBe(0)
        expect(fileInput.exists()).toBeTruthy();
        Object.defineProperty(fileInput.element, 'files', { value: [file] });
        const updateFilesFunction = (instance as any).updateFiles;
        updateFilesFunction({ target: fileInput.element });
        expect(fileInput.element.files.length).toBe(1)
    });
});
