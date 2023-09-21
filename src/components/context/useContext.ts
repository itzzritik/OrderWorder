import { useContext } from 'react';

import { RestaurantContext } from './Restaurant';

export const useRestaurant = () => useContext(RestaurantContext);
