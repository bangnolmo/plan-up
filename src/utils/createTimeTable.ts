import { Lecture, LectureGroup } from "./localStorageManager";

export class CreateTimeTable {
    static getValidCombinations(
        groups: LectureGroup[],
        maxCredits: number
    ): {
        [key: string]: Lecture[][];
    } {
        const results: Lecture[][] = [];
        const seenCombinations = new Set<string>(); // 중복 조합을 방지하기 위한 Set

        function backtrack(index: number, selected: Lecture[], usedClassTimes: Set<number>, currentCredits: number) {
            if (currentCredits > maxCredits) return;

            if (index === groups.length) {
                if (selected.length === groups.length) {
                    // 중복되지 않는 조합을 확인하기 위해 key 생성
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
                // -1 시간대는 중복되어도 괜찮으므로, -1을 제외한 시간들만 중복 여부를 검사
                if (lecture.classTime.every((time) => time === -1 || !usedClassTimes.has(time))) {
                    // 중복이 아닌 시간대를 usedClassTimes에 추가 (-1은 추가하지 않음)
                    lecture.classTime.forEach((time) => {
                        if (time !== -1) {
                            usedClassTimes.add(time);
                        }
                    });
                    selected.push(lecture);
                    backtrack(index + 1, selected, usedClassTimes, currentCredits + lecture.credits);
                    selected.pop();
                    // 백트래킹 후 usedClassTimes에서 제거 (-1은 제거하지 않음)
                    lecture.classTime.forEach((time) => {
                        if (time !== -1) {
                            usedClassTimes.delete(time);
                        }
                    });
                }
            }
        }

        backtrack(0, [], new Set<number>(), 0);

        // 시간표 조합을 요일별로 구분
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
}