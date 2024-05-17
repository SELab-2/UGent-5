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
