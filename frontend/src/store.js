import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/reducers/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;