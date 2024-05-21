import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {throttle} from "@/utils";

describe('throttle', () => {
    beforeEach(() => {
       vi.useFakeTimers();
    });
    afterEach(() => {
        vi.clearAllTimers();
    });

    it("should call a function immediately", () => {
        const func = vi.fn();
        const throttledFunc = throttle(func, 1000);
        throttledFunc();
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("should call a function only once within the time limit", () => {
        const func = vi.fn();
        const throttledFunc = throttle(func, 1000);
        throttledFunc();
        throttledFunc();
        throttledFunc();
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("should call the function again after the time limit", () => {
        const func = vi.fn();
        const throttledFunc = throttle(func, 1000);
        throttledFunc();
        throttledFunc();
        expect(func).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(1500);
        expect(func).toHaveBeenCalledTimes(2);
    });

    it("should omit subsequent calls within the time limit", () => {
        const func = vi.fn();
        const throttledFunc = throttle(func, 1000);
        throttledFunc();
        throttledFunc();
        throttledFunc();
        throttledFunc();
        vi.advanceTimersByTime(2000);
        expect(func).toHaveBeenCalledTimes(2);
    });
});
