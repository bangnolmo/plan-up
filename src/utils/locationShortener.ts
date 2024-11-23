export const getClassroomInfo = (location: string): string => {
    const classroom = location.split(" ")[0];
    return classroom;
};
