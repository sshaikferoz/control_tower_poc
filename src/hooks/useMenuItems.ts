import { useState } from 'react';
import { MenuItem } from '@/types/app';
import { initialMenuItems } from '@/constants/app';

export const useMenuItems = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

    return {
        menuItems,
        setMenuItems,
    };
};