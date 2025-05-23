import { ImBin } from '../utils/Imports';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, selectCartItems, selectCartTotalQuantity, selectCartTotalAmount } from '../reducers/cartSlice';
import CartRow from '../components/CartRow';

const Cart = () => {
    const dispatch = useDispatch();
    
    // Use selectors to get cart data from Redux
    const cartItems = useSelector(selectCartItems);
    const totalQuantity = useSelector(selectCartTotalQuantity);
    const totalAmount = useSelector(selectCartTotalAmount);
    
    const deliveryCharges = 350.00;
    const finalTotal = totalAmount + deliveryCharges;

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    return (
        <div className="flex justify-center overflow-auto h-[92vh]" style={{ backgroundColor: '#F6F6F6' }}>
            <div className='mt-[5%] w-[60%]'>
                <div className='h-[8%] flex items-center text-slate-600 bg-white rounded-xl shadow-lg'>
                    <input type="checkbox" name="" id="" className='ml-7' />
                    <div className='ml-3'>Select All</div>
                    <div 
                        className='ml-auto mr-5 flex cursor-pointer hover:text-red-400'
                        onClick={handleClearCart}
                    >
                        <div className='content-center mr-2'><ImBin /></div>
                        <div>Delete</div>
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
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            <div className='mt-[5%] ml-[3%] w-[25%]'>
                <div className='h-[70%] bg-white rounded-xl shadow-lg'>
                    <p className='pt-[4%] ml-[5%] text-xl'>
                        Summary
                    </p>
                    <hr />
                    <table className='w-[80%] ml-5 border-separate border-spacing-y-10 text-slate-600'>
                        <tbody>
                            <tr>
                                <td className='w-[70%]'>Subtotal</td>
                                <td>LKR. {totalAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className='w-[70%]'>Delivery Charges</td>
                                <td>LKR. {deliveryCharges.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='w-[80%] mt-[15%] ml-5 text-lg'>
                        <tbody>
                            <tr>
                                <td className='w-[70%]'>Total</td>
                                <td>LKR. {finalTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='mt-[5%]'>
                        <div 
                            className={`text-center font-semibold text-stone-100 py-3 w-[90%] mx-auto rounded-md transition-colors delay-100 ${
                                cartItems.length === 0 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-yellow-600 cursor-pointer hover:bg-yellow-700'
                            }`}
                            onClick={cartItems.length > 0 ? () => {/* Handle checkout */} : undefined}
                        >
                            Proceed to checkout
                        </div>
                    </div>
                    
                    {/* Optional: Display total items count */}
                    <div className='text-center text-sm text-gray-500 mt-2'>
                        {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in cart
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;