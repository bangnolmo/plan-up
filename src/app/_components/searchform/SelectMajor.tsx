import React, { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@nextui-org/react";
import { fetchMajors, Major } from "@/utils/apis/department";

interface SelectMajorProps {
    selectedMajor: string;
    onSelectionChange: (majorIdx: string) => void;
    year: string;
    hakgi: string;
}

export default function SelectMajor({ selectedMajor, onSelectionChange, year, hakgi }: SelectMajorProps) {
    const [majors, setMajors] = useState<Major[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const headingClasses = "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

    useEffect(() => {
        const fetchMajorsData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchMajors(year, hakgi);
                setMajors(data);
            } catch (err) {
                setError("Failed to load majors.");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMajorsData();
    }, [year, hakgi]);

    const getSectionFromName = (name: string): string => {
        const parts = name.split("-");
        return parts.length >= 3 ? parts[2] : "";
    };

    const formatMajorName = (name: string): string => {
        const parts = name.split("-");
        if (parts.length >= 3) {
            return parts.slice(2).join(" ");
        }
        return parts.join(" ");
    };

    const groupedMajors = majors.reduce(
        (acc, major) => {
            const section = getSectionFromName(major.name);
            if (!acc[section]) {
                acc[section] = [];
            }
            acc[section].push(major);
            return acc;
        },
        {} as Record<string, Major[]>
    );

    if (loading) {
        return (
            <Autocomplete
                isRequired
                label="전공 선택"
                variant="bordered"
                placeholder="전공 목록을 가져오는 중입니다..."
                value={selectedMajor}
                disabledKeys={["loading"]}
                onSelectionChange={(value) => onSelectionChange(value as string)}
                scrollShadowProps={{
                    isEnabled: false,
                }}
            >
                <AutocompleteItem key="loading" value="">
                    잠시만 기다려주세요.
                </AutocompleteItem>
            </Autocomplete>
        );
    }

    if (error) {
        return (
            <Autocomplete
                isRequired
                label="전공 선택"
                variant="bordered"
                placeholder="전공 목록을 가져올 수 없습니다."
                value={selectedMajor}
                disabledKeys={["error"]}
                onSelectionChange={(value) => onSelectionChange(value as string)}
                scrollShadowProps={{
                    isEnabled: false,
                }}
            >
                <AutocompleteItem key="error" value="">
                    {error}
                </AutocompleteItem>
            </Autocomplete>
        );
    }

    return (
        <Autocomplete
            isRequired
            label="전공 선택"
            variant="bordered"
            placeholder="전공을 입력하세요"
            value={selectedMajor}
            onSelectionChange={(value) => onSelectionChange(value as string)}
            scrollShadowProps={{
                isEnabled: false,
            }}
            classNames={{
                listboxWrapper: "max-h-[24rem]",
            }}
            autoFocus
        >
            {Object.entries(groupedMajors).map(([section, majorsInSection]) => (
                <AutocompleteSection
                    key={section}
                    title={section}
                    classNames={{
                        heading: headingClasses,
                    }}
                >
                    {majorsInSection.map((major) => (
                        <AutocompleteItem key={major.idx} value={major.name}>
                            {formatMajorName(major.name)}
                        </AutocompleteItem>
                    ))}
                </AutocompleteSection>
            ))}
        </Autocomplete>
    );
}
