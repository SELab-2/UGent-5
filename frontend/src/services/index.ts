import { useAuthStore } from "@/stores/auth-store";
import { storeToRefs } from "pinia";

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
    const { token, isLoggedIn } = storeToRefs(useAuthStore());
    const { refresh } = useAuthStore();
    if (!isLoggedIn) {
        throw new Error("User is not logged in");
    }
    const { "Content-Type": contentType, ...strippedHeaders } = {
        Authorization: `${token.value!.token_type} ${token.value!.token}`,
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
    if (response.status === 401) {
        await refresh();
        throw new Error("Not authenticated");
    } else if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
