import { useContext } from 'react';

import { OrderContext } from './Order';
import { RestaurantContext } from './Restaurant';

export const useRestaurant = () => useContext(RestaurantContext);
export const useOrder = () => useContext(OrderContext);
