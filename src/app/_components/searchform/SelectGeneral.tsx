import React, { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@nextui-org/react";

interface General {
    idx: number;
    name: string;
}

interface SelectGeneralProps {
    selectedGeneral: string;
    onSelectionChange: (general: string) => void;
    year: string;
    hakgi: string;
}

export default function SelectGeneral({ selectedGeneral, onSelectionChange, year, hakgi }: SelectGeneralProps) {
    const [generals, setGenerals] = useState<General[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const headingClasses = "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}department?id=1&year=${year}&hakgi=${hakgi}`;

    useEffect(() => {
        const fetchGenerals = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Failed to fetch general data");
                }

                const data: General[] = await response.json();
                setGenerals(data);
            } catch (err) {
                setError("Failed to load general data");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenerals();
    }, [apiUrl]);

    const getCampusFromName = (name: string): string => {
        const parts = name.split("·");
        return parts[0];
    };

    const getTimeSectionFromName = (name: string): string => {
        const parts = name.split("·");
        if (parts.length > 1) {
            return parts.slice(1).join("·");
        }
        return parts[0];
    };

    const groupedGenerals = generals.reduce(
        (acc, general) => {
            const campus = getCampusFromName(general.name);
            if (!acc[campus]) {
                acc[campus] = [];
            }
            acc[campus].push(general);
            return acc;
        },
        {} as Record<string, General[]>
    );

    if (loading) {
        return (
            <Autocomplete
                isRequired
                label="시간대 구분"
                placeholder="구분을 가져오는 중입니다..."
                variant="bordered"
                value={selectedGeneral}
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
                label="시간대 구분"
                placeholder="구분을 가져올 수 없습니다."
                variant="bordered"
                value={selectedGeneral}
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
            label="시간대 구분"
            placeholder="구분을 입력하세요"
            variant="bordered"
            value={selectedGeneral}
            onSelectionChange={(value) => onSelectionChange(value as string)}
            scrollShadowProps={{
                isEnabled: false,
            }}
            classNames={{
                listboxWrapper: "max-h-[24rem]",
            }}
            autoFocus
        >
            {Object.entries(groupedGenerals).map(([campus, generalsInCampus]) => (
                <AutocompleteSection
                    key={campus}
                    title={campus}
                    classNames={{
                        heading: headingClasses,
                    }}
                >
                    {generalsInCampus.map((general) => (
                        <AutocompleteItem key={general.idx} value={general.name}>
                            {getTimeSectionFromName(general.name)}
                        </AutocompleteItem>
                    ))}
                </AutocompleteSection>
            ))}
        </Autocomplete>
    );
}
