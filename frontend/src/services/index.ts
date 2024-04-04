import { useAuthStore } from "@/stores/auth-store";

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch data from the API
 * @param endpoint API endpoint
 * @param requestOptions Custom request options
 * @param omitContentType Omit the Content-Type header
 * @returns Response from the API
 */
export async function authorized_fetch<T>(
    endpoint: string,
    requestOptions: RequestInit,
    omitContentType: boolean = false
): Promise<T> {
    const { token } = useAuthStore();
    const { "Content-Type": contentType, ...strippedHeaders } = {
        Authorization: `${token?.token_type} ${token?.token}`,
        "Content-Type": "application/json",
        ...requestOptions.headers,
    };

    const headers = omitContentType
        ? strippedHeaders
        : { ...strippedHeaders, "Content-Type": contentType };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...requestOptions,
        headers: headers,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
