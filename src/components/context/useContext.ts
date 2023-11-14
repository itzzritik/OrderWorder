import { useContext } from 'react';

import { AdminOrderContext } from './AdminOrder';
import { OrderContext } from './Order';
import { RestaurantContext } from './Restaurant';

export const useRestaurant = () => useContext(RestaurantContext);
export const useOrder = () => useContext(OrderContext);
export const useAdminOrder = () => useContext(AdminOrderContext);
