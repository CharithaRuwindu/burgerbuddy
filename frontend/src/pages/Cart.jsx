import { ImBin } from '../utils/Imports';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, selectCartItems, selectCartTotalQuantity, selectCartTotalAmount, removeSelectedItems } from '../reducers/cartSlice';
import CartRow from '../components/CartRow';
import { useState, useEffect } from 'react';

const Cart = () => {
    const dispatch = useDispatch();
    
    // Use selectors to get cart data from Redux
    const cartItems = useSelector(selectCartItems);
    const totalQuantity = useSelector(selectCartTotalQuantity);
    const totalAmount = useSelector(selectCartTotalAmount);
    
    // Local state for checkbox management
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    
    const deliveryCharges = 350.00;
    
    // Calculate subtotal only for selected items
    const selectedSubtotal = cartItems.reduce((total, item) => {
        if (selectedItems.has(item.id)) {
            return total + (item.price * item.quantity);
        }
        return total;
    }, 0);
    
    const finalTotal = selectedSubtotal + (selectedSubtotal > 0 ? deliveryCharges : 0);

    // Update selectAll state when individual items are selected/deselected
    useEffect(() => {
        if (cartItems.length > 0) {
            const allSelected = cartItems.every(item => selectedItems.has(item.id));
            setSelectAll(allSelected);
        } else {
            setSelectAll(false);
            setSelectedItems(new Set());
        }
    }, [selectedItems, cartItems]);

    const handleSelectAll = () => {
        if (selectAll) {
            // Deselect all
            setSelectedItems(new Set());
        } else {
            // Select all
            const allIds = new Set(cartItems.map(item => item.id));
            setSelectedItems(allIds);
        }
    };

    const handleItemSelect = (itemId, isSelected) => {
        const newSelectedItems = new Set(selectedItems);
        if (isSelected) {
            newSelectedItems.add(itemId);
        } else {
            newSelectedItems.delete(itemId);
        }
        setSelectedItems(newSelectedItems);
    };

    const handleDeleteSelected = () => {
        if (selectedItems.size > 0) {
            dispatch(removeSelectedItems(Array.from(selectedItems)));
            setSelectedItems(new Set());
        }
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        setSelectedItems(new Set());
    };

    return (
        <div className="flex justify-center overflow-auto h-[92vh]" style={{ backgroundColor: '#F6F6F6' }}>
            <div className='mt-[5%] w-[60%]'>
                <div className='h-[8%] flex items-center text-slate-600 bg-white rounded-xl shadow-lg'>
                    <input 
                        type="checkbox" 
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className='ml-7' 
                    />
                    <div className='ml-3'>Select All</div>
                    <div 
                        className={`ml-auto mr-5 flex cursor-pointer hover:text-red-400 ${
                            selectedItems.size === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={selectedItems.size > 0 ? handleDeleteSelected : undefined}
                    >
                        <div className='content-center mr-2'><ImBin /></div>
                        <div>Delete Selected ({selectedItems.size})</div>
                    </div>
                </div>
                
                <div className='bg-white rounded-xl shadow-lg pb-5 mt-[2%]'>
                    {cartItems.length === 0 ? (
                        <div className='text-center py-10 text-gray-500'>
                            Your cart is empty
                        </div>
                    ) : (
                        <table className='w-full pt-1 border-separate border-spacing-y-4'>
                            <thead className='font-semibold h-10'>
                                <tr className='text-center'>
                                    <td className='w-[7%]'></td>
                                    <td className='w-[22%]'>Food Item</td>
                                    <td className='w-[21%]'>Price</td>
                                    <td className='w-[21%]'>Quantity</td>
                                    <td className='w-[21%]'>Total Price (LKR)</td>
                                    <td className='w-[8%]'></td>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((cartItem) => (
                                    <CartRow 
                                        key={cartItem.id}
                                        menu_ID={cartItem.id}
                                        itemImage={cartItem.image}
                                        name={cartItem.name}
                                        price={cartItem.price}
                                        qty={cartItem.quantity}
                                        isSelected={selectedItems.has(cartItem.id)}
                                        onSelect={handleItemSelect}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            <div className='mt-[5%] ml-[3%] w-[28%]'>
                <div className='min-h-[80%] bg-white rounded-xl shadow-lg'>
                    <p className='pt-[6%] ml-[5%] text-xl'>
                        Summary
                    </p>
                    <hr />
                    <table className='w-[90%] ml-5 border-separate border-spacing-y-10 text-slate-600'>
                        <tbody>
                            <tr>
                                <td className='w-[60%]'>Subtotal</td>
                                <td>LKR. {selectedSubtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className='w-[60%]'>Delivery Charges</td>
                                <td>LKR. {selectedSubtotal > 0 ? deliveryCharges.toFixed(2) : '0.00'}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='w-[90%] mt-[15%] ml-5 text-lg'>
                        <tbody>
                            <tr>
                                <td className='w-[60%]'>Total</td>
                                <td>LKR. {finalTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='mt-[5%]'>
                        <div 
                            className={`text-center font-semibold text-stone-100 py-3 w-[90%] mx-auto rounded-md transition-colors delay-100 ${
                                selectedItems.size === 0 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-yellow-600 cursor-pointer hover:bg-yellow-700'
                            }`}
                            onClick={selectedItems.size > 0 ? () => {/* Handle checkout */} : undefined}
                        >
                            Proceed to checkout
                        </div>
                    </div>
                    
                    {/* Display selected items count */}
                    <div className='text-center text-sm text-gray-500 mt-2'>
                        {selectedItems.size} of {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} selected
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;