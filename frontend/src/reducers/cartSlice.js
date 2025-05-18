import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      state.totalQuantity++;
      
      if (!existingItem) {
        // Add new item
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
          image: newItem.image
        });
      } else {
        // Update existing item
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
      
      // Recalculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    },
    
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      state.totalQuantity--;
      
      if (existingItem.quantity === 1) {
        // Remove item entirely
        state.items = state.items.filter(item => item.id !== id);
      } else {
        // Decrease quantity
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
      
      // Recalculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    },
    
    clearCart(state) {
      state = {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
      };
      return state;
    },
    
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      // Update total quantity count
      state.totalQuantity = state.totalQuantity - existingItem.quantity + quantity;
      
      // Update item
      existingItem.quantity = quantity;
      existingItem.totalPrice = existingItem.price * quantity;
      
      // Recalculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    }
  }
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;

// Selectors
export const selectCartItems = state => state.cart.items;
export const selectCartTotalQuantity = state => state.cart.totalQuantity;
export const selectCartTotalAmount = state => state.cart.totalAmount;

export default cartSlice.reducer;