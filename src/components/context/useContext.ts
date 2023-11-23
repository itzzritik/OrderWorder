import { useContext } from 'react';

import { AdminContext } from './Admin';
import { OrderContext } from './Order';
import { RestaurantContext } from './Restaurant';

export const useRestaurant = () => useContext(RestaurantContext);
export const useOrder = () => useContext(OrderContext);
export const useAdmin = () => useContext(AdminContext);
