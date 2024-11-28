import React from "react";
import { Badge, Card } from "@nextui-org/react";

interface FloatingButtonProps {
    color: "primary" | "secondary" | "success" | "warning" | "danger";
    icon: React.ReactNode;
    count: number;
    onPress: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ color, icon, count, onPress }) => {
    
    return (
        <div className="fixed bottom-8 right-4 lg:bottom-16 lg:right-20 z-50">
            <Badge size="lg" content={count} shape="circle" color={color} isInvisible={count === 0}>
                <Card shadow="lg" radius="lg" isPressable onPress={onPress} isHoverable>
                    {icon}
                </Card>
            </Badge>
        </div>
    );
};

export default FloatingButton;
