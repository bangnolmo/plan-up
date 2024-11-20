import React from 'react';
import IconButton from './IconButton';
import { Badge } from '@nextui-org/react';

interface FloatingButtonProps {
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  variant?: 'solid' | 'faded' | 'bordered' | 'light' | 'shadow';
  ariaLabel: string;
  hovermsg: string;
  icon: React.ReactNode;
  content: string | number;
  onPress: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  color,
  variant = 'solid',
  ariaLabel,
  hovermsg,
  icon,
  content,
  onPress,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-50">
        <Badge content={content} shape='circle' color='danger'>
            <IconButton
                color={color}
                variant={variant}
                ariaLabel={ariaLabel}
                hovermsg={hovermsg}
                icon={icon}
                onPress={onPress}
                size='lg'
            />
        </Badge>
    </div>
  );
};

export default FloatingButton;
