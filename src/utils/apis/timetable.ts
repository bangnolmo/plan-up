/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Lecture } from "../localStorageManager";

export const createTimeTable = async (scheduleName: string): Promise<any> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

    if (typeof window === "undefined") return;
    const accessToken = localStorage.getItem("access_token");
    const storedEmail = localStorage.getItem("user_email");

    if (!accessToken || !storedEmail) {
        console.error("Access token or user email is missing");
        throw new Error("Access token or user email is missing");
    }

    try {
        const response = await fetch(`${apiUrl}timeTable`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name: scheduleName,
                year: 2024,
                semester: 2,
                owner: storedEmail, // storedEmail을 요청에 추가
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create timetable");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating timetable:", error);
        throw new Error("Error creating timetable");
    }
};

export const addLectureToTimeTable = async (tableIdx: number, classIdx: number, subNum: string): Promise<any> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

    if (typeof window === "undefined") return;
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.error("Access token is missing");
        throw new Error("Access token is missing");
    }

    try {
        const response = await fetch(`${apiUrl}timeTable/lectures`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                table_idx: tableIdx,
                class_idx: classIdx,
                sub_num: subNum,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to insert lecture:", errorData);
            throw new Error("Failed to insert lecture into timetable.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding lecture to timetable:", error);
        throw new Error("Error adding lecture to timetable.");
    }
};

export const getTimeTablesByUserEmail = async (email: string): Promise<any> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

    if (typeof window === "undefined") return;
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.error("Access token is missing");
        throw new Error("Access token is missing");
    }

    try {
        const response = await fetch(`${apiUrl}timeTable?email=${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to fetch timetables:", errorData);
            throw new Error("Failed to fetch timetables.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching timetables:", error);
        throw new Error("Error fetching timetables.");
    }
};
