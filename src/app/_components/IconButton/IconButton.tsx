import React from 'react';
import { Button } from '@nextui-org/react';
// import { DeleteIcon } from '../Icon/DeleteIcon'

interface IconButtonProps {
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  variant?: 'solid' | 'faded' | 'bordered' | 'light' | 'shadow';
  ariaLabel: string;
  onPress: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, color, variant = 'solid', ariaLabel, onPress }) => {
  return (
    <Button isIconOnly color={color} variant={variant} aria-label={ariaLabel} onPress={onPress}>
      {icon}
    </Button>
  );
};

export default IconButton;