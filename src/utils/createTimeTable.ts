import { Lecture, LectureGroup } from "./localStorageManager";

export class CreateTimeTable {
    static getValidCombinations(
        groups: LectureGroup[],
        maxCredits: number
    ): {
        [key: string]: Lecture[][];
    } {
        const results: Lecture[][] = [];
        const seenCombinations = new Set<string>();

        function backtrack(index: number, selected: Lecture[], usedClassTimes: Set<number>, currentCredits: number) {
            if (currentCredits > maxCredits) return;

            if (index === groups.length) {
                if (selected.length === groups.length) {
                    const combinationKey = selected
                        .map((lecture) => lecture.sub_num)
                        .sort()
                        .join(",");
                    if (!seenCombinations.has(combinationKey)) {
                        results.push([...selected]);
                        seenCombinations.add(combinationKey);
                    }
                }
                return;
            }

            for (const lecture of groups[index].lectures) {
                if (lecture.classTime.every((time) => time === -1 || !usedClassTimes.has(time))) {
                    lecture.classTime.forEach((time) => {
                        if (time !== -1) {
                            usedClassTimes.add(time);
                        }
                    });
                    selected.push(lecture);
                    backtrack(index + 1, selected, usedClassTimes, currentCredits + lecture.credits);
                    selected.pop();
                    lecture.classTime.forEach((time) => {
                        if (time !== -1) {
                            usedClassTimes.delete(time);
                        }
                    });
                }
            }
        }

        backtrack(0, [], new Set<number>(), 0);

        const classifiedCombinations: { [key: string]: Lecture[][] } = {};

        results.forEach((combination) => {
            const hasMonday = combination.some((lecture) => lecture.classTime.some((time) => time >= 0 && time <= 9));
            const hasTuesday = combination.some((lecture) => lecture.classTime.some((time) => time >= 10 && time <= 19));
            const hasWednesday = combination.some((lecture) => lecture.classTime.some((time) => time >= 20 && time <= 29));
            const hasThursday = combination.some((lecture) => lecture.classTime.some((time) => time >= 30 && time <= 39));
            const hasFriday = combination.some((lecture) => lecture.classTime.some((time) => time >= 40 && time <= 49));

            let key = "";
            if (!hasMonday) key += "월";
            if (!hasTuesday) key += "화";
            if (!hasWednesday) key += "수";
            if (!hasThursday) key += "목";
            if (!hasFriday) key += "금";

            if (key === "") {
                key = "공강 없음";
            }

            if (!classifiedCombinations[key]) {
                classifiedCombinations[key] = [];
            }

            classifiedCombinations[key].push(combination);
        });

        return classifiedCombinations;
    }

    static getIndependentRecommendations(validCombinations: { [key: string]: Lecture[][] }): {
        morningOff: Lecture[][];
        maxDaysOff: Lecture[][];
        noGaps: Lecture[][];
    } {
        const allCombinations = Object.values(validCombinations).flat();

        const recommendations = {
            morningOff: [] as Lecture[][],
            maxDaysOff: [] as Lecture[][],
            noGaps: [] as Lecture[][],
        };

        // 오전 수업 최소화 (최소한의 오전 수업 수만 반환)
        const minMorningLectureCount = Math.min(
            ...allCombinations.map((combination) =>
                combination.reduce((count, lecture) => count + lecture.classTime.filter((time) => [1, 2, 3].includes(time % 10)).length, 0)
            )
        );
        recommendations.morningOff = allCombinations.filter((combination) => {
            const morningLectureCount = combination.reduce(
                (count, lecture) => count + lecture.classTime.filter((time) => [1, 2, 3].includes(time % 10)).length,
                0
            );
            return morningLectureCount === minMorningLectureCount;
        });

        // 최대 공강일 수 (가장 많은 공강일 수만 반환)
        const maxDaysOffCount = Math.max(
            ...allCombinations.map((combination) => {
                const occupiedDays = new Set<number>();
                combination.forEach((lecture) => {
                    lecture.classTime.forEach((time) => {
                        occupiedDays.add(Math.floor(time / 10));
                    });
                });
                return 5 - occupiedDays.size; // 총 5일 중 강의가 있는 날을 빼서 공강일 수 계산
            })
        );
        recommendations.maxDaysOff = allCombinations.filter((combination) => {
            const occupiedDays = new Set<number>();
            combination.forEach((lecture) => {
                lecture.classTime.forEach((time) => {
                    occupiedDays.add(Math.floor(time / 10));
                });
            });
            const daysOffCount = 5 - occupiedDays.size;
            return daysOffCount === maxDaysOffCount;
        });

        // 수업 간 3교시 이상 공백 없는 경우 (모든 요일에 대해 과목 간 공백이 3교시를 넘지 않도록)
        recommendations.noGaps = allCombinations.filter((combination) => {
            const days = Array.from({ length: 5 }, (_, index) => index); // 0: 월, 1: 화, 2: 수, 3: 목, 4: 금

            return days.every((day) => {
                const lecturesForDay = combination.filter((lecture) => lecture.classTime.some((time) => Math.floor(time / 10) === day));

                if (lecturesForDay.length < 2) return true; // 한 요일에 과목이 하나라면 공백은 없는 것으로 간주

                // 각 요일별 수업 시간 정렬 후 공백 확인
                const classTimes = lecturesForDay.flatMap((lecture) => lecture.classTime.filter((time) => Math.floor(time / 10) === day));
                classTimes.sort((a, b) => a - b);

                for (let i = 0; i < classTimes.length - 1; i++) {
                    if (classTimes[i + 1] - classTimes[i] > 3) {
                        return false;
                    }
                }

                return true;
            });
        });

        return recommendations;
    }
}
