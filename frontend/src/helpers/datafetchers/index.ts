import { useAuthStore } from "@/stores/auth-store";

/**
 * Request options for the fetch function
 * @param method: HTTP method
 * @param headers: Request headers
 * @param body: Request body
 */
export interface RequestOptions {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    headers?: Object;
    body?: string;
}

const { token } = useAuthStore();

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch data from the API
 * @param endpoint: API endpoint
 * @param requestOptions: Custom request options
 * @returns Response from the API
 */
export async function authorized_fetch<T>(endpoint: string, requestOptions: RequestOptions): Promise<T> {
    return await fetch(`${BASE_URL}${endpoint}`, {
        ...requestOptions,
        headers: { Authorization: `${token?.token_type} ${token?.token}` },
    }).then((response) => response.json());
}
