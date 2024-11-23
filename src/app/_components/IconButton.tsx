import React from "react";
import { Button, Tooltip } from "@nextui-org/react";
// import { DeleteIcon } from '../Icon/DeleteIcon'

interface IconButtonProps {
    icon: React.ReactNode;
    color: "primary" | "secondary" | "success" | "warning" | "danger";
    variant?: "solid" | "faded" | "bordered" | "light" | "shadow" | "flat";
    size: "sm" | "md" | "lg";
    ariaLabel: string;
    hovermsg: string;
    onPress: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, color, variant = "solid", size = "md", ariaLabel, hovermsg, onPress }) => {
    return hovermsg ? (
        <Tooltip content={hovermsg}>
            <Button isIconOnly={true} color={color} variant={variant} aria-label={ariaLabel} onPress={onPress} size={size}>
                {icon}
            </Button>
        </Tooltip>
    ) : (
        <Button isIconOnly={true} color={color} variant={variant} aria-label={ariaLabel} onPress={onPress} size={size}>
            {icon}
        </Button>
    );
};

export default IconButton;
