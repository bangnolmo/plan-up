/* eslint-disable @typescript-eslint/no-explicit-any */

export const fetchLectures = async (detail: string): Promise<any> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}lectures?idx=${detail}`;

    if (typeof window === "undefined") return;
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        throw new Error("No access token found in local storage.");
    }

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch lectures");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching lectures:", error);
        throw new Error("Error fetching lectures");
    }
};
