import { dayMapping } from "@/app/_configs/cartInfo";

export const enClassTime = (classTimeInfo: string): number[] => {
    const dayInfo = classTimeInfo.split(" ");
    const day = dayMapping[dayInfo[0] as keyof typeof dayMapping];
    const encodingTimeInfo = dayInfo.slice(1).map((value) => day + parseInt(value));
    return encodingTimeInfo;
};
