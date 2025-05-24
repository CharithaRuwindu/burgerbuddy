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
      
      // Debug logging
      console.log('Adding to cart:', newItem);
      console.log('Current cart items:', state.items);
      
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      console.log('Existing item found:', existingItem);
      
      state.totalQuantity++;
      
      if (!existingItem) {
        // Add new item
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
        // Update existing item
        console.log('Updating existing item quantity');
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
      
      // Recalculate total amount
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
      }
    },
    
    // New action to remove entire item regardless of quantity
    removeItemCompletely(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        // Subtract the entire quantity from totalQuantity
        state.totalQuantity -= existingItem.quantity;
        
        // Remove item entirely
        state.items = state.items.filter(item => item.id !== id);
        
        // Recalculate total amount
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      }
    },
    
    // New action to remove multiple selected items
    removeSelectedItems(state, action) {
      const selectedIds = action.payload;
      
      // Calculate total quantity to subtract
      const itemsToRemove = state.items.filter(item => selectedIds.includes(item.id));
      const quantityToSubtract = itemsToRemove.reduce((total, item) => total + item.quantity, 0);
      
      // Update total quantity
      state.totalQuantity -= quantityToSubtract;
      
      // Remove selected items
      state.items = state.items.filter(item => !selectedIds.includes(item.id));
      
      // Recalculate total amount
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

// Selectors
export const selectCartItems = state => state.cart.items;
export const selectCartTotalQuantity = state => state.cart.totalQuantity;
export const selectCartTotalAmount = state => state.cart.totalAmount;

// Export the reducer as default
export default cartSlice.reducer;