/* eslint-disable @typescript-eslint/no-explicit-any */
import { Lecture } from "../localStorageManager";

// 시간표 생성
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
                owner: storedEmail,
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

// 시간표에 강의 추가
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

// user-email로 시간표 조회
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

export const getLecturesByTimeTable = async (tableIdx: number): Promise<Lecture[]> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

    if (typeof window === "undefined") return [];
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.error("Access token is missing");
        throw new Error("Access token is missing");
    }

    try {
        const response = await fetch(`${apiUrl}timeTable/lectures/${tableIdx}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to fetch lectures:", errorData);
            throw new Error("Failed to fetch lectures.");
        }

        const data: Lecture[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching lectures:", error);
        throw new Error("Error fetching lectures.");
    }
};

// 시간표 전체 삭제
export const deleteTimeTable = async (tableIdx: number): Promise<any> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

    if (typeof window === "undefined") return;
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.error("Access token is missing");
        throw new Error("Access token is missing");
    }

    try {
        const response = await fetch(`${apiUrl}timeTable/${tableIdx}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to delete timetable:", errorData);
            throw new Error("Failed to delete timetable.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting timetable:", error);
        throw new Error("Error deleting timetable.");
    }
};

// 시간표에서 특정 강의 삭제 (강의 삭제)
export const deleteLectureFromTimeTable = async (tableIdx: number, classIdx: number): Promise<any> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

    if (typeof window === "undefined") return;

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.error("Access token is missing");
        throw new Error("Access token is missing");
    }

    try {
        const response = await fetch(`${apiUrl}timeTable/lectures`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                table_idx: tableIdx,
                class_idx: classIdx,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to delete lecture:", errorData);
            throw new Error("Failed to delete lecture.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting lecture:", error);
        throw new Error("Error deleting lecture.");
    }
};
