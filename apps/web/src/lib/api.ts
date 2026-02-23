import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const session = await getSession();

    // In NextAuth with JWT strategy, the session token is in a cookie.
    // To send it to the backend, we usually need to expose the JWT in the session object
    // or proxy the request through a Next.js API route.
    // For this demo, we'll assume the 'accessToken' is available if configured in callbacks.
    const token = session?.user ? (session.user as any).accessToken : null;
    console.log(`[apiFetch] Calling ${endpoint} with token: ${token ? token.substring(0, 20) + '...' : 'undefined/null'}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
}
