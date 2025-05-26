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
      
      console.log('Adding to cart:', newItem);
      console.log('Current cart items:', state.items);
      
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      console.log('Existing item found:', existingItem);
      
      state.totalQuantity++;
      
      if (!existingItem) {
        const cartItem = {
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
          image: newItem.image
        };
        
        console.log('Adding new item:', cartItem);
        state.items.push(cartItem);
      } else {
        console.log('Updating existing item quantity');
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
      
      console.log('Updated cart state:', {
        itemsCount: state.items.length,
        totalQuantity: state.totalQuantity,
        totalAmount: state.totalAmount
      });
    },
    
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity--;
        
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
        }
        
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      }
    },
    
    removeItemCompletely(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        
        state.items = state.items.filter(item => item.id !== id);
        
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      }
    },
    
    removeSelectedItems(state, action) {
      const selectedIds = action.payload;
      
      const itemsToRemove = state.items.filter(item => selectedIds.includes(item.id));
      const quantityToSubtract = itemsToRemove.reduce((total, item) => total + item.quantity, 0);
      
      state.totalQuantity -= quantityToSubtract;
      
      state.items = state.items.filter(item => !selectedIds.includes(item.id));
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    },
    
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity = state.totalQuantity - existingItem.quantity + quantity;
        
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
        
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      }
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  removeItemCompletely, 
  removeSelectedItems, 
  clearCart, 
  updateQuantity 
} = cartSlice.actions;

export const selectCartItems = state => state.cart.items;
export const selectCartTotalQuantity = state => state.cart.totalQuantity;
export const selectCartTotalAmount = state => state.cart.totalAmount;

export default cartSlice.reducer;