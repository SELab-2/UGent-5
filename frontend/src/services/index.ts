import { useAuthStore } from "@/stores/auth-store";

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch data from the API
 * @param endpoint API endpoint
 * @param requestOptions Custom request options
 * @returns Response from the API
 */
export async function authorized_fetch<T>(
    endpoint: string,
    requestOptions: RequestInit
): Promise<T> {
    const { token } = useAuthStore();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...requestOptions,
        headers: {
            Authorization: `${token?.token_type} ${token?.token}`,
            "Content-Type": "application/json",
            ...requestOptions.headers,
        },
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}
