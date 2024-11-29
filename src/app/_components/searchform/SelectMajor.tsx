import React, { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@nextui-org/react";

interface Major {
    idx: string;
    name: string;
}

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

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}department?id=2&year=${String(year)}&hakgi=${String(hakgi)}`;

    useEffect(() => {
        const fetchMajors = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Failed to fetch majors");
                }

                const data: Major[] = await response.json();
                setMajors(data);
            } catch (err) {
                setError("Failed to load majors");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMajors();
    }, [apiUrl]);

    const getSectionFromName = (name: string): string => {
        const parts = name.split("-");
        return parts.length >= 3 ? parts[2] : "";
    };

    const formatMajorName = (name: string): string => {
        const parts = name.split("-");
        return parts.slice(3).join(" ");
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
                className="max-w-xs"
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
                className="max-w-xs"
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
            className="max-w-xs"
            scrollShadowProps={{
                isEnabled: false,
            }}
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
