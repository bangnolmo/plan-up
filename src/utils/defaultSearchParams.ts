export function getYear(): number {
    return new Date().getFullYear();
}

export function getSemester(): string {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth <= 6 ? "10" : "20";
}

