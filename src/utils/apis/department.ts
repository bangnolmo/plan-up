export interface General {
    idx: number;
    name: string;
}

export interface Major {
    idx: string;
    name: string;
}

export const fetchGeneralData = async (year: string, hakgi: string): Promise<General[]> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}department?id=1&year=${year}&hakgi=${hakgi}`;

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.error("Access token is missing");
        throw new Error("Access token is missing");
    }

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch general data.");
        }

        const data: General[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching general data:", error);
        throw new Error("Error fetching general data.");
    }
};

export const fetchMajors = async (year: string, hakgi: string): Promise<Major[]> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}department?id=2&year=${year}&hakgi=${hakgi}`;

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.error("Access token is missing");
        throw new Error("Access token is missing");
    }

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch majors.");
        }

        const data: Major[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching majors:", error);
        throw new Error("Error fetching majors.");
    }
};
