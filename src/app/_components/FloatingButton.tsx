import React, { useEffect, useState } from "react";
import { Badge, Card } from "@nextui-org/react";
import { getLocalStorageItemCount } from "@/app/_managers/localStorageManager";
import { addLocalStorageListener } from "@/app/_managers/eventListenerManager";

interface FloatingButtonProps {
    color: "primary" | "secondary" | "success" | "warning" | "danger";
    icon: React.ReactNode;
    onPress: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ color, icon, onPress }) => {
    const [data, setData] = useState<number>(0);

    useEffect(() => {
        // 초기 데이터 로드
        const fetchData = () => {
            const localStorageCount = getLocalStorageItemCount("clickedItemData");
            setData(localStorageCount);
        };

        fetchData();

        const unsubscribe = addLocalStorageListener<number>("clickedItemData", fetchData);

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 lg:bottom-16 lg:right-20 z-50">
            <Badge size="lg" content={data} shape="circle" color={color} isInvisible={data === 0}>
                <Card shadow="lg" radius="lg" isPressable onPress={onPress} isHoverable>
                    {icon}
                </Card>
            </Badge>
        </div>
    );
};

export default FloatingButton;
