export function parsePeriodToArray(periodString: string): number[] {
    const parts = periodString.split(" ").map((part) => part.trim());

    const mtwtf = ["월", "화", "수", "목", "금"];
    const day = parts[0];
    if (!mtwtf.includes(day) || parts.length <= 1) {
        return [50];
    }

    const periods = parts.slice(1).map((part) => parseInt(part, 10));
    if (periods.some((period) => isNaN(period))) {
        return [50];
    }

    const dayIndex = mtwtf.indexOf(day);
    return periods.map((period) => dayIndex * 10 + period - 1);
}

export function reversePeriodToString(periodArray: number[]): string {
    if (periodArray.length === 1 && periodArray[0] === 50) {
        return "알 수 없음";
    }

    const mtwtf = ["월", "화", "수", "목", "금"];

    const result = periodArray.reduce(
        (acc, period) => {
            const dayIndex = Math.floor(period / 10);
            const periodNumber = (period % 10) + 1;
            const day = mtwtf[dayIndex];

            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(periodNumber);

            return acc;
        },
        {} as { [key: string]: number[] }
    );

    const resultString = Object.entries(result)
        .map(([day, periods]) => `${day} ${periods.join(" ")}`)
        .join(" ");

    return resultString || "알 수 없음";
}
