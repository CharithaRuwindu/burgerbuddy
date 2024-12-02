import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  {
    id: "e4831fc0-51cb-4165-297b-08dcde3b351b",
    qty: "2",
  },
  {
    id: "ebf30b8c-92e6-43a7-eb68-08dcd406e8f8",
    qty: "3",
  },
  {
    id: "06259bbc-2dc7-4a89-eb66-08dcd406e8f8",
    qty: "1",
  },
];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.push(action.payload); // Add new item to the cart
    },
    updateItem: (state, action) => {
      const { id, qty } = action.payload;
      const existingItem = state.find((item) => item.id === id);
      if (existingItem) {
        existingItem.qty = qty; // Update quantity of an existing item
      }
    },
    removeItem: (state, action) => {
      return state.filter((item) => item.id !== action.payload); // Remove item by id
    },
    clearCart: () => {
      return []; // Clear the cart
    },
  },
});

export const { addItem, updateItem, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
