import React, { useEffect, useState } from 'react';
import IconButton from './IconButton';
import { Badge } from '@nextui-org/react';
import { getLocalStorageItemCount } from '@/app/_managers/localStorageManager';
import { addLocalStorageListener } from '@/app/_managers/eventListenerManager';

interface FloatingButtonProps {
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  variant?: 'solid' | 'faded' | 'bordered' | 'light' | 'shadow';
  ariaLabel: string;
  hovermsg: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  color,
  variant = 'solid',
  ariaLabel,
  hovermsg,
  icon,
  onPress,
}) => {
  
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
    <div className="fixed bottom-10 right-20 z-50">
        <Badge content={data} shape='circle' color='danger'>
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
