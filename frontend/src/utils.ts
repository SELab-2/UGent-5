import { authorized_fetch } from "./services";

export async function download_file(url: string, filename: string) {
    const data = await authorized_fetch<Response>(url, { method: "GET" }, { toJson: false }).then(
        (response) => response.blob()
    );

    const objectUrl = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
}

type ThrottledFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ThrottledFunction<T> {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number;

    return function (this: any, ...args: Parameters<T>) {
        const context = this;

        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(
                function () {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                },
                limit - (Date.now() - lastRan)
            );
        }
    };
}
